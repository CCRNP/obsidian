---
tags:
  - MA-训练
---
## 训练集问题
### koch_test
	一个 **“机器人操作说明书”** 的集合。它记录了机器人执行各种任务时的详细数据

文件目录：
koch_test/
├── meta/
│   └── info.json          ← 数据集元信息（特征定义、路径等）
├── data/
│   └── chunk-000/
│       ├── episode_000000.parquet
│       ├── episode_000001.parquet
│       └── ...            ← 每帧的动作、状态等数据
└── videos/
    └── chunk-000/
        └── ...            ← 对应的视频画面


`episode_000000.parquet` 文件里的每一行，都记录了**在某一时刻，机器人“看到了什么”、“处于什么状态”、“应该做什么动作”**。PI0 模型就是通过大量学习这些“状态-动作”对应关系，来学会自主操作的

## JupyterLab 问题

### 1. 打开开发环境无代码目录

创建作业时，默认了工作空间为：/home/ma-user/work/
代码目录被放在了镜像里，也就是 /home/ma-user/lerobot/
可创建软连接：`ln -s /home/ma-user/lerobot lerobot`
刷新即可正常显示
