# Qwen3-VL-2B-Instruct 910B 部署验证指南

> 环境：华为云 HCS 8.6.0 / 训推平台 7.2.0 / 910B（8*ascend-snt9b 64G）/ 内网离线
> 目的：验证 vLLM-Ascend + 910B 推理链路可用性，为后续 32B 部署铺路

---

## 一、整体流程

```
外网机器                    VPN传输                    910B 内网服务器
┌─────────────┐         ┌──────────┐            ┌──────────────────┐
│ 1.下载2B权重 │         │          │            │ 4.导入镜像        │
│ 2.构建Docker  │──scp──> │  tar文件  │ ────────> │ 5.启动容器+推理    │
│   镜像       │         │  ~19GB   │            │ 6.curl验证        │
│ 3.导出tar    │         │          │            │                   │
└─────────────┘         └──────────┘            └──────────────────┘
```

---

## 二、外网机器操作（步骤1-3）

### 前提条件

- Docker 已安装
- Python 3.8+ 已安装
- 能访问公网（ModelScope / Docker Hub / quay.io）

### 步骤1：下载 Qwen3-VL-2B-Instruct 模型权重

```bash
# 创建工作目录
mkdir -p ~/qwen3vl-deploy && cd ~/qwen3vl-deploy

# 安装 modelscope
pip install modelscope

# 下载模型（约 4GB）
modelscope download \
  --model Qwen/Qwen3-VL-2B-Instruct \
  --local_dir ./Qwen3-VL-2B-Instruct

# 验证下载完整性
ls -lh ./Qwen3-VL-2B-Instruct/
# 预期看到：config.json, model-*.safetensors, tokenizer.json 等
du -sh ./Qwen3-VL-2B-Instruct/
# 预期：约 4GB
```

### 步骤2：创建 Dockerfile 并构建镜像

```bash
cd ~/qwen3vl-deploy

# 创建 Dockerfile
cat > Dockerfile << 'EOF'
FROM quay.io/ascend/vllm-ascend:v0.22.1rc1

# 将模型权重复制到镜像内
COPY ./Qwen3-VL-2B-Instruct /models/Qwen3-VL-2B-Instruct

# 设置工作目录
WORKDIR /workspace

# 验证模型文件存在（构建时检查）
RUN ls -la /models/Qwen3-VL-2B-Instruct/config.json

# 设置默认入口
CMD ["/bin/bash"]
EOF

# 构建镜像
docker build -t vllm-ascend-qwen3vl-2b:v1 .

# 验证镜像
docker images | grep vllm-ascend-qwen3vl-2b
# 预期：镜像大小约 19GB
```

### 步骤3：导出镜像为 tar 文件

```bash
# 导出
docker save -o vllm-ascend-qwen3vl-2b.tar vllm-ascend-qwen3vl-2b:v1

# 查看文件大小
ls -lh vllm-ascend-qwen3vl-2b.tar
# 预期：约 19GB

# 可选：压缩传输（节省带宽，但解压需要额外时间+空间）
gzip vllm-ascend-qwen3vl-2b.tar
# 压缩后约 16-17GB
ls -lh vllm-ascend-qwen3vl-2b.tar.gz
```

---

## 三、传输到 910B 服务器（VPN + SCP）

```bash
# 从外网机器 scp 到 910B（需通过 VPN 接入内网）
# 如果用了 gzip 压缩：
scp vllm-ascend-qwen3vl-2b.tar.gz root@<910B-IP>:/root/

# 如果没有压缩：
scp vllm-ascend-qwen3vl-2b.tar root@<910B-IP>:/root/

# 传输预估时间（参考）：
# - 不压缩 19GB，10Mbps 带宽：约 4.4 小时
# - 不压缩 19GB，50Mbps 带宽：约 53 分钟
# - 压缩 17GB，10Mbps 带宽：约 3.9 小时
# - 压缩 17GB，50Mbps 带宽：约 47 分钟
```

> **提示**：如果 scp 中断，可以用 `rsync --partial --progress` 断点续传：
> ```bash
> rsync --partial --progress vllm-ascend-qwen3vl-2b.tar.gz root@<910B-IP>:/root/
> ```

---

## 四、910B 服务器操作（步骤4-6）

### 步骤4：导入 Docker 镜像

```bash
# SSH 登录 910B 服务器后
cd /root

# 先检查磁盘空间（至少需要 40GB 可用）
df -h /root

# 如果是 gzip 压缩文件，先解压
gunzip vllm-ascend-qwen3vl-2b.tar.gz

# 导入镜像
docker load -i vllm-ascend-qwen3vl-2b.tar
# 预期输出：Loaded image: vllm-ascend-qwen3vl-2b:v1

# 确认镜像已导入
docker images | grep vllm-ascend-qwen3vl-2b
```

### 步骤4.5：验证宿主机环境

```bash
# 检查 NPU 状态
npu-smi info
# 预期：看到 8 张 ascend-snt9b 卡，状态正常

# 检查驱动版本
cat /usr/local/Ascend/driver/version.info
# 预期：Version=25.2.2 或类似

# 检查 Docker
docker --version
# 预期：Docker version 20.x+ 或更高

# 检查 /etc/ascend_install.info 是否存在
ls -la /etc/ascend_install.info
```

### 步骤5：启动容器并运行推理

#### 5a. 启动容器

```bash
docker run --rm \
  --name vllm-test \
  --net=host \
  --shm-size=1g \
  --privileged=true \
  --device /dev/davinci0 \
  --device /dev/davinci1 \
  --device /dev/davinci2 \
  --device /dev/davinci3 \
  --device /dev/davinci4 \
  --device /dev/davinci5 \
  --device /dev/davinci6 \
  --device /dev/davinci7 \
  --device /dev/davinci_manager \
  --device /dev/hisi_hdc \
  --device /dev/devmm_svm \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
  -v /etc/ascend_install.info:/etc/ascend_install.info \
  -it vllm-ascend-qwen3vl-2b:v1 bash
```

#### 5b. 容器内验证环境

```bash
# 确认容器内能看到 NPU
npu-smi info
# 预期：看到 8 张卡

# 确认 vLLM-Ascend 已安装
pip show vllm-ascend
# 预期：显示版本号

# 确认 torch_npu 可用
python -c "import torch_npu; print('torch_npu version:', torch_npu.__version__)"
# 预期：输出版本号，无报错

# 确认模型权重存在
ls -la /models/Qwen3-VL-2B-Instruct/
# 预期：看到 config.json 和 safetensors 文件
```

#### 5c. 容器内启动推理服务

```bash
# 设置环境变量
export HCCL_OP_EXPANSION_MODE="AIV"
export PYTORCH_NPU_ALLOC_CONF=expandable_segments:True
export OMP_PROC_BIND=false
export OMP_NUM_THREADS=1
export TASK_QUEUE_ENABLE=1

# 用单卡启动（2B 模型单卡 64G 足够）
vllm serve /models/Qwen3-VL-2B-Instruct \
  --host 0.0.0.0 \
  --port 8000 \
  --dtype bfloat16 \
  --tensor-parallel-size 1 \
  --trust-remote-code \
  --max-model-len 32768 \
  --max-num-seqs 128 \
  --gpu-memory-utilization 0.91 \
  --enforce-eager \
  --mm-processor-cache-gb 0
```

> **关键参数说明**：
> - `--enforce-eager`：CANN 8.5.0 不支持图编译（需 CANN≥9.0），必须用 eager 模式
> - `--tensor-parallel-size 1`：2B 模型单卡 64G 够用，无需张量并行
> - `--max-model-len 32768`：限制最大上下文长度，防止 KV cache 溢出
> - `--gpu-memory-utilization 0.91`：NPU 显存利用率上限

> **预期启动日志**：
> ```
> INFO:     Started server process [xxxx]
> INFO:     Waiting for application startup.
> INFO:     Application startup complete.
> ```
> 启动过程可能需要 2-5 分钟（模型加载+初始化）

### 步骤6：验证推理服务

**另开一个 SSH 终端**连接到 910B 服务器，执行以下验证：

#### 6a. 基础连通性验证

```bash
# 检查服务是否存活
curl http://localhost:8000/health
# 预期：返回 200 OK
```

#### 6b. 文本对话验证

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "/models/Qwen3-VL-2B-Instruct",
    "messages": [
      {"role": "user", "content": "你好，请用一句话介绍你自己"}
    ],
    "max_tokens": 100
  }'
```

预期返回类似：
```json
{
  "id": "chatcmpl-xxx",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "我是Qwen3-VL多模态大语言模型..."
    },
    "finish_reason": "stop"
  }],
  "usage": {"prompt_tokens": 15, "completion_tokens": 30, "total_tokens": 45}
}
```

#### 6c. 多模态（图片+文本）验证

准备一张测试图片的 base64 编码（可先用一张小图）：

```bash
# 将测试图片转为 base64（在 910B 上任意一张图片）
# 如果没有图片，可以用以下方式生成一个简单的测试图
python3 -c "
import base64
# 1x1 红色像素的 PNG
red_pixel_png = bytes.fromhex(
    '89504e470d0a1a0a0000000d49484452000000010000000108020000'
    '00907753de0000000c49444154089963600100000005000100'
    '0d0a2db40000000049454e44ae426082'
)
print(base64.b64encode(red_pixel_png).decode())
" > /tmp/img_b64.txt

IMG_B64=$(cat /tmp/img_b64.txt)

# 多模态推理请求
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"/models/Qwen3-VL-2B-Instruct\",
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": [
          {\"type\": \"image_url\", \"image_url\": {\"url\": \"data:image/png;base64,${IMG_B64}\"}},
          {\"type\": \"text\", \"text\": \"请描述这张图片\"}
        ]
      }
    ],
    \"max_tokens\": 200
  }"
```

#### 6d. 查看模型信息

```bash
curl http://localhost:8000/v1/models
# 预期：返回模型列表
```

---

## 五、验证通过后的下一步

### 2B 验证通过 → 部署 32B

2B 验证成功说明技术栈没问题。接下来部署 32B 时：

| 变更项 | 2B（当前） | 32B（下一步） |
|--------|-----------|-------------|
| 模型权重 | 4GB（打进镜像） | 64GB（单独 scp 传入） |
| 启动参数 | tp=1（单卡） | tp=2（双卡张量并行） |
| 传输方式 | 一个 tar 包搞定 | 镜像 tar + 权重 scp 分开传 |
| 显存占用 | ~10GB/卡 | ~45GB/2卡 |

32B 部署命令（裸金属直接 Docker）：

```bash
# 权重单独挂载，不打进镜像
docker run --rm \
  --name vllm-32b \
  --net=host \
  --shm-size=1g \
  --privileged=true \
  --device /dev/davinci0 \
  --device /dev/davinci1 \
  --device /dev/davinci_manager \
  --device /dev/hisi_hdc \
  --device /dev/devmm_svm \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
  -v /etc/ascend_install.info:/etc/ascend_install.info \
  -v /root/models/Qwen3-VL-32B-Instruct:/models/Qwen3-VL-32B-Instruct \
  -it quay.io/ascend/vllm-ascend:v0.22.1rc1 bash

# 容器内
vllm serve /models/Qwen3-VL-32B-Instruct \
  --host 0.0.0.0 --port 8000 \
  --dtype bfloat16 \
  --tensor-parallel-size 2 \
  --trust-remote-code \
  --max-model-len 32768 \
  --max-num-seqs 128 \
  --gpu-memory-utilization 0.91 \
  --enforce-eager \
  --mm-processor-cache-gb 0
```

---

## 六、常见问题排查

### 问题1：容器内 npu-smi info 看不到卡

**原因**：NPU 设备未正确挂载到容器

**排查**：
```bash
# 宿主机检查设备文件是否存在
ls -la /dev/davinci*
# 预期：看到 davinci0 ~ davinci7, davinci_manager 等

# 检查 docker run 命令中 --device 参数是否完整
```

### 问题2：vllm serve 启动报错 "No available NPU device"

**原因**：ASCEND_RT_VISIBLE_DEVICES 未设置或设置错误

**解决**：
```bash
# 容器内设置可见设备
export ASCEND_RT_VISIBLE_DEVICES=0
# 然后重新启动 vllm serve
```

### 问题3：启动报错 "CANN version mismatch"

**原因**：镜像内 CANN 版本与宿主机驱动不兼容

**排查**：
```bash
# 容器内检查 CANN 版本
cat /usr/local/Ascend/ascend-toolkit/latest/version.cfg 2>/dev/null || \
  pip show torch-npu | grep Version

# 宿主机检查驱动版本
cat /usr/local/Ascend/driver/version.info
```

**解决**：如果 CANN 8.5.0 与 HDK 25.2.2 不兼容，需换用 CANN 8.2.RC1 的镜像。

### 问题4：启动报错 "RuntimeError: Out of memory"

**原因**：显存不足

**解决**：
```bash
# 降低显存利用率
--gpu-memory-utilization 0.8

# 减小最大序列长度
--max-model-len 16384

# 减少并发请求数
--max-num-seqs 32
```

### 问题5：启动很慢（超过 10 分钟）

**可能原因**：
- 模型加载中（64GB 权重加载需要时间）—— 正常
- 首次运行编译算子 —— 正常，eager 模式下较快

**排查**：
```bash
# 查看容器日志
docker logs vllm-test

# 查看是否有报错
docker logs vllm-test 2>&1 | grep -i error
```

### 问题6：curl 请求超时

**排查**：
```bash
# 确认服务是否已启动完成
curl http://localhost:8000/health

# 如果返回 503，说明还在加载中，等待即可
# 如果连接拒绝，说明服务未启动，检查日志
```

---

## 七、环境变量速查

| 变量 | 值 | 作用 |
|------|-----|------|
| HCCL_OP_EXPANSION_MODE | AIV | HCCL 算子扩展模式 |
| PYTORCH_NPU_ALLOC_CONF | expandable_segments:True | NPU 内存分配策略 |
| OMP_PROC_BIND | false | OpenMP 线程绑定 |
| OMP_NUM_THREADS | 1 | OpenMP 线程数 |
| TASK_QUEUE_ENABLE | 1 | 任务队列开关 |
| ASCEND_RT_VISIBLE_DEVICES | 0 或 0,1 | 可见 NPU 设备 |

---

## 八、操作清单（打勾用）

### 外网机器
- [ ] 下载 Qwen3-VL-2B-Instruct 权重（~4GB）
- [ ] 编写 Dockerfile
- [ ] 构建镜像 vllm-ascend-qwen3vl-2b:v1
- [ ] 导出 tar 文件（~19GB）
- [ ] （可选）gzip 压缩

### 传输
- [ ] scp/rsync 传输到 910B 服务器
- [ ] 传输完整性校验（md5sum 或文件大小对比）

### 910B 服务器
- [ ] 检查磁盘空间（≥40GB）
- [ ] 导入 Docker 镜像
- [ ] npu-smi info 确认 8 卡正常
- [ ] 启动容器
- [ ] 容器内 npu-smi info 确认可见
- [ ] 容器内 pip show vllm-ascend 确认版本
- [ ] 启动 vllm serve
- [ ] curl /health 确认服务存活
- [ ] curl 文本对话验证
- [ ] curl 多模态验证
