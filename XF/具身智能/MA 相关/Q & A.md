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


## 其他

### KV-Cache

#### KV Cache（Key‑Value Cache，键值缓存）
**一句话定义**：大语言模型LLM推理阶段的核心加速技术，**以显存换算力**，缓存历史Token的Key、Value向量，避免每一步生成时重复计算，是对话流式输出的基础能力。

##### 一、背景问题（为什么需要KV Cache）
LLM是**自回归生成**：一个token一个token依次输出。
Transformer注意力机制对每个token算出三组向量：
- **Query(Q)**：当前token的“检索请求”
- **Key(K)**：历史token的索引标签
- **Value(V)**：历史token携带的实际信息

**无KV Cache的代价**：每生成一个新词，就要从头重新计算全部历史文本的K、V；计算复杂度 $O(n^2)$，序列越长速度越爆炸式变慢。

#### 二、工作流程：两个阶段
1. **Prefill（填充阶段）**
一次性处理用户完整输入Prompt，**一次性算出全部token的K、V，存入GPU显存**，初始化KV Cache。这一步决定**首字延迟TTFT**。
2. **Decode（解码生成阶段）**
每一步只计算**新生成token的Q、少量新K/V**；历史全部K/V直接读取缓存；把新的K/V追加进缓存。复杂度降到 $O(n)$，后续每个token生成速度大幅变快。

> 公式简化：$Attention(Q_{new},\;Cache\_K,\;Cache\_V)$

#### 三、优缺点
✅ **优点**
- 极大降低重复矩阵运算，token生成速度提升数十倍；
- 实现ChatGPT这类逐字流式打字效果；
- 线上服务推理必备优化。

⚠️ **缺点/代价**
- **占用大量显存**：上下文越长、对话轮次越多，KV缓存体积线性膨胀；长上下文场景下KV缓存显存开销甚至超过模型权重本身；
- 显存会随对话持续累积，需要回收/淘汰策略。

#### 四、主流优化方案（工业界常用）
1. **MQA / GQA（多查询注意力 / 分组查询注意力）**：减少KV头数量，直接压缩缓存大小；
2. **KV量化（INT4/FP4）**：降低K/V数值精度，减小显存占用（NVFP4等）；
3. **PagedAttention（分页KV缓存，vLLM核心）**：像操作系统内存分页管理显存，减少碎片、提升并发；
4. **Prefix Caching（前缀缓存共享）**：多条请求共用相同历史上下文，复用同一份KV缓存；
5. **缓存淘汰/滑动窗口**：超长对话自动丢弃久远的KV数据，控制显存上限（如GPT‑4的窗口机制）。

#### 五、直观比喻
KV Cache相当于**对话的临时草稿本**：第一次读完问题把全部素材抄写保存；之后每续写一个字，不再重读整篇文章，直接翻看草稿本，只处理当前新字。

#### 六、常见面试关键词
自回归推理、Prefill/Decode、TTFT（首token延迟）、TPOT（单token生成耗时）、PagedAttention、vLLM、GQA、KV量化、Prefix Cache。


### HDK


### CANN

**CANN（Compute Architecture for Neural Networks）是华为专为昇腾AI处理器打造的核心软件平台**
连接AI应用与昇腾硬件（NPU）的“桥梁”和“操作系统”。

核心作用：承上启下的关键枢纽
	**向下“使能”硬件**：它能充分释放昇腾AI处理器（如昇腾310、910等芯片）的并行计算潜力，让硬件算力得以高效发挥。[异构计算架构CANN](https://www.huawei.com/cn/huaweitech/publication/202503/new-ecology-of-ascend-computing-power#1#1)
	**向上“服务”开发者**：它为开发者提供了统一的编程接口和开发工具，屏蔽了底层硬件的复杂性[](https://www.huawei.com/cn/huaweitech/publication/202503/new-ecology-of-ascend-computing-power#1#1)。

### 训练框架

#### PyTorch、TensorFlow、MindSpore
