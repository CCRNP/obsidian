---
tags:
  - MA-推理
---

---

### 一、项目背景与目标

在华为云ModelArts训推平台上，基于**昇腾910B2 NPU（单卡64GB显存，8卡）**，部署**Qwen3-VL-32B-Instruct**多模态大模型的在线推理服务，对外提供OpenAI兼容的`/v1/chat/completions`接口，支持文本对话与图片理解。

### 二、技术选型

| 组件 | 选型 | 理由 |
|---|---|---|
| 推理框架 | **vLLM-Ascend v0.18.0rc1** | 专为昇腾NPU优化，支持张量并行、PagedAttention，兼容OpenAI API |
| 基础镜像 | `quay.io/ascend/vllm-ascend:v0.18.0rc1` | 官方维护，内置CANN、PyTorch、vLLM等依赖 |
| 部署平台 | 华为云ModelArts | 支持自定义镜像、OBS挂载、专属资源池 |
| 模型权重 | Qwen3-VL-32B-Instruct（BF16，约60-65GB） | 多模态能力强，32B规模在2卡64GB上可高效并行 |
| 并行策略 | 张量并行 TP=2 | 2卡分摊权重，每卡约30GB，剩余显存充足支持KV Cache与并发 |

### 三、部署全流程

#### 1. 构建自定义镜像
- 基于官方vLLM-Ascend镜像，创建符合ModelArts规范的用户：`ma-user`（UID=1000，GID=100）。
- 将启动脚本`run.sh`放入镜像内**非挂载目录**（如`/home/ma-user/run.sh`），避免被OBS挂载覆盖。
- 设置`ENTRYPOINT`为`bash /home/ma-user/run.sh`，容器启动即自动拉起vLLM服务。
- 暴露8080端口，配置健康检查`/health`。

#### 2. 推送镜像到SWR
- 将镜像打Tag并推送至华为云SWR镜像仓库，供ModelArts拉取。

#### 3. 准备模型权重
- 从ModelScope下载Qwen3-VL-32B-Instruct权重，上传至OBS桶。
- OBS目录结构：权重文件（config.json、safetensors等）直接放在`Qwen3-VL-32B-Instruct/`下。

#### 4. 在ModelArts创建模型
- 模型来源：从容器镜像导入，选择SWR中的自定义镜像。
- 模型类型：Image（自定义镜像自启）。
- 配置容器调用接口：HTTP协议，8080端口。

#### 5. 部署在线服务
- 资源池：910B专属资源池。
- 自定义规格：**Ascend 2卡**，CPU 24核，内存96GB。
- 存储挂载：OBS路径挂载到容器内`/home/mind/model/`。
- 环境变量：
  - `TP_SIZE=2`
  - `SERVED_MODEL_NAME=qwen3vl-32b`
  - `MAX_MODEL_LEN=8192`
  - `GPU_MEM_UTIL=0.91`
  - `ENFORCE_EAGER=true`（CANN 8.x必需）
- 启动命令留空，使用镜像内ENTRYPOINT。

#### 6. 验证推理服务
- 服务状态变为“运行中”后，通过Postman或curl调用：
  - 健康检查：`GET /health`
  - 文本对话：`POST /v1/chat/completions`，传入messages
  - 多模态：传入Base64图片 + 文本，验证图片理解能力。
- 确认返回符合OpenAI格式，模型能正确描述图片内容。

### 四、关键难点与解决方案

| 难点 | 原因 | 解决 |
|---|---|---|
| **GID 100冲突** | 基础镜像已存在GID=100的用户组 | 删除`groupadd`，直接`useradd -u 1000 -g 100`复用已有组 |
| **run.sh被OBS挂载覆盖** | 挂载点`/home/mind/model/`覆盖了镜像内同名目录 | 将run.sh移至`/home/ma-user/`，run.sh内自动回退查找`/home/mind/model/` |
| **Dockerfile语法错误** | 多行RUN缺少续行符`\` | 合并为单行或补全反斜杠 |
| **显存不足风险** | 32B模型BF16权重约60-65GB，单卡64GB装不下 | 采用TP=2，每卡约30GB，余量充足 |
| **多模态图片传入** | Base64过长，内网无法用公网URL | 启用vLLM的`--allowed-local-media-path`，用`file://`本地路径；或后端代理转Base64 |

### 五、成果与亮点

- **成功部署**：Qwen3-VL-32B在2卡910B2上稳定运行，支持文本与多模态推理。
- **标准化接口**：提供OpenAI兼容API，业务方可用Python SDK、curl、Postman直接调用。
- **环境固化**：自定义镜像一次构建，多处复用，支持快速部署与扩容。
- **性能优化**：通过TP=2充分利用多卡显存，设置`GPU_MEM_UTIL=0.91`预留显存，启用`ENFORCE_EAGER`保证CANN兼容性。
- **问题排查能力**：独立解决镜像构建、挂载覆盖、GID冲突、并行配置等一系列昇腾平台特有问题。

### 六、可扩展方向（面试加分项）

- 增加**模型预热**或**host_cache**，缩短服务启动时间。
- 引入**负载均衡**与多实例，支撑高并发。
- 封装**任务路由层**，同一接口支持图像描述、OCR、内容审核等多种任务。
- 结合**SFS Turbo**高性能存储，提升权重加载速度。

---

### 面试可能追问的问题

1. **为什么选vLLM而不是MindIE？**  
   答：vLLM-Ascend对OpenAI API兼容更好，社区活跃，且支持PagedAttention和连续批处理，吞吐更高；MindIE更偏向华为全栈但定制成本高。

2. **TP=2的显存怎么算？**  
   答：32B BF16权重约64GB，TP=2每卡约32GB，单卡64GB剩余约32GB用于KV Cache和并发，非常充裕。

3. **run.sh为什么不能放在挂载目录？**  
   答：Docker挂载会覆盖挂载点下的原有内容，若run.sh放在`/home/mind/model/`，OBS挂载后run.sh会消失，导致容器启动失败。

4. **如何保证服务高可用？**  
   答：可部署多实例+负载均衡，设置健康检查与自动重启；使用host_cache缓存权重，加快故障恢复。

---

这份总结既体现了你对昇腾NPU、vLLM、ModelArts的掌握，也展示了实际动手与排错能力，面试时按此讲述即可。如果需要针对某个环节深入展开，可以再问我。