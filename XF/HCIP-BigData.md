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

### Flink

- 简介：Apache Flink 是一个分布式流处理框架，擅长低延迟、事件驱动的实时数据处理，同时支持有界（批）与无界（流）数据处理，并提供状态管理与 exactly-once 语义支持。

- 主要组件与概念：
  - JobManager（集群级别的协调者）：负责作业的提交、调度、故障恢复与高可用。现代 Flink 的 JobManager 可包含多个角色（Dispatcher、ResourceManager、多个 JobMaster）。
  - Dispatcher：接受客户端提交的作业，维护作业元数据并��供 REST 接口（Web UI 交互的一部分）。
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

- 性能与调优要点：并行度与 slot 的规划、TaskManager 的内存/CPU 配置、网络缓冲区（network buffers）、状态后端（RocksDB）与 I/O 压力、checkpoint 周期与对齐（aligned vs unaligned checkpoints）、背压分析、并行度与数据倾斜处理。

- 监控与运维：Flink Web UI（Job overview / Task / Checkpoints）、指标导出到 Prometheus/Grafana、日志与堆栈跟踪、通过 savepoint/recurring checkpoint 管理版本迁移与容灾。


### Hive

Hive子目录
	Hive自定义函数中的 **UDTF** 用于接受单个数��行，并产生多个数据作为输出

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
