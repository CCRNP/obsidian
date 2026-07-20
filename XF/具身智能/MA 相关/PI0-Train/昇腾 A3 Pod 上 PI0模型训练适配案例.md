
## 1. 拉取镜像——使用华为云 SWR 提供的现成基础镜像
docker pull swr.cn-southwest-2.myhuaweicloud.com/atelier/pytorch_2_1_ascend:pytorch_2.1.0-cann_8.2.rc1-py_3.11-hce_2.0.2503-aarch64-snt9b-20250729103313-3a25129

- 备选方案
使用昇腾社区官方镜像：
ascendai/pytorch 是昇腾官方在 Docker Hub 上维护的镜像，里面也预装了 torch、torchvision 和 torch_npu。你可以尝试拉取：

bash
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