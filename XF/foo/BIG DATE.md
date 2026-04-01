### Hadoop
#### Hadoop 生态
:::info
<font style="color:rgb(15, 17, 21);">Hadoop不是一个单一软件，而是一个</font>**<font style="color:rgb(15, 17, 21);">以HDFS和MapReduce为核心</font>**<font style="color:rgb(15, 17, 21);">的生态系统，它解决了大数据早期的两个根本问题：“</font>**<font style="color:rgb(15, 17, 21);">怎么存</font>**<font style="color:rgb(15, 17, 21);">”和“</font>**<font style="color:rgb(15, 17, 21);">怎么算</font>**<font style="color:rgb(15, 17, 21);">”。</font>

:::

**<font style="color:rgb(15, 17, 21);">核心三驾马车</font>**<font style="color:rgb(15, 17, 21);">：</font>

1. **<font style="color:rgb(15, 17, 21);">HDFS</font>**<font style="color:rgb(15, 17, 21);">：分布式文件系统。将超大文件切块（Block，如128MB）并分散存储在普通服务器集群上，提供高可靠、高吞吐量的数据存储能力。</font>**<font style="color:rgb(15, 17, 21);">解决了“存”的问题</font>**<font style="color:rgb(15, 17, 21);">。</font>
2. **<font style="color:rgb(15, 17, 21);">MapReduce</font>**<font style="color:rgb(15, 17, 21);">：分布式计算框架。一种编程模型，将计算任务分为</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">Map（映射）</font>`<font style="color:rgb(15, 17, 21);">和</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">Reduce（归约）</font>`<font style="color:rgb(15, 17, 21);">两个阶段。它负责将任务分发到数据所在的节点，并处理节点故障。</font>**<font style="color:rgb(15, 17, 21);">解决了“算”的问题</font>**<font style="color:rgb(15, 17, 21);">，但将中间结果写入磁盘，效率较低。</font>

 

**<font style="color:rgb(15, 17, 21);"> 周边生态</font>**<font style="color:rgb(15, 17, 21);">：基于这三块基石，诞生了丰富的数据工具，形成了“生态”：</font>

    - **<font style="color:rgb(15, 17, 21);">Hive</font>**<font style="color:rgb(15, 17, 21);">：SQL on Hadoop，将SQL转为MapReduce任务。</font>
    - **<font style="color:rgb(15, 17, 21);">HBase</font>**<font style="color:rgb(15, 17, 21);">：基于HDFS的分布式、列式NoSQL数据库，用于随机实时读写。</font>
    - **<font style="color:rgb(15, 17, 21);">ZooKeeper</font>**<font style="color:rgb(15, 17, 21);">：分布式协调服务，用于集群配置同步、领导选举等。</font>
    - **<font style="color:rgb(15, 17, 21);">Sqoop</font>**<font style="color:rgb(15, 17, 21);">：在HDFS和关系型数据库间传输数据。</font>
    - **<font style="color:rgb(15, 17, 21);">Flume</font>**<font style="color:rgb(15, 17, 21);">：日志采集和聚合工具。</font>

<font style="color:rgb(15, 17, 21);"></font>

<font style="color:rgb(15, 17, 21);"></font>

<font style="color:rgb(15, 17, 21);">锁：是手段（通过并发控制来实现事务），解决并发问题中的：脏读，幻读，不可重复读；</font>

<font style="color:rgb(15, 17, 21);"></font>

<font style="color:rgb(15, 17, 21);"></font>

### <font style="color:rgb(15, 17, 21);">GaussDB</font>
 华为公司自主研发的新一代企业级分布式关系型数据库，提供高吞吐强一致性事务处理能 力、金融级高可用能力、分布式高扩展能力、大数据高性能查询能力  。  



####  虚拟化平台部署 GaussDB 轻量化  
##### 部署流程：
![画板](https://cdn.nlark.com/yuque/0/2026/jpeg/21598230/1770023786515-9f5ce240-c7b8-4456-b9c7-8a0af2b9747d.jpeg)



1. 配置虚拟化平台

1.1 CPU 绑定 NUMA

    - 这么做可减少跨 NUMA 节点远程内存访问带来的较高延迟，避免 vCPU 在物理核心间迁移导致的缓存失效和上下文切换开销
+ 虚拟机的 CPU 绑定到特定 NUMA，考虑的因素一般有如下两点：
    - 对**资源规格较小**的虚拟机，在资源碎片可接受的范围内尽量不跨 NUMA
    - 对**大规格**虚拟机， 考虑资源碎片问题可适当配置跨NUMA数量，不过需要注意绑 定过多NUMA对数据库性能影响较大。  

<details class="lake-collapse"><summary id="u862872b2"><span class="ne-text">建议的绑定 NUMA 规则</span></summary><p id="u5347aaf9" class="ne-p"><span class="ne-text"> ● [1, 16] 最大绑1个NUMA。 </span></p><p id="uc5026882" class="ne-p"><span class="ne-text">● (16, 36] 最大绑2个NUMA，CPU资源建议在2个NUMA进行平均绑定，以32U为 例，在2个NUMA分别绑定16U。 </span></p><p id="ufc223e73" class="ne-p"><span class="ne-text">● (36, ∞] 最大绑4个NUMA，CPU资源建议在4个NUMA进行平均绑定，以64U为 例，在4个NUMA分别绑定16U。  </span></p></details>
1.2  磁盘配置条带化  







2. 制作管理面模板



3. 安装 TPOPS



4. TPOPS 安装后配置



5. 制作数据面模版



6. 发放数据面虚拟机



7. 主机上线



8. TPOPS 平台操作











### SQL
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/jpeg/21598230/1770027728595-1e7238cb-dbf0-4406-8f7e-c2594cb0e2ce.jpeg)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/jpeg/21598230/1770027703659-c7b1bfa6-ad60-4281-a3e7-37965617d6e9.jpeg)

