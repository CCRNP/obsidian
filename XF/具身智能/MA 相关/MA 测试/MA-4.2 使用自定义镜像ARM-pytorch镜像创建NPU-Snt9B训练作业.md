## 前置条件
1. 获取镜像文件 qwen2.tar；
2. 将 Qwen2 文件中 traning_data 和 llm_train 两个文件上传到 OBS 桶的同一个文件夹中；
3. 在 第二步 创的文件中 与 training_data 同级目录下 创建 model 文件夹；
4. 将 模型对应的 权重文件，获取网站为： https://huggingface.co/Qwen/Qwen2-7B/tree/main ，将下载的文件 qwen2-7b 上传到 model 文件夹下；

## 测试过程
1. 镜像：选择上传的 qwen2.tar
2. 代码目录：选择已添加到 OBS 桶中的 llm_train/AscendSpeed 文件夹
3. 启动命令： sh scripts/qwen2/0_pl_sft_7b.sh
4. 本地代码目录：/home/ma-user/AscendCloud-LLM/llm_train/
5. 工作目录：/home/ma-user/AscendCloud-LLM/llm_train//AscendSpeed
6. 输入：
	1. ORIGINAL_TRAIN_DATA_PATH：微调数据OBS路径
		1. 数据存储位置：−obs://${bucket_name}/${folder-name}/training_data/finetune/alpaca_gpt4_data.json bucket_name为OBS桶名称，folder-name为自己创建的文件夹名称
		2. 获取方式：环境变量
	2. ORIGINAL_HF_WEIGHT：模型权重OBS路径
		1. 数据存储位置：选择已上传到OBS中的路径：
		2.  obs://${bucket_name}/${folder-name}/model/qwen2-7b/
		3.  获取方式：环境变量
7. 输出：
	1. OUTPUT_SAVE_DIR：模型训练的结果保存路径，用于存储包括日志，SFT训练后的权重文件，SFT转换后的权重文件。
		1. − 数据存储位置：选择一个空的OBS文件目录
		2. − 获取方式：环境变量
		3. − 预下载至本地目录：不下载
	2.  INPUT_PROCESSED_DIR：用于存储输入数据预处理的结果。
		1. − 数据存储位置：选择一个空的OBS文件目录
		2. − 获取方式：环境变量
		3. − 预下载至本地目录：不下载
8. 环境变量
	CONVERT_MG2HF=True，是否将训练后的模型转换回Huggingface格式，用于模型推理
	EPOCH：训练迭代轮数
	 −配置值：1
	EVAL_INTERVAL：表示训练多少个步数进行模型验证
	 −配置值：10
	EVAL_ITERS：评估轮数
	 −配置值：1
	MOUNT：表示数据挂载方式。用于区别SFS时做的适配。
	 −配置值：OBS
	SAVE_INTERVAL：表示训练多少个步数保存一次模型
	 − 配置值：10
	 
9. “资源池”：选择节点规格为昇腾Ascend-Snt9B的资源池
	1. “实例规格”：选择昇腾8卡，例如Ascend: 8*ascend-snt9b | ARM：192核2048GB
	2. “实例数”：选择1个

10. 作业日志路径：选一个空的文件夹

## 镜像
`docker system df` 看看到底哪些部分占用较多
1. 镜像满了，删除特定镜像
	docker rmi <镜像ID或名称:标签>
2. 批量清理未使用的镜像、容器、卷、网络
	1. docker system prune -a   # 会询问确认，删除所有未使用的镜像、容器、网络、构建缓存
	2. 更安全的做法是先执行 `docker system prune`（不带 `-a`），只删除悬空镜像（dangling images），保留有标签的镜像。


