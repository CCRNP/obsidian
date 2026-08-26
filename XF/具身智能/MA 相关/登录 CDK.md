---
tags:
  - MA
  - 节点
---

## 获取CDK集群Master节点IP

1. Service OM，单击“服务列表>资源>计算资源”，进入计算资源页面，单击“虚拟机”，展示虚拟机列表。
2. 在名称右侧输入框中，搜索“ModelArts_Common_Region-POD-Master”，获取并记录任意一个Master节点的内大网IP地址。

获取到如下：	
ModelArts_Common_Region-POD-Master-0001，ID:34139e3f-21bb-4ef4-baf1-b2afeda0271d
IP:10.3.28.143,100.64.34.194

3. 从ModelArts-Common-Proxy节点以**opsadmin**用户登录CDK Master节点。、

ModelArts_Common_Region-POD-Master-0001 的账号密码:
opsadmin / %MtC7GTI7ao79Ow
root / %w3JTC15kPachC_