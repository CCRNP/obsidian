## 1.前提条件



## 2.下载 cloud-init 安装包及依赖包



## 3.下载 agent 安装包及依赖包


## 4.用于制作镜像的软件包

EulerOS 2.10 镜像ISO获取方式：
	https://support.huawei.com/enterprisesearch/#/index?keyword=EulerOS-V2.0SP10-x86_64-dvd.iso&lang=zh&searchType=SUPE_SW&sortType=Relevance
	在上面网址上搜索 EulerOS-V2.0SP10-x86_64-dvd.iso ，申请下载。
> [!info]
> - **EulerOS 2.0 SP10**：是华为官方标准的命名格式，其中的 **SP10** 表示第10个补丁与服务包集合[](https://m.elecfans.com/zt/189336/)[](https://www.phpwp.cn/article/3351.html)。
> - **EulerOS 2.10**：这个更口语化的版本号，可以理解为 **2.0 (SP10)** 的简写。它把 **2.0** 和 **SP10** 拼在了一起，两者指向的是同一个东西，这一点在搜索到的多个技术文章里都能得到印证[](https://wenku.csdn.net/answer/7mw3gopb8p)。

## 5.操作步骤

1. 解压制作镜像的软件包
2. 将软件包放置在对应位置
3. 验证包的完整性
4. 进入ImageBuilder文件夹，执行以下命令初始化环境
	1. linux镜像执行：**dos2unix prepare.sh; sh prepare.sh** linux
5. 进入iso文件夹，执行下述命令计算sha256值，以EulerOS-V2.0SP10-x86_64-dvd.iso为例。
	1. **sha256sum EulerOS-V2.0SP10-x86_64-dvd.iso**
6. 进入EulerOS 2.10操作系统euleros2.0sp10文件夹中，修改eulerosv2sp10_x86_64_uefi.json配置文件中下述配置，需要保证中的sha256值与配置文件中的匹配



## 问题

1. 安装驱动有问题
	1. 华为云Stack 8.6.0 技术中台与AI数据中台服务扩容指南 03， 该文档中制作 制作Ant1|Ant8和Hnt1|Hnt8裸金属镜像 ，操作步骤第九步，安装驱动： 请将驱动软件rpm包放在rpm文件夹下
	2. 安装啥驱动？
	3. rpm 包在哪？


## 账号密码

IAM 账号名称：huaweitest
密码：Guangdong@2025

root / Guangdong@2025
首次登录需修改密码：
密码修改为：Guangdong@2025.
![[Pasted image 20260427155348.png]]