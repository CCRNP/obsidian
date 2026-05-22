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
