---
tags:
  - MA-推理
---

## 一、环境与基础

| 项目 | 内容 |
|---|---|
| 平台 | 华为云 ModelArts 训推平台 |
| 硬件 | 昇腾 910B2，8卡，单卡 64GB 显存 |
| 模型 | Qwen3-VL-32B-Instruct（BF16，约60-65GB） |
| 推理框架 | vLLM-Ascend v0.18.0rc1 |
| 基础镜像 | `quay.io/ascend/vllm-ascend:v0.18.0rc1` |
| 架构 | ARM (aarch64) |
| 网络 | 内网离线环境 |

---

## 二、构建自定义镜像

**目的**：让容器启动时自动执行 `run.sh`，拉起 vLLM 服务，并符合 ModelArts 规范。

**关键步骤**：
1. 基于官方镜像，创建 `ma-user`（UID=1000，GID=100）。基础镜像已有 GID 100，所以**跳过 `groupadd`**，直接用 `useradd -u 1000 -g 100`。
2. 把 `run.sh` 放入 **非挂载目录**（`/home/ma-user/run.sh`），避免被 OBS 挂载覆盖。
3. 设置 `ENTRYPOINT ["/bin/sh", "-c", "bash /home/ma-user/run.sh"]`。
4. 暴露 8080 端口，配置健康检查 `/health`。
5. 通过 `build.sh` 构建镜像，打 tag 推送到 SWR。

**最终镜像地址**：
```
swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v5-local-media
```

---

## 三、准备模型权重

- 从 ModelScope 下载 Qwen3-VL-32B-Instruct 权重。
- 上传到 OBS 桶，路径例如：
  ```
  obs://Qwen/Qwen3-VL-32B-Instruct/
  ```
  权重文件（config.json、safetensors）直接放在该目录下。

---

## 四、在 ModelArts 创建模型

- 进入「模型管理」→「导入」。
- 模型来源：**从容器镜像导入**。
- 镜像地址：填 SWR 中的自定义镜像。
- 模型类型：**Image**（自定义镜像自启）。
- 容器调用接口：**HTTP 协议，8080 端口**。
- 配置 `apis` 定义（使用标准 `request`/`response` 格式，不要用 `input_params`）。
- 模型文件路径：填 OBS 权重目录（但实际部署时通过存储挂载）。

---

## 五、部署在线服务

**关键配置**：

| 配置项 | 值 |
|---|---|
| 资源池 | 910B 专属资源池 |
| 自定义规格 | Ascend **2卡**，CPU 24核，内存 96GB |
| 存储挂载 | OBS 权重路径 → 容器内 `/home/mind/model/` |
| 环境变量 | `TP_SIZE=2`、`SERVED_MODEL_NAME=qwen3vl-32b`、`MAX_MODEL_LEN=8192`、`GPU_MEM_UTIL=0.91`、`ENFORCE_EAGER=true` |
| 启动命令 | 留空（使用镜像内 ENTRYPOINT） |
| Cloud Shell | 开启，便于调试 |

**run.sh 核心命令**：
```bash
exec vllm serve "$MODEL_PATH" \
    --host 0.0.0.0 \
    --port 8080 \
    --dtype bfloat16 \
    --tensor-parallel-size 2 \
    --served-model-name qwen3vl-32b \
    --max-model-len 8192 \
    --max-num-seqs 128 \
    --gpu-memory-utilization 0.91 \
    --enforce-eager \
    --trust-remote-code \
    --allowed-local-media-path /home/mind/videos
```

---

## 六、验证推理服务

- 服务状态变为「运行中」后，通过 Postman 或 curl 调用：
  - 健康检查：`GET /health`
  - 文本对话：`POST /v1/chat/completions`，传 `messages`
  - 多模态图片：传 Base64 图片 + 文本
- 接口地址：
  ```
  https://10.3.20.224/v1/infers/63d8096d-258a-4153-8a16-fec5b3d5ad69/v1/chat/completions
  ```
- 请求头：`X-Auth-Token: <Token>`

---

## 七、遇到的典型问题与解决

| 问题 | 原因 | 解决 |
|---|---|---|
| `GID '100' already exists` | 基础镜像已占用 GID 100 | 删除 `groupadd`，直接 `useradd -g 100` |
| `run.sh` 被 OBS 挂载覆盖 | 挂载点 `/home/mind/model/` 覆盖了镜像内同名目录 | 将 `run.sh` 移到 `/home/ma-user/` |
| Dockerfile `unknown instruction: CHOWN` | 多行 RUN 缺少续行符 `\` | 合并为单行或补全反斜杠 |
| OBS 私有桶 403 | 匿名访问被拒 | 用 `obsutil sign` 生成预签名 URL |
| `obsutil` 报 `Exec format error` | 下载了 x86 版本 | 下载 ARM64 版本 |
| `obsutil` 报 AK/SK 未配置 | `sign` 命令不自动读 `~/.obsutilconfig` | 加 `-config=/root/.obsutilconfig` |
| vLLM 下载视频报 SSL 证书错误 | OBS 自签名证书 | 加环境变量 `PYTHONHTTPSVERIFY=0` 或配 CA 证书 |
| 容器启动失败 `Back-off restarting` | 脚本乱码/路径错误/权限问题 | 检查日志，重写干净的 `run.sh`，重新 build |

---

## 八、当前状态与下一步

- 服务已成功部署，文本和多模态图片推理正常。
- 视频分析：预签名 URL 已验证可访问（200 OK），但 vLLM 下载视频时遇到 SSL 证书验证失败。
- 已修改 `run.sh` 添加 `--allowed-local-media-path`，并 commit 为 `v5-local-media` 镜像，正在重新部署。
- 下一步：解决 SSL 问题后，用 `video_url` 传入预签名 URL 分析视频，或改为后端抽帧传图片序列。

---

## 九、关键经验

1. **镜像与挂载**：自定义镜像的启动脚本不能放在 OBS 挂载点下，否则会被覆盖。
2. **权限规范**：ModelArts 要求 UID=1000，GID=100，基础镜像已有 GID 时直接复用。
3. **OBS 私有桶**：不能用匿名 URL，必须用预签名 URL 或后端代理。
4. **视频分析**：vLLM 支持 `video_url`，但需解决证书和下载问题；生产环境推荐后端抽帧。
5. **调试工具**：Cloud Shell 进容器、`npu-smi info`、`curl -v` 是排查利器。

---

这份总结可以直接用于面试或文档记录，重点突出**昇腾 NPU 部署、vLLM 多模态服务、ModelArts 平台适配**的能力。如果需要针对某个环节深入展开，可以再问我。