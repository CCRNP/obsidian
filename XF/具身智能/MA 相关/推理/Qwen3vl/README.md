---
tags:
  - MA-推理
---

## vLLM-Ascend 训推平台部署文件包

## 文件说明

| 文件                  | 位置              | 作用                                  |
| ------------------- | --------------- | ----------------------------------- |
| `Dockerfile`        | 镜像构建            | 含框架+ma-user+COPY run.sh+ENTRYPOINT  |
| `run.sh`            | **打入镜像** + 构建目录 | 启动脚本，在镜像内 /home/mind/model/run.sh   |
| `build.sh`          | 构建机器            | 一键构建+打标签（需 Dockerfile + run.sh 同目录） |
| `Qwen3vl 部署操作手册.md` | 参考文档            | 完整 6 步部署操作手册                        |

## SWR 镜像信息

| 项目 | 值 |
|------|-----|
| 镜像仓库地址 | swr.gdrising-global-1.air.gdrising.com.cn |
| 组织名 | modelarts |
| 镜像名称 | qwen3vl-32b-instruct |
| 版本号 | v1 |
| 完整地址 | swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1 |

## 架构

```
自定义镜像（SWR）              OBS 模型目录
┌──────────────┐             ┌──────────────┐
│ vLLM 框架    │             │ weight/      │
│ ma-user      │             │   *.safetensors│
│ run.sh ←内置│             │   config.json │
│ ENTRYPOINT   │             └──────────────┘
└──────────────┘              不含 run.sh
    ↑ 创建模型时选                ↑ 部署时挂载到
    ↑ (无模型文件路径)            ↑ /home/mind/model/
```

## OBS 模型目录结构

```
obs://<桶名>/models/qwen3vl-32b/
└── weight/                          # 只有模型权重
    ├── config.json                  # 模型自带配置（HuggingFace格式）
    ├── model-00001-of-0000X.safetensors
    ├── model.safetensors.index.json
    ├── tokenizer.json
    ├── tokenizer_config.json
    └── ...
```

## 快速开始

```bash
# 1. 构建镜像（需 Dockerfile + run.sh + build.sh 同目录）
chmod +x build.sh && ./build.sh

# 2. 推送到 SWR
docker login -u <用户名> -p <密码> swr.gdrising-global-1.air.gdrising.com.cn
docker push swr.gdrising-global-1.air.gdrising.com.cn/modelarts/qwen3vl-32b-instruct:v1

# 3. 上传模型权重到 OBS（不需要上传 run.sh）
obsutil cp -r ./weight obs://<桶名>/models/qwen3vl-32b/weight/

# 4. 创建模型：从容器镜像中选择，配 http:8080，编辑 apis

# 5. 部署在线服务：填 OBS 模型路径，设 TP_SIZE=2
```
