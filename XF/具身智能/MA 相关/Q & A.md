---
tags:
  - MA
  - MA-Question
---
## 权限

### ModelArts权限管理

默认情况下，管理员创建的用户没有任何权限，需要将其加入用户组，并给用户组授予策略，才能使得用户组中的用户获得对应的权限，这一过程称为授权。授权后，用户就可以基于授予的权限对云服务进行操作。
 
在对用户组授权的时候，并不是直接将具体的某个权限进行赋权，而是需要先将权限加入到“策略”当中，再把策略赋给用户组。为了方便用户的权限管理，各个云服务都提供了一些预置的“系统策略”供用户直接使用。如果预置的策略不能满足您的细粒度权限控制要求，则可以通过“自定义角色”来进行精细控制。

### 用户的查看权限问题

不同租户 查看  训练作业任务列表 是不一样[[权限管理#问题背景——训练作业任务列表 查看权限]]

### 资源池和工作空间

![[Pasted image 20260826160738.png]]

### 专属资源池 & 公共资源池

- **推荐使用专属资源池的场景**：当业务进入**生产环境**，对推理服务的**响应延迟**和**稳定性**有严格要求的场景；当训练数据或模型涉及**敏感信息**，需要强**数据安全和网络隔离**的场景[](https://support.huaweicloud.com/intl/zh-cn/usermanual-standard-modelarts/resmgmt-modelarts_0003.html)[](https://support.huaweicloud.com/intl/zh-cn/modelarts_faq/modelarts_05_3131.html)；当AI应用需访问VPC内的**数据存储**（如SFS）或**其他云服务**时[](https://support.huaweicloud.com/intl/zh-cn/usermanual-standard-modelarts/resmgmt-modelarts_0003.html)[](https://support.huaweicloud.com/intl/zh-cn/modelarts_faq/modelarts_05_3131.html)；以及当任务对**GPU/NPU驱动版本**有特殊要求时[](https://support.huaweicloud.com/intl/zh-cn/usermanual-standard-modelarts/resmgmt-modelarts_0003.html)[](https://support.huaweicloud.com/intl/zh-cn/modelarts_faq/modelarts_05_3131.html)。
    
- **推荐使用公共资源池的场景**：在项目**初期探索**或进行**概念验证（POC）** 时；当任务量较少、对**成本敏感**时；以及当任务**时效性要求不高**，可以接受偶尔排队等待时。

