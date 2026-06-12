---
tags:
  - MA
  - MA-文档
状态: 待跟进
日期: 2026-05-21
---

## 问题记录


### 0. workflow

Workflow（也称工作流，下文中均可使用工作流进行描述）本质是开发者基于实际业务场景开发用于部署模型或应用的流水线工具。

使用者无需关注流水线中包含什么算法，也不需要关注流水线是如何实现的。使用者只需要关注流水线生产出来的模型或者应用是否符合上线要求，如果不符合，是否需要调整数据和参数重新迭代。这种使用固化下来的流水线的状态，在Workflow中统称为运行态。

总的来说，Workflow有两种形态。

- 开发态：使用Workflow的Python SDK开发和调测流水线。
- 运行态：可视化配置运行生产好的流水线。


### 1. 异构资源管理

#### 🧩什么是异构资源池？
**异构**指的是**不同架构、不同指令集**的硬件。常见的有：

- **CPU**：擅长逻辑控制和串行任务，是“通才”。
    
- **GPU**：擅长并行计算，适合图形渲染、矩阵运算（AI训练/推理），是“数学狂魔”。
    
- **NPU**：神经网络专用处理器，针对AI算子做了硬件级优化，比GPU更高效，是“AI专才”。
    

**资源池**就是把许多这样的硬件设备集中在一起，形成一个大池子，而非分散在各自主机上。
通俗来说，就是把**不同类型的计算硬件（CPU、GPU、NPU等）整合成一个统一的资源库，并由一个智能调度系统来统一分配**，让合适的任务跑在合适的硬件上。
**异构资源池 = 一个同时包含CPU、GPU、NPU等多种芯片的计算集群**。例如：100台服务器，每台配2颗Intel CPU + 8张NVIDIA A100 GPU + 8张华为Ascend 910 NPU，这些全部纳入同一个资源池。

#### 🎯 什么是异构管理？

异构管理就是**能够识别、调度、监控异构资源池中所有硬件的能力**。它的核心价值在于：

1. **统一抽象**：对外提供一套API或界面，用户不需要关心底层是哪种芯片，只需说“我要一个8核CPU + 1张NPU”的资源。
    
2. **智能调度**：根据任务特征，自动选择最合适的硬件。例如：
    
    - 自然语言处理的Transformer模型 → 优先分配**NPU**（算子高效）
        
    - 传统图像滤波 → 分配**GPU**或**CPU**
        
    - 数据预处理（如解码、格式转换） → 分配**CPU**
        
3. **动态分配**：任务启动时，调度器查看资源池中哪些硬件空闲，并综合考虑数据亲和性（避免跨节点拷贝）、碎片情况，做出最优决策。
    
4. **故障隔离与热迁移**：某个NPU发生ECC错误，调度器自动将其标记为不可用，并重新分配任务到其他正常设备，业务无感知。



### 2. 在线服务 & 批量服务



#### 2.1 在线服务

即时交付，来一个需求，即使处理，处理完就反馈交付。
在线服务是将模型部署为一个可以随时响应请求的 Web 服务。它一旦部署完成，就会持续运行，等待用户或应用程序向其发起调用并实时返回结果。

#### 2.2 批量服务




### 3. 数据管理模块

![[Pasted image 20260521195942.png]]
在Huawei Cloud Stack 8.6.0版本中，数据管理不再是ModelArts的一个独立模块。

准确地说，之前作为ModelArts一部分的数据管理功能，在8.6.0这个版本里，已经发展并整合到了另一个独立的平台服务里，叫 ModelArts Studio。ModelArts 本身在8.6.0中，其定位更侧重于模型的训练和部署


### 网络加速

具体来说，它描述的是一个从底层硬件到上层平台、从智能调度到拥塞控制的立体化加速体系。
- **自动网络拓扑发现** 
	- 对应底层 **AI 高速网络栈** 中的智能拓扑感知模块，以及轻量算力集群场景下的 `cabinet` 插件。
	- 系统能自动识别交换机、NPU 节点之间的物理连接关系（例如 Spine‑Leaf 架构），并生成网络拓扑信息。

**开启动态路由加速**
此功能通过智能优化网络通信路径来提升训练性能，配置方法如下：

- **前置条件**：请确保联系华为云技术支持，开启集群的 `cabinet` 插件和调度权限[](https://support.huaweicloud.com/intl/es-us/usermanual-standard-modelarts/develop-modelarts-0004.html)[](https://support.huaweicloud.com/intl/zh-cn/usermanual-standard-modelarts/develop-modelarts-0004.html)。
    
- **关键配置**：在创建训练作业的“训练配置”阶段，添加环境变量 `ROUTE_PLAN = true`。这是最重要的“开关”，能确保使用 RankTable File (RTF) 的方式启动训练[](https://support.huaweicloud.com/intl/es-us/usermanual-standard-modelarts/develop-modelarts-0004.html)[](https://support.huaweicloud.com/intl/zh-cn/usermanual-standard-modelarts/develop-modelarts-0004.html)。
    
- **资源要求**：资源配置阶段，资源池需选择“**专属资源池**”，实例规格必须为**Ascend Snt9b或Snt9b23**类型，并且必须使用“**节点满卡**”，实例数（计算节点数）需要**大于或等于3**[](https://support.huaweicloud.com/intl/es-us/usermanual-standard-modelarts/develop-modelarts-0004.html)[](https://support.huaweicloud.com/intl/zh-cn/usermanual-standard-modelarts/develop-modelarts-0004.html)。

 **配置拓扑感知调度（超节点亲和组）**  
对于大模型训练场景，可通过配置“亲和组”将高带宽需求的实例调度到同一超节点内，极大提升通信效率。

- **启用条件**：此功能仅支持**昇腾Snt9b23**超节点专属资源池，且要求每个实例必须占满节点的所有卡[](https://support.huaweicloud.com/intl/zh-cn/usermanual-standard-modelarts/develop-modelarts-0011.html)。
    
- **配置入口**：在创建训练作业的“资源配置”阶段，选择好“专属资源池”和“Snt9b23”规格后，在界面中找到并填写“**超节点亲和组实例数**”

在ModelArts平台上**使用网络加速能力，主要操作是在创建训练任务时在“资源配置”和“训练配置”页面完成的**。需要做的仅仅是选择正确的资源池和规格，并正确地设置环境变量，平台调度器便会自动接管底层的网络优化工作。

#### 训练作业动态加速路由
https://support.huaweicloud.com/usermanual-standard-modelarts/develop-modelarts-0004.html
- 在启用动态路由加速之前，请联系ModelArts技术支持，确保集群的cabinet插件和调度权限已开启。

### NPU拓扑感知调度

平台支持，通过 `Volcano` 调度器实现。其版本记录显示支持“训练作业**两级分组网络拓扑感知调度能力**”[](https://www.huaweicloud.com/guide/productsdesc-bms_817e0e9e2e640f76c57afdbf05a03febsupport1)以及“昇腾NPU双DIE亲和调度能力”[](https://www.huaweicloud.com/guide/productsdesc-bms_817e0e9e2e640f76c57afdbf05a03febsupport1)，说明调度器在分配NPU资源时会感知硬件拓扑。ModelArts官方也明确提及 **“NPU拓扑感知调度”** 是一种支持的模式[](https://support.huaweicloud.com/topic/987402-5-S)。

### 汇聚网络亲和调度

将关联性强的计算任务聚合到高性能的统一网络域内，以降低通信压力。
在推理服务中提供“**支持亲和调度**”选项，将同一会话的请求定向转发到同一实例[](https://doc.hcs.huawei.com/zh-cn/usermanual/modelarts/modelarts-infer_04_0529.html#ZH-CN_TOPIC_0000002266805845__table42381035113912)。

### 汇聚网络独占调度

“汇聚网络独占调度”的核心思想是“资源隔离”
平台提供“专属资源池”功能，为您分配**独立的计算集群和网络资源**。这确保了任务独享特定资源，实现了用户间的物理隔离，完全满足独占调度的核心诉求。
专属资源池和专用网络


### 分布式并行训练

- **创建作业时**：这是最直接的体现。在创建训练作业时，在“资源配置”页面若能将“实例数”设置为大于1，就代表当前作业将使用多节点进行分布式训练[](https://support.huaweicloud.com/intl/zh-cn/usermanual-standard-modelarts/modelarts-distributed-0001.html)。


### 简化分布式，将单机代码自动分布式

