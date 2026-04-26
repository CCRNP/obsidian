## 1.前提条件



## 2.下载 cloud-init 安装包及依赖包



## 3.下载 agent 安装包及依赖包


## 4.用于制作镜像的软件包

## 5.操作步骤

1. 解压制作镜像的软件包
2. 将软件包放置在对应位置
3. 验证包的完整性
4. 进入ImageBuilder文件夹，执行以下命令初始化环境
	1. linux镜像执行：**dos2unix prepare.sh; sh prepare.sh** linux
5. 进入iso文件夹，执行下述命令计算sha256值，以EulerOS-V2.0SP10-x86_64-dvd.iso为例。
	1. **sha256sum EulerOS-V2.0SP10-x86_64-dvd.iso**
6. 进入EulerOS 2.10操作系统euleros2.0sp10文件夹中，修改eulerosv2sp10_x86_64_uefi.json配置文件中下述配置，需要保证[6](mk:@MSITStore:D:\Work\XF\BIGDATA\具身智能\文档\华为云Stack%208.6.0%20技术中台与AI数据中台服务扩容指南%2003.chm::/zh-cn_topic_0000001684676017.html#ZH-CN_TOPIC_0000001684676017__li18869143118297)中的sha256值与配置文件中的匹配