### 1. YARN 是什么？（先通俗，再专业）
#### 通俗理解
YARN 就像是 Hadoop 集群的 **“资源调度中心 + 任务管家”**：
- 集群里有几百台服务器（节点），每台有 CPU、内存、磁盘等资源；
- 各种分布式任务（比如跑 MapReduce 计算、Spark 分析、Flink 流处理）都需要抢这些资源；
- YARN 的核心工作就是：公平分配资源、监督任务运行、回收闲置资源，确保集群资源不浪费、任务有序执行。

#### 专业定义
YARN 是 Hadoop 2.x 及以上版本的**核心资源管理与调度框架**（全称 *Yet Another Resource Negotiator*，字面意思“另一个资源协商器”），它解决了 Hadoop 1.x 中 MapReduce 框架“资源调度与任务管理耦合”的痛点，实现了 **“资源管理”和“任务执行”的解耦**，让 Hadoop 集群能同时运行多种分布式计算框架（而非只能跑 MapReduce）。

### 2. 为什么需要 YARN？（对比 Hadoop 1.x 的痛点）
Hadoop 1.x 中，MapReduce 框架的 `JobTracker` 既负责**资源调度**（给任务分配服务器/CPU/内存），又负责**任务监控**（跟踪任务进度、重启失败任务），存在两大问题：
- **单点瓶颈**：所有任务的调度和监控都靠一个 `JobTracker`，集群规模变大（比如上千节点）后会卡死；
- **功能单一**：只能运行 MapReduce 任务，无法支持 Spark、Flink 等其他计算框架。

YARN 把这两个功能拆分，解决了以上问题：
- 把“资源调度”交给专门的组件（ResourceManager）；
- 把“任务监控”交给每个应用专属的组件（ApplicationMaster）；
- 支持多框架共用集群资源（MapReduce、Spark、Flink 等）。

### 3. YARN 的核心架构（4 个核心组件）
YARN 的架构可以用“公司组织架构”类比，更易理解：

| 组件名称          | 通俗角色                | 核心职责                                                                 |
|-------------------|-------------------------|--------------------------------------------------------------------------|
| ResourceManager   | 公司CEO（集群总调度）| 1. 接收所有应用的资源申请；<br>2. 全局分配集群资源（CPU/内存）；<br>3. 管理 NodeManager；<br>4. 处理资源抢占/公平调度。 |
| NodeManager       | 部门主管（节点管家）| 1. 运行在每台服务器节点上，负责本节点的资源管理；<br>2. 接收 ResourceManager 的指令，创建/销毁“资源容器”；<br>3. 监控本节点的资源使用情况（CPU/内存）并上报给 ResourceManager。 |
| ApplicationMaster | 项目负责人（应用专属）| 1. 每个提交到 YARN 的应用（比如一个 MapReduce 任务、一个 Spark 作业）都会对应一个 ApplicationMaster；<br>2. 向 ResourceManager 申请资源；<br>3. 与 NodeManager 通信，启动/监控具体任务；<br>4. 任务失败时重试，任务完成后释放资源。 |
| Container         | 工位（资源容器）| 1. YARN 中**最小的资源分配单位**；<br>2. 每个 Container 对应一定量的资源（比如 2 核 CPU + 4G 内存）；<br>3. 任务只能在 Container 内运行，不能超出分配的资源限制。 |

### 4. YARN 的核心工作流程（以运行一个 MapReduce 任务为例）
用步骤拆解，新手能清晰理解：
1. **提交应用**：用户通过客户端（比如 `yarn jar` 命令）向 YARN 的 ResourceManager 提交 MapReduce 任务，同时指定需要的资源（CPU/内存）。
2. **分配第一个 Container**：ResourceManager 找到一个空闲的 NodeManager，分配一个小的 Container，用于启动该任务的 ApplicationMaster。
3. **启动 ApplicationMaster**：NodeManager 在分配的 Container 中启动 ApplicationMaster。
4. **申请资源**：ApplicationMaster 向 ResourceManager 申请运行 Map/Reduce 任务所需的所有 Container（比如 10 个 Map 任务需要 10 个 Container）。
5. **分配资源**：ResourceManager 根据集群资源情况，把空闲的 Container 列表分配给 ApplicationMaster。
6. **启动任务**：ApplicationMaster 与对应节点的 NodeManager 通信，在分配的 Container 中启动 Map/Reduce 任务。
7. **监控与执行**：ApplicationMaster 实时监控所有任务的运行状态，失败则申请新 Container 重试；NodeManager 监控本节点 Container 的资源使用，超出限制则杀死 Container。
8. **任务完成**：所有 Map/Reduce 任务执行完毕后，ApplicationMaster 向 ResourceManager 汇报任务完成，释放所有 Container，自身退出。

### 5. YARN 的实际使用场景
YARN 不是“只服务 MapReduce”，而是 Hadoop 集群的通用资源调度层，常见场景：
- 运行 MapReduce 批处理任务（比如日志分析、数据统计）；
- 运行 Spark 分布式计算任务（比 MapReduce 更快，是目前主流）；
- 运行 Flink 实时流处理任务（比如实时监控、实时数仓）；
- 管理 HBase 集群的资源（HBase 的 RegionServer 运行依赖 YARN 分配资源）；
- 运行机器学习任务（比如基于 TensorFlow on YARN 的分布式训练）。

### 6. 新手常用的 YARN 操作命令
以下是实际运维中最常用的 YARN 命令，可直接在 Hadoop 集群的主节点执行：
```bash
# 1. 查看 YARN 集群状态（ResourceManager/NodeManager 状态）
yarn node -list

# 2. 查看正在运行的 YARN 应用
yarn application -list

# 3. 杀死某个运行中的 YARN 应用（替换 <application-id> 为实际应用ID）
yarn application -kill <application-id>

# 4. 查看某个应用的日志（替换 <application-id>）
yarn logs -applicationId <application-id>

# 5. 启动/停止 YARN 集群（Hadoop 集群脚本）
start-yarn.sh  # 启动
stop-yarn.sh   # 停止
```

### 总结
1. YARN 是 Hadoop 的资源调度核心，核心作用是统一管理集群的 CPU/内存等资源，为各类分布式应用分配资源并监控运行；
2. YARN 的核心架构包含 4 个组件：ResourceManager（总调度）、NodeManager（节点管理）、ApplicationMaster（应用专属管理）、Container（最小资源单位）；
3. YARN 解决了 Hadoop 1.x 的单点瓶颈问题，支持 MapReduce、Spark、Flink 等多框架共用集群资源，是大数据集群的“资源中枢”。 