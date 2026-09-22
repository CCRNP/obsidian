---
tags:
  - MRS
---
### HBase

HBase : MemStore & Blockcache
	不需要完全拥有传统关系型数据库所具备的 **ACID** 特性
	HBase 建表时预先设置多个Region，数据会按照 **rowkey** 对应 Region分区情况，在集群内做数据的负载均衡

### Spark
- Transformation - **RDD**
- 遇到**宽**依赖会断开 Stage 链，生成一个新的 Stage 链
- Dataset 是懒惰的，只在执行 **Action** 操作时触发计算
- reduce 算子属 Action 算子

**Structured Streaming**
	Spark **Structured Streaming** 不支持 Hive 作为 流式 Source，Hive 可以做批查询，也可以作为输出 Sink，但不能作为流的输入源；
	Structured Streaming 是 Apache Spark 自**2.0 版本**推出的**新一代流式处理引擎**，构建在 Spark SQL 之上，提供**统一批流编程模型**与**端到端 exactly-once 语义**的流处理能力
	将实时数据流视为**不断追加行的无界表 (Unbounded Table)**，开发者用批处理方式编写查询，Spark 自动将其转换为增量执行的流式计算；
	端到端 Exactly-Once 语义
### Flink

- 简介：Apache Flink 是一个分布式流处理框架，擅长低延迟、事件驱动的实时数据处理，同时支持有界（批）与无界（流）数据处理，并提供状态管理与 exactly-once 语义支持。

- 主要组件与概念：
  - JobManager（集群级别的协调者）：负责作业的提交、调度、故障恢复与高可用。现代 Flink 的 JobManager 可包含多个角色（Dispatcher、ResourceManager、多个 JobMaster）。
  - Dispatcher：接受客户端提交的作业，维护作业元数据并提供 REST 接口（Web UI 交互的一部分）。
  - ResourceManager：管理集群资源，与外部集群管理器（如 YARN、Kubernetes）交互，负责容器/节点的申请与释放。
  - JobMaster：每个作业的协调者（Job 的领导者），负责生成 ExecutionGraph、调度任务、管理 checkpoint 协调与重启策略。
  - TaskManager（TaskExecutor）：工作节点进程，负责执行具体的算子、管理 task slot、报告心跳并承载网络传输与状态存储。
  - Task Slot：TaskManager 提供的资源单位，用于分配并行子任务（slot 是并行度与资源隔离的基础）。
  - JobClient：提交作业的客户端 API，用于与 JobManager/Dispatcher 交互、提交或取消作业。
  - BlobServer：用于分发作业 jar 与依赖到 TaskManagers 的小文件服务器。
  - Checkpoint Coordinator：协调异步快照（checkpoint）的触发与确认，保障容错与状态恢复。
  - StateBackend（MemoryStateBackend / FsStateBackend / RocksDBStateBackend）：管理算子状态的存储后端，RocksDBStateBackend 常用于大状态场景（本地嵌入式 RocksDB + 异步增量快照）。
  - Savepoint：手动触发的作业快照，用于作业升级、迁移或恢复（用户控制的持久化快照）。
  - JobGraph / ExecutionGraph：Job 的逻辑表示（JobGraph）与调度执行时的表示（ExecutionGraph）。
  - 网络栈（基于 Netty）：负责任务间数据交换、shuffle 与背压（backpressure）机制。
  - Connectors：外部系统连接器（Kafka、Kinesis、JDBC、Filesystem、Elasticsearch、Cassandra 等），用于数据输入与输出。
  - 编程模型：DataStream API（流式核心）、Table API & SQL（声明式）、CEP（复杂事件处理）、Window、State、Timers 等。

- 部署模式：Standalone、YARN、Kubernetes（常用）、以及历史上的 Mesos 支持。

- 容错与一致性：通过 checkpoint + StateBackend 提供容错；对接 sink 时可实现 two-phase commit 来支持 exactly-once 语义；同时支持 savepoint 用于手动恢复。

- 监控与运维：Flink Web UI（Job overview / Task / Checkpoints）、指标导出到 Prometheus/Grafana、日志与堆栈跟踪、通过 savepoint/recurring checkpoint 管理版本迁移与容灾。

Flink 的 CheckPoint 机制绘制的流应用快照不能被保存在 TaskManager 的内存。

### Hive

Hive子目录
	Hive自定义函数中的 **UDTF** 用于接受单个数据行，并产生多个数据作为输出

### Kafka 
- Topic - Partition
- **Producer** 向 Kafka 中发布消息的角色 发送到 Kafka Broker
- 一台或多台服务器统称为 **Broker**
- 每条发布到 Kafka 的消息都有一个类别，这个类别被称为 **Topic**
- kafka 属于大数据消息系统

GES 中有 **EDGE LABEL** 表示边的类型，用于表示现实世界中的关系类型

### Loader

通过组件 **Kerberos** 来实现认证以及作业权限管理

### ElasticSearch

通过 Key 寻找 Value，即从关键点出发，然后再通过关键点找到信息中满足搜索条件的特定信息，这是**正排**索引机制

### Other

图搜索引 YGES 处理利用 RESTful API，还可以借助 **Gremlin** 图遍历功能

Java API 操作 ElasticSearch 有 RestClient 和 **TransportClient** 等多种方式

watermark、shuffle、

如果需要由数据生产者决定数据发送给目标 Bolt 的某一个确定的 Task ，应选择 **直接分组** 发布策略

- Sqoop
	**定位：数据迁移工具，SQL‑to‑Hadoop**
	专门做**关系型数据库（MySQL、Oracle）和 Hadoop 生态之间双向数据搬运**，本身不做复杂计算。
	`sqoop import`：导入，数据库 → HDFS / Hive / HBase
	`sqoop export`：导出，HDFS 文件 → 关系型数据库
	📌考试易错点（你之前做错的原题）
	1. Sqoop 导出切片**不受 HDFS block 块大小控制**，切片数量由`--num‑mappers`map 任务数决定。
	2. Sqoop 只有 Map 任务，**没有 Reduce 阶段**。
	3. `LOCAL`关键字：Sqoop 没有 local；`LOAD DATA LOCAL`是 Hive 语法，读取**Hive 客户端本机**文件，不是任意服务器。

- Storm
	**定位：实时流式计算框架，真正事件流处理**
	接收源源不断的数据流，**逐条处理数据**，不是微批。
	