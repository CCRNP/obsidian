
## 1. 拉取镜像——使用华为云 SWR 提供的现成基础镜像
docker pull swr.cn-southwest-2.myhuaweicloud.com/atelier/pytorch_2_1_ascend:pytorch_2.1.0-cann_8.2.rc1-py_3.11-hce_2.0.2503-aarch64-snt9b-20250729103313-3a25129

- 备选方案
使用昇腾社区官方镜像：
ascendai/pytorch 是昇腾官方在 Docker Hub 上维护的镜像，里面也预装了 torch、torchvision 和 torch_npu。可以尝试拉取：

	docker pull ascendai/pytorch:2.1.0-cann8.2

### 验证版本

``` bash
docker run -it --rm \
  -e TORCH_DEVICE_BACKEND_AUTOLOAD=0 \
  swr.cn-southwest-2.myhuaweicloud.com/atelier/pytorch_2_1_ascend:pytorch_2.1.0-cann_8.2.rc1-py_3.11-hce_2.0.2503-aarch64-snt9b-20250729103313-3a25129 \
  /bin/bash -c "cat /usr/local/Ascend/ascend-toolkit/latest/version.info"
```

## 2. 安装依赖
下载 pi-0 https://gitcode.com/Ascend/DrivingSDK.git
``` bash
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ # 1. 进入你的工作目录
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ cd /home/ma-user
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ 
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ # 2. 克隆 DrivingSDK 仓库（只克隆最新代码即可，不需要完整历史）
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ git clone --depth 1 https://gitcode.com/Ascend/DrivingSDK.git
Cloning into 'DrivingSDK'...
remote: Enumerating objects: 1656, done.
remote: Counting objects: 100% (1656/1656), done.
remote: Compressing objects: 100% (1433/1433), done.
remote: Total 1656 (delta 349), reused 819 (delta 153), pack-reused 0 (from 0)
Receiving objects: 100% (1656/1656), 2.85 MiB | 8.91 MiB/s, done.
Resolving deltas: 100% (349/349), done.
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ 
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ # 3. 进入 Pi-0 示例目录，确认补丁文件是否存在
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ cd DrivingSDK/model_examples/Pi-0
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 Pi-0]$ ls -la
total 40
drwxr-x---  3 ma-user ma-group    76 Jul 19 20:45 .
drwxr-x--- 66 ma-user ma-group  4096 Jul 19 20:45 ..
-rw-r-----  1 ma-user ma-group 24366 Jul 19 20:45 pi0.patch
-rw-r-----  1 ma-user ma-group  4783 Jul 19 20:45 README.md
-rw-r-----  1 ma-user ma-group    67 Jul 19 20:45 requirements.txt
drwxr-x---  2 ma-user ma-group   106 Jul 19 20:45 test
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 Pi-0]$
```


### 2.1 验证安装

``` bash
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ # 验证安装
(PyTorch-2.1.0) [ma-user@14fc35ab55c9 ~]$ pip list | grep -E "transformers|deepspeed|accelerate"
accelerate                               1.0.1
deepspeed                                0.14.0
transformers                             4.48.3
transformers-stream-generator            0.0.5
```



## 权重文件

**PaliGemma 权重是模型的“大脑”，负责“看懂”和“听懂”；而 PI0 预训练权重则是“小脑”，负责把理解转化为精准的“动作”**

1. Pi-0 预训练权重 —— 模型的“小脑”和“经验”

2. PaliGemma 权重 —— 模型的“大脑”
一个预训练的视觉-语言模型（VLM）,它的核心作用是感知与理解。

#### 解决 PI0 训练中 PaliGemma 权重的本地加载问题：

先备份下：
(PyTorch-2.1.0) [root lerobot]$cp lerobot/common/policies/pi0/modeling_pi0.py lerobot/common/policies/pi0/modeling_pi0.py.bak

`bash test/paligemma_weights_mod.sh /home/ma-user/modelarts/inputs/PaliGemma_weight_2`

##### 镜像无 JupyterLab 

基于现有镜像启动一个临时容器——安装 JupyterLab——保存镜像——启动JupyterLab 浏览器测试——推送到镜像
``` bash
docker run -it --rm pi0-pytorch:v1 /bin/bash
在容器内安装 JupyterLab

# 安装 JupyterLab 和 Notebook
pip install jupyterlab notebook

# （可选）安装中文语言包
pip install jupyterlab-language-pack-zh-CN
将修改保存为新镜像
在另一个终端中执行：

bash
# 查看正在运行的容器ID
docker ps
# 提交更改，生成新镜像
docker commit <容器ID> pi0-pytorch:jupyter
测试启动 JupyterLab

bash
# **安装缺失的 Jupyter 扩展、检查环境** 是 Modelarts平台拉起容器时启动 JupyterLab 所需
pip install jupyter_scheduler jupyter_server_mathjax jupyterlab_git jupyterlab_tensorboard_pro nbdime nbclassic jupyter_server_proxy

bash
docker run -it --rm -p 8888:8888 pi0-pytorch:jupyter jupyter lab --ip=0.0.0.0 --port=8888 --allow-root --NotebookApp.token=''
此命令将容器内的 8888 端口映射到主机的 8888 端口，并允许通过 http://localhost:8888/lab 无密码访问。

推送新镜像

bash
# 打标签
docker tag pi0-pytorch:jupyter swr.gdrising-global-1.air.gdrising.com.cn/ma-test/pi0-pytorch:jupyter
# 推送
docker push swr.gdrising-global-1.air.gdrising.com.cn/ma-test/pi0-pytorch:jupyter
```

## 单机 8 卡 验证

- 性能（1000 steps）
``` BASH
# bash test/train_8p_performance.sh {dataset_path} {pi0_weights}
bash test/train_8p_performance.sh /home/ma-user/modelarts/inputs/train_url_0 /home/ma-user/modelarts/inputs/pi0_weight_1
```

启动命令：
```BASH
cd /home/ma-user/modelarts/inputs/pi0_weight_1 &&
sed -i '/"push_to_hub"/d; /"repo_id"/d; /"private"/d; /"tags"/d; /"license"/d' config.json &&
cd /home/ma-user/lerobot &&
python -m accelerate.commands.launch \
  --num_processes=8 \
  --main_process_port=12345 \
  lerobot/scripts/train.py \
  --dataset.repo_id=/home/ma-user/modelarts/inputs/train_url_0 \
  --policy.path=/home/ma-user/modelarts/inputs/pi0_weight_1 \
  --steps=10000 \
  --save_freq=1000 \
  --batch_size=8 \
  --log_freq=50 \
  --output_dir=/home/ma-user/modelarts/outputs/output_url_0/model_checkpoints
```

#### 输入：
train_url：/ma-test/pi0/data/koch_test/
pi0_weight：/ma-test/pi0/weights/e4ed526af508e58f6008b29e9e48f1098278fdb5/
PaliGemma_weight：/ma-test/pi0/weights/paligemma-3b-pt-224/
#### 输出：
output_url：/ma-test/pi0/output/