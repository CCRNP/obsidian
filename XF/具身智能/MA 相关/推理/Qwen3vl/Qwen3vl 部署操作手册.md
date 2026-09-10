---
tags:
  - MA-推理
---

## vLLM-Ascend 训推平台部署 Qwen3-VL-32B-Instruct 完整操作手册

> 镜像：vLLM-Ascend v0.18.0rc1  
> 硬件：910B（Ascend Snt9b 64G）  
> 平台：华为云Stack 训推平台 7.2.0 / HCS 8.6.0  
> 模型来源：从容器镜像中选择（手册第5117行）  
> 网络：内网离线环境  
> SWR 地址：swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1

---

## 核心架构

```
┌─────────────────────────────────────────────────────────────┐
│  自定义镜像（SWR）                    │  OBS 模型目录       │
│  ┌──────────────────────────┐         │  ┌──────────────┐  │
│  │ vLLM-Ascend 框架         │         │  │ weight/      │  │
│  │ ma-user (uid=1000)       │         │  │   config.json│  │
│  │ gid=100                  │         │  │   *.safetensors│ │
│  │ /home/ma-user/run.sh ←内置│        │  │   tokenizer.json│ │
│  │ ENTRYPOINT run.sh        │         │  └──────────────┘  │
│  └──────────────────────────┘         │  （不含 run.sh）   │
│  run.sh 不在挂载点，不会被 OBS 覆盖    │                    │
└─────────────────────────────────────────────────────────────┘
           ↑                                    ↑
     第4步创建模型时指定              第5步部署在线服务时挂载
     （只选镜像+配接口）              （OBS weight/→/home/mind/model/）
```

**关键理解**：
- **创建模型**（第4步）：只选容器镜像 + 配置容器调用接口 + 定义 apis。没有"AI引擎"，没有"模型文件路径"。
- **部署在线服务**（第5步）：挂载 OBS 模型目录到容器 `/home/mind/model/`，权重在 `weight/` 子目录。
- run.sh 已打入镜像 `/home/ma-user/run.sh`（不在 OBS 挂载点，不会被覆盖），用绝对路径读取 `/home/mind/model/weight/` 下的模型权重。

---

## 总体流程（6 步）

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ 1.构建自 │──>│ 2.推送镜 │──>│ 3.上传模 │──>│ 4.创建模 │──>│ 5.部署在 │──>│ 6.验证推 │
│ 定义镜像  │   │ 像到SWR │   │ 型权重   │   │ 型       │   │ 线服务   │   │ 理服务   │
│(框架+run │   │         │   │  到OBS   │   │(镜像+接口)│   │(挂载OBS) │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## 第一步：构建自定义镜像

### 1.1 准备文件

将 `Dockerfile`、`run.sh` 和 `build.sh` 放到同一目录。**run.sh 会打入镜像**，OBS 上只需要放模型权重。

### 1.2 拉取基础镜像（外网机器）

```bash
docker pull quay.io/ascend/vllm-ascend:v0.18.0rc1
```

### 1.3 执行构建

```bash
chmod +x build.sh
./build.sh
```

build.sh 会自动完成构建 + 打标签，目标 SWR 镜像地址：
```
swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1
```

### 1.4 镜像内容确认

构建后的镜像包含：
- vLLM-Ascend 框架（来自基础镜像）
- ma-user 用户（uid=1000, gid=100）
- `/home/mind/model/` 目录（OBS 挂载点）
- `run.sh`（已打入 `/home/ma-user/run.sh`，不在挂载点，不会被覆盖）
- NPU 环境变量
- ENTRYPOINT 指向 `/home/ma-user/run.sh`

**不包含**：模型权重（权重在 OBS，部署时挂载到 `/home/mind/model/`）

---

## 第二步：推送镜像到 SWR

### 2.1 场景 A：外网机器能直连内网 SWR

```bash
docker login -u <用户名> -p <密码> swr.gdrising-global-1.air.gdrising.com.cn
docker push swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1
```

### 2.2 场景 B：外网机器不能直连 SWR（离线环境推荐）

```bash
# 外网：导出
docker save -o qwen3vl-32b-instruct.tar swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1

# 传输
scp qwen3vl-32b-instruct.tar root@<内网机器IP>:/root/

# 内网：导入 + 推送
docker load -i qwen3vl-32b-instruct.tar
docker login -u <用户名> -p <密码> swr.gdrising-global-1.air.gdrising.com.cn
docker push swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1
```

---

## 第三步：上传模型权重到 OBS

### 3.1 OBS 模型目录结构

```
obs://<桶名>/models/qwen3vl-32b/
└── weight/                          # 模型权重子目录
    ├── config.json                  # HuggingFace 模型配置（模型自带的）
    ├── model-00001-of-0000X.safetensors
    ├── model.safetensors.index.json
    ├── tokenizer.json
    ├── tokenizer_config.json
    └── ...
```

> **注意**：OBS 目录只放模型权重，不需要放 run.sh（run.sh 已打入镜像）。

### 3.2 下载模型权重（外网机器）

```bash
pip install modelscope
modelscope download --model Qwen/Qwen3-VL-32B-Instruct --local_dir ./weight
```

### 3.3 传入内网 + 上传 OBS

```bash
# 打包传输
tar -czf weight.tar.gz weight/
scp weight.tar.gz root@<内网机器IP>:/root/

# 内网解压
tar -xzf weight.tar.gz

# 上传到 OBS
obsutil cp -r ./weight obs://<桶名>/models/qwen3vl-32b/weight/
```

### 3.4 记录 OBS 路径

```
obs://<桶名>/models/qwen3vl-32b/
```

---

## 第四步：在训推平台创建模型

### 4.1 进入创建页面

训推平台控制台 → 左侧导航栏 **「模型管理」** → **「模型」** → 点击 **「创建」**

### 4.2 填写基本信息

| 参数 | 填写内容 |
|------|---------|
| 模型名称 | `vllm-qwen3vl-32b` |
| 版本 | `0.0.1` |
| 描述 | vLLM-Ascend 部署的 Qwen3-VL-32B-Instruct |

### 4.3 选择模型来源（关键！）

**元模型来源：从容器镜像中选择**（手册第5117-5123行）

| 参数 | 填写内容 | 说明 |
|------|---------|------|
| **容器镜像所在的路径** | `swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1` | 第二步推送的镜像 |
| **容器调用接口** | **协议：http，端口：8080** | 必须和镜像内 vLLM 监听端口一致（手册第5120行） |
| **镜像复制** | 关闭 | 保持默认 |
| **健康检查** | 可选开启 | vLLM 有 /health 接口 |
| **apis定义** | **在线编辑**（见下方） | 定义推理接口，手册第5123行 |

> **注意**：从容器镜像中选择时，没有"AI引擎"选项，也没有"模型文件路径"。模型权重是在第五步部署在线服务时挂载的。

### 4.4 apis 定义（在线编辑）

在创建模型页面的「apis定义」区域，选择「在线编辑」，填入以下内容：

```json
[{
    "protocol": "http",
    "url": "/v1/chat/completions",
    "method": "post",
    "request": {
        "Content-type": "application/json",
        "data": {
            "type": "object",
            "properties": {
                "model": {"type": "string"},
                "messages": {"type": "array"},
                "max_tokens": {"type": "number"},
                "temperature": {"type": "number"}
            }
        }
    },
    "response": {
        "Content-type": "application/json",
        "data": {
            "type": "object",
            "properties": {
                "id": {"type": "string"},
                "choices": {"type": "array"},
                "usage": {"type": "object"}
            }
        }
    }
}]
```

> apis 的 url `/v1/chat/completions` 必须和镜像内 vLLM 实际服务的路径一致（手册第5123行）。

### 4.5 完成创建

点击 **「立即创建」**，等待状态变为 **「正常」**。

---

## 第五步：部署在线服务（挂载模型权重）

### 5.1 开始部署

模型管理 → 找到刚创建的模型 → 点击 **「部署」** → **「在线服务」**

### 5.2 填写服务信息

| 参数 | 填写内容 | 说明 |
|------|---------|------|
| 服务名称 | `vllm-qwen3vl-32b-service` | 自定义 |
| 资源池 | 910B 专属资源池 | 选你的 910B 专属池 |
| 实例规格 | ascend-snt9b 规格 | 选 910B 的规格 |
| 实例数 | 1 | 先开 1 个 |

### 5.3 挂载模型文件（关键！）

在部署页面，配置 **模型文件路径**（OBS 路径）：

| 参数 | 填写内容 | 说明 |
|------|---------|------|
| **模型文件路径** | `obs://<桶名>/models/qwen3vl-32b/` | 第三步上传的 OBS 目录 |

> 平台会将此 OBS 目录下的所有文件挂载到容器内 `/home/mind/model/` 路径。  
> 挂载后容器内结构：
> ```
> /home/ma-user/
> └── run.sh            ← 来自镜像（不在挂载点，不会被覆盖）
>
> /home/mind/model/      ← OBS 挂载点（Docker 挂载覆盖此目录原有内容）
> └── weight/
>     ├── config.json
>     ├── *.safetensors
>     └── ...
> ```
> ENTRYPOINT 执行 `/home/ma-user/run.sh`，run.sh 用绝对路径读取 `/home/mind/model/weight/` 下的模型权重启动 vLLM。

> **说明**：run.sh 放在 `/home/ma-user/` 而不是 `/home/mind/model/`，是因为 Docker 挂载会覆盖挂载点目录下的所有内容。如果 run.sh 放在挂载点内，会被 OBS 内容覆盖掉。

### 5.4 设置环境变量

| 变量名 | 值 | 说明 |
|--------|---------|------|
| `TP_SIZE` | `2` | 32B 模型建议 2 卡张量并行 |
| `MAX_MODEL_LEN` | `32768` | 最大序列长度 |
| `MAX_NUM_SEQS` | `128` | 最大并发请求数 |
| `GPU_MEM_UTIL` | `0.91` | 显存利用率上限 |
| `SERVED_MODEL_NAME` | `qwen3vl-32b` | 模型服务名 |

### 5.5 提交部署

点击 **「下一步」** → 确认 → **「提交」**

等待状态从「部署中」变为 **「运行中」**。预计 10-30 分钟。

> **提示**：大模型部署建议配置较长的「部署超时时间」，避免未启动完成就被判定超时。

---

## 第六步：验证推理服务

### 6.1 获取调用地址

服务详情页 → **「调用指南」** Tab → 复制 API 调用地址

### 6.2 健康检查

```bash
curl -k https://<服务地址>/health
```

### 6.3 文本对话测试

```bash
curl -k -X POST "https://<服务地址>/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: <你的Token>" \
  -d '{
    "model": "qwen3vl-32b",
    "messages": [{"role": "user", "content": "你好"}],
    "max_tokens": 200
  }'
```

### 6.4 多模态测试（图片+文本）

```bash
IMG_B64=$(base64 -w 0 test.jpg)
curl -k -X POST "https://<服务地址>/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: <你的Token>" \
  -d "{
    \"model\": \"qwen3vl-32b\",
    \"messages\": [{
      \"role\": \"user\",
      \"content\": [
        {\"type\": \"image_url\", \"image_url\": {\"url\": \"data:image/jpeg;base64,${IMG_B64}\"}},
        {\"type\": \"text\", \"text\": \"描述这张图片\"}
      ]
    }],
    \"max_tokens\": 300
  }"
```

---

## 常见问题

### Q1：服务一直"部署中"

进入 Cloud Shell 或查看日志，确认：
1. OBS 模型目录是否正确挂载到 `/home/mind/model/`
2. `/home/ma-user/run.sh` 是否存在（来自镜像，不会被 OBS 覆盖）
3. vLLM 启动日志是否有报错
4. NPU 设备是否可见（`npu-smi info`）

### Q2：容器启动报 "run.sh not found"

run.sh 位于 `/home/ma-user/run.sh`，不在 OBS 挂载点内，正常情况下不会被覆盖。如果仍找不到，检查镜像是否正确构建。

### Q3：容器调用接口报错

确保创建模型时「容器调用接口」配置的端口（8080）与 run.sh 中 vLLM 监听的端口（PORT=8080）一致。

### Q4：NPU 显存不足

- 减小 MAX_MODEL_LEN
- 减小 MAX_NUM_SEQS
- 增加卡数（提高 TP_SIZE 和规格数量）

---

## 操作清单

- [ ] **第一步：构建镜像**（框架 + run.sh 打入镜像）
  - [ ] 拉取基础镜像
  - [ ] 确认 Dockerfile、run.sh、build.sh 在同目录
  - [ ] 执行 build.sh
  - [ ] 确认镜像存在

- [ ] **第二步：推送镜像到 SWR**
  - [ ] 导出 tar（离线场景）
  - [ ] 传输到内网
  - [ ] 导入 + 登录 + 推送
  - [ ] SWR 控制台验证

- [ ] **第三步：上传模型权重到 OBS**（不需要上传 run.sh）
  - [ ] 下载模型权重
  - [ ] 传输到内网
  - [ ] 上传 weight/ 到 OBS
  - [ ] 验证 OBS 目录结构

- [ ] **第四步：创建模型**（只有镜像和接口，没有模型文件路径）
  - [ ] 元模型来源：从容器镜像中选择
  - [ ] 容器镜像路径：swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1
  - [ ] **容器调用接口：http，端口 8080**
  - [ ] **apis定义：在线编辑，填入 /v1/chat/completions**
  - [ ] 等待状态变为正常

- [ ] **第五步：部署在线服务**（此时挂载 OBS 模型权重）
  - [ ] 选 910B 资源池 + NPU 规格
  - [ ] **模型文件路径：填 OBS 目录**
  - [ ] 设环境变量 TP_SIZE=2
  - [ ] 配置部署超时时间（建议 30 分钟）
  - [ ] 等待运行中

- [ ] **第六步：验证**
  - [ ] /health 健康检查
  - [ ] 文本对话
  - [ ] 多模态推理
