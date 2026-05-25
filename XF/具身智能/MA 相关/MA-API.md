---
tags:
  - MA
---
## API 参考

## 获取 Token


### 专属资源池

#### 资源池监控

功能介绍
	获取资源池的监控信息。

URL
	GET /v2/{project_id}/pools/{pool_name}/monitor




## 参数 EX


| 参数                   | 描述                                                                                                        | EX                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| pool_name            | 资源池ID                                                                                                     | pool-af2f-ba44b19d1ab843f984b212ca139641e8                 |
| project_id           | 资源空间 ID                                                                                                   | ba44b19d1ab843f984b212ca139641e8                           |
| 资源空间名称               |                                                                                                           | gdrising-global-1_通用平台                                     |
| endpoint             | 终端节点                                                                                                      | iam-apigateway-proxy.gdrising-global-1.air.gdrising.com.cn |
| region_id            | 从安装ModelArts服务时由HCC Turnkey工程导出的《xxx_export_all_v2_CN.xlsx》文件的“基本参数”页签中搜索“region0_id”获取                   | gdrising-global-1                                          |
| external_domain_name | 从安装ModelArts服务时由HCC Turnkey工程导出的《xxx_export_all_v2_CN.xlsx》文件的“基本参数”页签中搜索“external_global_domain_name”获取。 | air.gdrising.com.cn                                        |


>[!CLIENT-X-AUTH-TOKEN]-
>MIIEIQYJKoZIhvcNAQcCoIIEEjCCBA4CAQExDTALBglghkgBZQMEAgEwggHcBgkqhkiG9w0BBwGgggHNBIIByXsidG9rZW4iOnsiZXhwaXJlc19hdCI6IjIwMjYtMDUtMjZUMDE6MTM6NTYuMzU3MDAwWiIsIm1ldGhvZHMiOlsicGFzc3dvcmQiXSwiY2F0YWxvZyI6W10sInJvbGVzIjpbXSwicHJvamVjdCI6eyJkb21haW4iOnsibmFtZSI6IkpTWk4iLCJpZCI6ImIwNzQwNjQzMzljMDQzYTNhN2U1MjJlMDc1NmFiNzNjIn0sIm5hbWUiOiJnZHJpc2luZy1nbG9iYWwtMV-pgJrnlKjlubPlj7AiLCJpZCI6ImJhNDRiMTlkMWFiODQzZjk4NGIyMTJjYTEzOTY0MWU4In0sImlzc3VlZF9hdCI6IjIwMjYtMDUtMjVUMDE6MTM6NTYuMzU3MDAwWiIsInVzZXIiOnsiZG9tYWluIjp7Im5hbWUiOiJKU1pOIiwiaWQiOiJiMDc0MDY0MzM5YzA0M2EzYTdlNTIyZTA3NTZhYjczYyJ9LCJuYW1lIjoibGl1bGl0YW8iLCJwYXNzd29yZF9leHBpcmVzX2F0IjoiIiwiaWQiOiJjYjliMTUzNWUzZDQ0MTBmYTliNGQzNzBlZGEyZGUyMCJ9fX0xggIYMIICFAIBATBvMFYxCzAJBgNVBAYTAkNOMQswCQYDVQQIDAJzYzELMAkGA1UEBwwCY2QxCzAJBgNVBAoMAkhXMRAwDgYDVQQLDAdDbG91ZEJVMQ4wDAYDVQQDDAV0b2tlbgIVAIY4-8-1joXA9tzYDb1nd4eqXUiTMAsGCWCGSAFlAwQCATANBgkqhkiG9w0BAQEFAASCAYAk4C3pqHkUDTWSKcShBQqJjLh1jPeTc5xdVz4T5JE28iLXFzIC3ssMyigFkHCOlgPFJYkxykhZsVe2UmjqC8LAAr32hsPSJdkGp7zut-j3OFR2zy8fMuhoih6Fejg3OY6XEKyK3ec-wOIbI39dxKfIPe2eRu7fREWnX9ZqwfIOnsj1fWD-MmkDGvlFHKHFvujyaRYStsRmYwxCWMFisxRX-GaTf9gCtHZ6GY+B2RUAIUJPVizzIABKswUL3YVcE3-WAmjN9yEoyV5+wUsz6aFE4wRlxVhoyhMm0ADSJHVs2EGwP+cUxqNSLOB2w6uYxlz5Q+CWojbmQx3TdyvjXn-1hT3YhG4uA39bDUV1jDa-2Ty3dDjMN1dsPe7JAoiLETc1RO4vd6g0cCmWrV9lgXuRCOC7hCvdC3h7Le29CkxnnEVUlYZxQSm7jFFJvMguZPpShKbJ5s2nE5W-MmF56osGd12wWGRGIxIE-f9GnMKwBZRqYLk00Ogqe7GR1Rmnpjc=
