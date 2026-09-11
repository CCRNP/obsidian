---
tags:
  - MA-推理
---

## 一、服务概述

本服务基于训推平台部署，使用 **昇腾 910B2 NPU** 和 **vLLM-Ascend** 推理框架，提供 **Qwen3-VL-32B-Instruct** 多模态大模型的在线推理能力。

- **模型能力**：支持纯文本对话、图片理解（多模态）、图文问答。
- **接口标准**：兼容 OpenAI Chat Completions API 格式。
- **调用方式**：HTTP POST 请求，返回 JSON 格式结果。

---

## 二、服务调用信息

| 项目                 | 内容                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **服务地址（Base URL）** | `https://10.3.20.224/v1/infers/63d8096d-258a-4153-8a16-fec5b3d5ad69`                     |
| **完整请求路径**         | `https://10.3.20.224/v1/infers/63d8096d-258a-4153-8a16-fec5b3d5ad69/v1/chat/completions` |
| **请求方法**           | `POST`                                                                                   |
| **认证方式**           | `X-Auth-Token` 请求头                                                                       |
| **模型名称（model 参数）** | `qwen3vl-32b`                                                                            |
| **端口**             | `8080`（内网已映射）                                                                            |

> **注意**：`/v1/chat/completions` 是固定路径，必须拼接在 Base URL 后面。

---

## 三、认证说明

调用服务需要在请求头中携带 **Token**：

```Plain Text
X-Auth-Token: {您的Token}
```

### 获取 Token

- Token 有效期通常为 **24 小时**。

先在本地 hosts 文件加一条域名解析
`10.3.9.36 iam-apigateway-proxy.gdrising-global-1.air.gdrising.com.cn/v3/auth/tokens`
然后在 Postman 里发 POST 请求：

| 参数     | 值                                                                                 |
| ------ | --------------------------------------------------------------------------------- |
| Method | POST                                                                              |
| URL    | https://iam-apigateway-proxy.gdrising-global-1.air.gdrising.com.cn/v3/auth/tokens |
| Header | Content-Type: application/json                                                    |
| Body   | 见下方 JSON                                                                          |

```json
{
  "auth": {
    "identity": {
      "methods": ["password"],
      "password": {
        "user": {
          "name": "{你的用户名}",
          "password": "{你的密码}",
          "domain": { "name": "{租户名}" }
        }
      }
    },
    "scope": { "project": { "name": "gdrising-global-1_通用平台" } }
  }
}
```

返回 201 Created 后，在响应 Header 里找 X-Subject-Token，它的值就是 Token。

---

## 四、请求格式

### 4.1 请求头（Headers）

| Key | Value |
|---|---|
| `Content-Type` | `application/json` |
| `X-Auth-Token` | `{您的Token}` |

### 4.2 请求体（Body）

请求体为 JSON 格式，核心字段如下：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `model` | string | 是 | 固定为 `qwen3vl-32b` |
| `messages` | array | 是 | 对话消息列表 |
| `max_tokens` | int | 否 | 生成的最大 token 数，建议设置合理上限（如 512） |
| `temperature` | float | 否 | 采样温度，默认 0.7 |

#### 纯文本对话示例

```json
{
  "model": "qwen3vl-32b",
  "messages": [
    {"role": "user", "content": "你好，请用一句话介绍你自己"}
  ],
  "max_tokens": 200
}
```

#### 多模态（图片 + 文本）示例

```json
{
  "model": "qwen3vl-32b",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "file:///path/to/your/image.jpg"
          }
        },
        {
          "type": "text",
          "text": "请描述这张图片的内容"
        }
      ]
    }
  ],
  "max_tokens": 300
}
```

**图片传入方式说明**：

| 方式        | 写法                                            | 适用场景                                          |
| --------- | --------------------------------------------- | --------------------------------------------- |
| 本地文件路径    | `"url": "file:///path/to/image.jpg"`          | 服务端已开启 `--allowed-local-media-path`，且图片在服务器本地 |
| Base64 编码 | `"url": "data:image/jpeg;base64,{base64字符串}"` | 图片较小，或无法使用本地路径                                |


---

## 五、响应格式

服务返回标准 OpenAI 格式的 JSON：

```json
{
  "id": "chatcmpl-xxxxxxxx",
  "object": "chat.completion",
  "created": 1726000000,
  "model": "qwen3vl-32b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "模型的回答内容..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 30,
    "total_tokens": 45
  }
}
```

**解析方式**：读取 `choices[0].message.content` 即为模型返回的文本。

---

## 六、调用示例

### 6.1 curl 示例

```bash
export TOKEN="{您的Token}"
export BASE_URL="https://10.3.20.224/v1/infers/63d8096d-258a-4153-8a16-fec5b3d5ad69/v1/chat/completions"

curl -k -X POST "${BASE_URL}/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: ${TOKEN}" \
  -d '{
    "model": "qwen3vl-32b",
    "messages": [
      {"role": "user", "content": "你好，请介绍一下你自己"}
    ],
    "max_tokens": 200
  }'
```

### 6.2 Python 示例

```python
import requests

TOKEN = "{您的Token}"
BASE_URL = "https://10.3.20.224/v1/infers/63d8096d-258a-4153-8a16-fec5b3d5ad69/v1/chat/completions"

response = requests.post(
    f"{BASE_URL}/v1/chat/completions",
    headers={
        "Content-Type": "application/json",
        "X-Auth-Token": TOKEN
    },
    json={
        "model": "qwen3vl-32b",
        "messages": [
            {"role": "user", "content": "你好，请介绍一下你自己"}
        ],
        "max_tokens": 200
    },
    verify=False  # 内网自签证书需要
)

result = response.json()
print(result["choices"][0]["message"]["content"])
```

### 6.3 多模态 Python 示例

```python
import base64
import requests

TOKEN = "{您的Token}"
BASE_URL = "https://10.3.20.224/v1/infers/63d8096d-258a-4153-8a16-fec5b3d5ad69/v1/chat/completions"

# 读取本地图片并转为 Base64
with open("test.jpg", "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

response = requests.post(
    f"{BASE_URL}/v1/chat/completions",
    headers={
        "Content-Type": "application/json",
        "X-Auth-Token": TOKEN
    },
    json={
        "model": "qwen3vl-32b",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{img_b64}"
                        }
                    },
                    {
                        "type": "text",
                        "text": "请描述这张图片的内容"
                    }
                ]
            }
        ],
        "max_tokens": 300
    },
    verify=False
)

result = response.json()
print(result["choices"][0]["message"]["content"])
```

---

## 七、约束与限制

| 项目            | 说明                                          |
| ------------- | ------------------------------------------- |
| **请求体大小**     | 建议不超过 **12MB**，图片过大会导致请求失败                  |
| **超时时间**      | 32B 模型推理较慢，客户端超时建议设置为 **60 秒以上**            |
| **Token 有效期** | 通常为 **24 小时**，过期需重新获取                       |
| **图片格式**      | 支持 JPEG、PNG 等常见格式                           |
| **HTTPS 证书**  | 内网自签证书，客户端需跳过 SSL 验证（`verify=False` 或 `-k`） |

---

## 八、常见问题

| 现象                 | 可能原因          | 解决方法                               |
| ------------------ | ------------- | ---------------------------------- |
| `401 Unauthorized` | Token 错误或过期   | 重新获取 Token                         |
| `404 Not Found`    | URL 路径错误      | 确认完整地址是否拼接了 `/v1/chat/completions` |
| `model not found`  | `model` 参数不匹配 | 改为 `qwen3vl-32b`                   |
| 连接超时               | 网络不通          | 确认能访问服务地址，必要时连接 VPN                |
| SSL 证书错误           | 自签证书          | 客户端跳过 SSL 验证                       |
