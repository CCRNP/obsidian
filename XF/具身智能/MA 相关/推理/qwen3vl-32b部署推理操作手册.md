# 训推平台部署 vLLM-Ascend 完整操作手册（模式 B）

> 镜像：vLLM-Ascend v0.18.0rc1（模式B：镜像自启）  
> 硬件：910B（8 * ascend-snt9b 64G）  
> 平台：华为云Stack 训推平台 7.2.0 / HCS 8.6.0  
> 网络：内网离线环境

---

## 总体流程（6 步）

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ 1.构建自 │──>│ 2.推送镜 │──>│ 3.上传模 │──>│ 4.导入模 │──>│ 5.部署在 │──>│ 6.验证推 │
│ 定义镜像  │   │ 像到SWR │   │ 型到OBS  │   │ 型       │   │ 线服务   │   │ 理服务   │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## 第一步：构建自定义镜像

### 1.1 准备文件

将以下 3 个文件放到同一目录（如 `~/vllm-modelarts-image/`）：

- `Dockerfile`
- `start.sh`
- `build.sh`

### 1.2 拉取基础镜像（外网机器）

```bash
# 确保基础镜像已下载
docker pull quay.io/ascend/vllm-ascend:v0.18.0rc1

# 验证
docker images | grep vllm-ascend
```

### 1.3 执行构建

```bash
cd ~/vllm-modelarts-image/
chmod +x build.sh
./build.sh
```

预期输出：
```
==========================================
  构建 vLLM-Ascend 训推平台自定义镜像
==========================================
基础镜像: quay.io/ascend/vllm-ascend:v0.18.0rc1
目标镜像: vllm-ascend-modelarts:0.18.0rc1

[步骤 1/2] 构建 Docker 镜像...
... (构建日志) ...
[步骤 2/2] 验证镜像...
vllm-ascend-modelarts   0.18.0rc1   ...   ~15GB

==========================================
  构建完成！
==========================================
```

### 1.4 （可选）本地快速验证

如果当前机器有 NPU 设备，可以先本地跑一下验证镜像没问题：

```bash
# 启动容器（仅测试镜像能否正常启动，不需要模型）
docker run --rm -it \
  --entrypoint /bin/bash \
  vllm-ascend-modelarts:0.18.0rc1

# 容器内验证
echo $HOME           # 应为 /home/ma-user
whoami               # 应为 ma-user
id                   # 应为 uid=1000
vllm --version       # 确认 vLLM 可用
```

---

## 第二步：推送镜像到内部 SWR

### 2.1 确认 SWR 信息

你需要知道以下信息：

| 信息 | 示例 | 如何获取 |
|------|------|---------|
| SWR 地址 | `swr.cn-north-7.myhuaweicloud.com` | 管理面 / SWR 控制台 |
| 组织名 | `ai-platform` | 在 SWR 中创建的组织 |
| 登录凭证 | 用户名 / 密码 或 AK/SK | SWR 控制台 → 登录指令 |

### 2.2 场景 A：外网机器能直连内网 SWR

```bash
# 打 tag
docker tag vllm-ascend-modelarts:0.18.0rc1 \
  <SWR地址>/<组织名>/vllm-ascend-modelarts:0.18.0rc1

# 登录 SWR（从 SWR 控制台获取登录指令）
docker login -u <用户名> -p <密码> <SWR地址>

# 推送
docker push <SWR地址>/<组织名>/vllm-ascend-modelarts:0.18.0rc1
```

### 2.3 场景 B：外网机器不能直连 SWR（推荐，内网离线场景）

需要先导出镜像为 tar，传进内网，再在内网机器导入并推送。

**外网机器操作：**
```bash
# 导出为 tar
docker save -o vllm-ascend-modelarts-0.18.0rc1.tar vllm-ascend-modelarts:0.18.0rc1

# 查看大小
ls -lh vllm-ascend-modelarts-0.18.0rc1.tar
# 预期约 15GB

# （可选）压缩节省带宽
gzip vllm-ascend-modelarts-0.18.0rc1.tar
# 压缩后约 12-13GB
```

**传输到内网：**
```bash
# 通过 VPN + scp 传输（如果是压缩包）
scp vllm-ascend-modelarts-0.18.0rc1.tar.gz root@<内网机器IP>:/root/

# 大文件建议用 rsync 断点续传
rsync --partial --progress -P vllm-ascend-modelarts-0.18.0rc1.tar.gz \
  root@<内网机器IP>:/root/
```

**内网机器操作：**
```bash
# 如果是压缩包，先解压
gunzip vllm-ascend-modelarts-0.18.0rc1.tar.gz

# 导入镜像
docker load -i vllm-ascend-modelarts-0.18.0rc1.tar

# 打 SWR tag
docker tag vllm-ascend-modelarts:0.18.0rc1 \
  <SWR地址>/<组织名>/vllm-ascend-modelarts:0.18.0rc1

# 登录 SWR
docker login -u <用户名> -p <密码> <SWR地址>

# 推送
docker push <SWR地址>/<组织名>/vllm-ascend-modelarts:0.18.0rc1
```

### 2.4 验证

登录训推平台 → 容器镜像服务 SWR → 我的镜像，确认镜像存在。

---

## 第三步：上传模型权重到 OBS

### 3.1 下载模型（外网机器）

先用 2B 小模型验证，跑通再上 32B。

```bash
pip install modelscope

# 下载 2B 模型（约 4GB）
modelscope download \
  --model Qwen/Qwen3-VL-2B-Instruct \
  --local_dir ./Qwen3-VL-2B-Instruct

# 验证
ls -la ./Qwen3-VL-2B-Instruct/
du -sh ./Qwen3-VL-2B-Instruct/
```

### 3.2 传入内网

```bash
# 打包
tar -czf Qwen3-VL-2B-Instruct.tar.gz Qwen3-VL-2B-Instruct/

# 传输
scp Qwen3-VL-2B-Instruct.tar.gz root@<内网机器IP>:/root/
```

### 3.3 上传到 OBS

**方式一：OBS 控制台网页上传**（小文件推荐）
- 训推平台 → 对象存储服务 OBS → 创建桶 → 上传

**方式二：obsutil 命令行**（大文件推荐）

```bash
# 内网机器解压
cd /root
tar -xzf Qwen3-VL-2B-Instruct.tar.gz

# 上传到 OBS
obsutil cp -r -f ./Qwen3-VL-2B-Instruct obs://<桶名>/models/Qwen3-VL-2B-Instruct/

# 验证
obsutil ls obs://<桶名>/models/Qwen3-VL-2B-Instruct/
```

### 3.4 记录 OBS 路径

```
obs://<桶名>/models/Qwen3-VL-2B-Instruct/
```

> ⚠️ 路径末尾加 `/`，表示挂载整个目录。

---

## 第四步：在训推平台导入模型

### 4.1 进入导入页面

训推平台控制台 → 左侧导航栏 **「模型管理」** → **「模型」** → 点击 **「导入」**

### 4.2 填写基本信息

| 参数 | 填写内容 | 说明 |
|------|---------|------|
| **模型名称** | `vllm-qwen3vl-2b` | 英文+数字，建议有意义 |
| **版本** | `0.0.1` | 语义化版本 |
| **描述** | vLLM-Ascend 部署的 Qwen3-VL-2B 多模态推理服务 | 可选 |

### 4.3 选择模型来源

**模型来源：从容器镜像导入**

| 参数 | 填写内容 | 说明 |
|------|---------|------|
| **镜像地址** | `<SWR地址>/<组织名>/vllm-ascend-modelarts:0.18.0rc1` | 第二步推送的镜像 |
| **模型类型** | `Image` | 自定义镜像自启模式 |
| **部署方式** | 在线服务 | 勾选 |

### 4.4 模型文件

| 参数 | 填写内容 | 说明 |
|------|---------|------|
| **模型文件** | `obs://<桶名>/models/Qwen3-VL-2B-Instruct/` | 模型权重的 OBS 路径 |

> 平台会将这个 OBS 目录挂载到容器内的 `/home/ma-user/model/model/0/` 路径。

### 4.5 完成导入

点击 **「立即创建」**，等待状态变为 **「正常」**。

如果状态变为 **「异常」**，点击查看失败原因，常见原因：
- 镜像地址错误 → 检查 SWR 地址和组织名
- OBS 路径错误 → 检查桶名和路径
- 镜像拉取失败 → 检查网络和 SWR 权限

---

## 第五步：部署在线服务

### 5.1 开始部署

模型管理 → 找到刚导入的模型 → 点击 **「部署」** → **「在线服务」**

### 5.2 填写服务信息

| 参数 | 填写内容 | 说明 |
|------|---------|------|
| **服务名称** | `vllm-qwen3vl-2b-service` | 自定义 |
| **描述** | Qwen3-VL-2B vLLM 推理服务（910B） | 可选 |
| **资源池** | 910B 专属资源池 | 选你的 910B 专属池 |
| **实例规格** | ascend-snt9b 规格 | 选 910B 的规格 |
| **实例数** | 1 | 先开 1 个 |

### 5.3 设置环境变量（重要！）

在 **「环境变量」** 部分添加以下变量：

| 变量名 | 值（2B 模型） | 值（32B 模型） | 说明 |
|--------|-------------|---------------|------|
| `TP_SIZE` | `1` | `2` | 张量并行卡数 |
| `MAX_MODEL_LEN` | `32768` | `32768` | 最大序列长度 |
| `MAX_NUM_SEQS` | `128` | `128` | 最大并发请求数 |
| `GPU_MEM_UTIL` | `0.91` | `0.91` | 显存利用率上限 |
| `SERVED_MODEL_NAME` | `qwen3vl-2b` | `qwen3vl-32b` | 模型服务名 |
| `ENFORCE_EAGER` | `true` | `true` | Eager 模式（CANN 8.x 必须） |

> NPU 驱动相关环境变量（HCCL_OP_EXPANSION_MODE 等）已在镜像内置，一般不需要额外设置。如果需要调整，可以再加。

### 5.4 高级配置

| 参数 | 建议值 | 说明 |
|------|--------|------|
| **规格数量** | 1（2B）/ 2（32B） | 即 NPU 卡数，要和 TP_SIZE 一致 |
| **共享内存大小** | 1GiB | vLLM 需要 |
| **开启 Cloud Shell** | 开启 | 方便调试，强烈建议开启 |
| **开启存储** | 可选 | 如需持久化日志等 |

### 5.5 提交部署

点击 **「下一步」** → 确认信息 → **「提交」**

服务进入 **「部署中」** 状态，等待变为 **「运行中」**。

> ⏱️ 预计部署时间：5-15 分钟（镜像拉取 + 模型加载 + vLLM 启动）

### 5.6 查看部署进度和日志

服务详情页 → **「日志」** Tab

重点关注：
- 镜像拉取是否成功
- 模型文件挂载是否成功
- start.sh 启动日志
- vLLM 启动日志

如果部署失败，查看错误信息。常见问题见文末「常见问题排查」。

---

## 第六步：验证推理服务

### 6.1 获取调用地址

服务详情页 → **「调用指南」** Tab → 复制 API 调用地址

格式示例：
```
https://<服务ID>.inference.hcs.com/
```

### 6.2 获取认证 Token

参考手册 8.2 节获取 Token，或使用 AK/SK 签名方式。

### 6.3 健康检查

```bash
curl -k https://<服务地址>/health
```

返回 `200 OK` 说明服务已就绪。

### 6.4 文本对话测试

```bash
curl -k -X POST "https://<服务地址>/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: <你的Token>" \
  -d '{
    "model": "qwen3vl-2b",
    "messages": [
      {"role": "user", "content": "你好，请用一句话介绍你自己"}
    ],
    "max_tokens": 200,
    "temperature": 0.7
  }'
```

预期返回：
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
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 30,
    "total_tokens": 45
  }
}
```

### 6.5 多模态推理测试（图片 + 文本）

```bash
# 准备一张测试图片，转为 base64
IMG_B64=$(base64 -w 0 test.jpg)

# 调用
curl -k -X POST "https://<服务地址>/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: <你的Token>" \
  -d "{
    \"model\": \"qwen3vl-2b\",
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": [
          {\"type\": \"image_url\", \"image_url\": {\"url\": \"data:image/jpeg;base64,${IMG_B64}\"}},
          {\"type\": \"text\", \"text\": \"请描述这张图片\"}
        ]
      }
    ],
    \"max_tokens\": 300
  }"
```

---

## 从 2B 升级到 32B

验证通过后，升级到 32B 只需要改动 3 处：

| 改动项 | 2B | 32B |
|--------|-----|-----|
| OBS 模型路径 | `obs://桶/models/Qwen3-VL-2B-Instruct/` | `obs://桶/models/Qwen3-VL-32B-Instruct/` |
| 环境变量 TP_SIZE | `1` | `2` |
| 规格数量（卡数） | 1 | 2 |
| SERVED_MODEL_NAME | `qwen3vl-2b` | `qwen3vl-32b` |

镜像和代码都不用改。

---

## 常见问题排查

### Q1：服务一直"部署中"，超过 15 分钟还没好

**正常吗？** 2B 模型 5-10 分钟正常，32B 可能需要 10-20 分钟。如果超过 20 分钟还没好，需要排查。

**排查步骤**：
1. 打开 Cloud Shell，进入容器
2. 执行 `ps aux | grep vllm`，看 vLLM 进程是否在跑
3. 查看容器日志，看卡在什么地方
4. 如果卡在模型加载，正常，大模型加载慢
5. 如果报错，看报错信息

### Q2：服务状态"异常"

**排查步骤**：
1. 服务详情 → 事件，看失败原因
2. 服务详情 → 日志，看完整日志
3. 常见原因：
   - 镜像拉取失败 → SWR 地址/权限不对
   - 模型挂载失败 → OBS 路径不对
   - 容器启动失败 → start.sh 有问题
   - vLLM 启动报错 → 模型文件损坏 / 显存不足

### Q3：Cloud Shell 进不去容器

1. 确认部署时勾选了"开启 Cloud Shell"
2. 确认服务状态不是"部署中"（部署中可能进不去）
3. 试试从日志看输出

### Q4：推理时报错 "model not found"

原因：请求的 `model` 参数值和 `SERVED_MODEL_NAME` 不一致。

解决：将请求中的 `model` 改为你设置的 `SERVED_MODEL_NAME` 值。

### Q5：NPU 显存不足（OOM）

报错关键词：`Out of memory`, `memory allocation failed`

解决：
- 减小 `MAX_MODEL_LEN`（如从 32768 降到 16384）
- 减小 `MAX_NUM_SEQS`（如从 128 降到 32）
- 减小 `GPU_MEM_UTIL`（如从 0.91 降到 0.8）
- 增加卡数（提高规格数量和 TP_SIZE）

### Q6：调用返回 503 Service Unavailable

说明 vLLM 还没启动完成，等一会儿再试。

如果一直 503，进入容器看日志，可能 vLLM 启动失败了。

### Q7：容器内看不到 NPU

1. 确认资源池是 910B (Snt9b) 类型
2. 确认实例规格选的是 NPU 规格
3. 进入容器执行 `npu-smi info` 验证

---

## 环境变量速查表

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `MODEL_PATH` | `/home/ma-user/model/model/0/` | 模型挂载路径（一般不用改） |
| `PORT` | `8080` | 服务监听端口（必须 8080） |
| `TP_SIZE` | `1` | 张量并行卡数 |
| `MAX_MODEL_LEN` | `32768` | 最大上下文长度 |
| `MAX_NUM_SEQS` | `128` | 最大并发请求数 |
| `GPU_MEM_UTIL` | `0.91` | NPU 显存利用率上限 |
| `DTYPE` | `bfloat16` | 数据类型 |
| `SERVED_MODEL_NAME` | `vllm-model` | 服务的模型名 |
| `ENFORCE_EAGER` | `true` | Eager 模式（CANN 8.x 必须设 true） |
| `TRUST_REMOTE_CODE` | `true` | 信任模型的自定义代码 |
| `HCCL_OP_EXPANSION_MODE` | `AIV` | HCCL 算子扩展模式 |
| `PYTORCH_NPU_ALLOC_CONF` | `expandable_segments:True` | NPU 内存分配策略 |
| `OMP_PROC_BIND` | `false` | OpenMP 线程绑定 |
| `OMP_NUM_THREADS` | `1` | OpenMP 线程数 |
| `TASK_QUEUE_ENABLE` | `1` | 任务队列开关 |

---

## 操作清单

- [ ] **第一步：构建自定义镜像**
  - [ ] 准备 Dockerfile + start.sh + build.sh
  - [ ] 拉取基础镜像
  - [ ] 执行构建
  - [ ] 验证镜像存在

- [ ] **第二步：推送镜像到 SWR**
  - [ ] 获取 SWR 地址、组织名、登录凭证
  - [ ] 导出镜像 tar（离线场景）
  - [ ] 传输到内网
  - [ ] 内网导入 + 打 tag + 推送
  - [ ] SWR 控制台验证

- [ ] **第三步：上传模型到 OBS**
  - [ ] 下载 2B 模型
  - [ ] 打包传输到内网
  - [ ] 上传到 OBS 桶
  - [ ] 验证 OBS 路径

- [ ] **第四步：导入模型**
  - [ ] 模型管理 → 导入
  - [ ] 填模型名称、版本
  - [ ] 选从容器镜像导入，填镜像地址
  - [ ] 选 model_type: Image
  - [ ] 填模型文件 OBS 路径
  - [ ] 等待状态变为正常

- [ ] **第五步：部署在线服务**
  - [ ] 模型 → 部署 → 在线服务
  - [ ] 选 910B 资源池 + NPU 规格
  - [ ] 设置环境变量（TP_SIZE 等）
  - [ ] 开启 Cloud Shell
  - [ ] 提交部署
  - [ ] 等待运行中

- [ ] **第六步：验证**
  - [ ] /health 健康检查
  - [ ] 文本对话测试
  - [ ] 多模态推理测试
