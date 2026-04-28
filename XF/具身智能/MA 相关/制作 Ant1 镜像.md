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
	2. [root@ecs-c66c iso]# sha256sum EulerOS-V2.0SP10-x86_64-dvd.iso
	回显如下：
	81836702e81a34752406349ae170a7acf541df9220c65dd47c0dfd3edf662835  EulerOS-V2.0SP10-x86_64-dvd.iso

6. 进入EulerOS 2.10操作系统euleros2.0sp10文件夹中，修改eulerosv2sp10_x86_64_uefi.json配置文件中下述配置，需要保证中的sha256值与配置文件中的匹配
	为 配置 checknum：d519e5f95a27ee6c6562c96b2b9ae25b9e0c8a380c1b0cfc0d245d8e9327967c
	"template": "euleros-v2sp10-x86_64_uefi",
原配置：
>{
  "variables": {
    "disk_size": "10000",
    "headless": "",
    "iso_checksum_type": "sha256",
    "iso_checksum": "81836702e81a34752406349ae170a7acf541df9220c65dd47c0dfd3edf662835",
    "iso_name": "EulerOS-V2.0SP10-x86_64-dvd.iso",
    "type1_gateway_type": "centralized",
    "ks_path": "ks_x86_64.cfg",
    "memory": "4096",
    "name": "euleros-v2sp10",
    "template": "euleros-v2sp10-x86_64_uefi",
    "enable_config_hostname": "true",
    "enable_websocket": "false",
    "support_ResetPwd": "true",
    "support_ces": "true",
    "ces_service_ip": "",
    "region0_id": "default",
    "external_global_domain_name": "default",
    "multipath_flag": "multipath",
    "add_drivers": "ahci megaraid_sas mpt3sas mpt2sas",
    "vnc_bind_address": ""
  },


7. 为镜像配置管理员初始密码
	1. 进入相应版本的Linux操作系统文件夹中，如"/opt/ImageBuilder/euleros2.0sp10"，修改http目录下对应CPU架构的ks_xx.cfg配置文件，找到rootpw配置项，执行以下步骤
		1. 执行以下命令，在回显的“Enter password:”后输入密码值，给pw变量赋值。
	        **read -s -p "Enter password: " pw**
	        Enter password:Jszn@2026
	        执行以下命令，获取加密的密码。
		    **python -c "import crypt; print(crypt.crypt('$pw'))"**
		    获取的返回值即为加密的密码，如下所示：
		    `$6$PX7DcIH88U2i.9HF$Li6WP/iYHJCQA8JsNWxrZygmQ1uKmMwnsXVXsbapylLHk93httpi81kqo1/xy.w4RrcvHkRlb.qLCiWfTaAjq0`
		2. 对于HCE2.0、EulerOS V2.0SP9及以上系列，需要继续执行以下命令，设置系统grub密码。
			1. [root@ecs-c66c http]# grub2-mkpasswd-pbkdf2
			Enter password:Jszn@2026
			Reenter password:Jszn@2026
			PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.D60AE8182F288B8CE2A8FE2584143F5B8089F10B6101EE0B9FAD0D2370734E32E94DA889B2EB9433975E41C3FA6D63EFF8614B8A6F9BF8E1A7EC8EA4C97EDFD9.A73D671D2ECF6F9579A397C657177E9C108E06D507F015DA4E5A531FC67698E49CC2C2AD1933272EE688B939CFE975B26EE0790F3842A755B568DD7B1A94598D
			2. 输入两次密码，生成的加密后的密码信息为`grub.******`
			3. 打开对应架构的ks*.cfg文件，找到%addon com_huawei_grub_safe --iscrypted --password='配置项'，在--password=' '中添加上一步生成的密码信息。



## 问题

1. 安装驱动有问题
	1. 华为云Stack 8.6.0 技术中台与AI数据中台服务扩容指南 03， 该文档中制作 制作Ant1|Ant8和Hnt1|Hnt8裸金属镜像 ，操作步骤第九步，安装驱动： 请将驱动软件rpm包放在rpm文件夹下
	2. 怎么确定安装什么驱动？
	3. rpm 包放在哪？
		1. 进入相应版本的Linux操作系统文件夹中，如 "/ImageBuilder/euleros2.0sp10"，ls 应会有 rpm 文件夹

2. EulerOS 2.10 镜像ISO 无法下载，去哪里获取？
	借账号申请下载

3. 进入ImageBuilder文件夹，执行以下命令初始化环境。 执行命令：`dos2unix prepare.sh; sh prepare.sh linux` 报错

- Failed ==========> please download the OVMF-X64-r15214.zip package and put it into online_packages_dep folder
	这个问题，是因为 `prepare.sh` 脚本在准备环境时，没有在它指定的 `online_packages_dep` 文件夹里找到所需的 `OVMF-X64-r15214.zip` 固件包。
	**SourceForge下载页**：访问该项目的官方发布地址，找到对应版本的文件，点击下载放到 `online_packages_dep` 文件夹下即可：
	[https://sourceforge.net/projects/edk2/files/OVMF/OVMF-X64-r15214.zip/download](https://sourceforge.net/projects/edk2/files/OVMF/OVMF-X64-r15214.zip/download)

- Failed ==========> please download the openssl098e-0.9.8e-29.el7.centos.3.x86_64.rpm package and put it into online_packages_dep folder
	在此网站下载： https://crpm.cn/openssl098e-0-9-8e-29-el7-centos-3-x86_64-rpm/
	放到 online_packages_dep folder 即可


4. 执行成功中间的一些 failed，无需理会

	是的，虽然中间出现了一些 `failed` 或 `No such file or directory` 的提示，但**脚本最终判定为成功**，而且这些报错对后续 `packer build` 制作镜像**没有实质性影响**。
	
	 🔍 为什么说“成功”了？
	
	最后一行明确打印了：
		```
		Succeed to prepare for bms image building.
		```
	这说明脚本已经完成了它认为必要的检查与安装工作，并正常退出。中间的红字失败只是某些“可选”或“当前环境不适用”的步骤。
	
	 ❌ 中间出现的两个 `failed` 是什么意思？
	
	1.  **`/etc/libvirt/qemu.conf: No such file or directory`**
	    -   **原因**：脚本试图去修改 libvirt 的配置文件（可能是为了配置 UEFI 启动相关的 OVMF 固件路径），但你当前的制作虚拟机（华为云 ECS）并没有安装 `libvirt` 服务。这很正常，因为制作镜像的虚拟机不需要运行虚拟化服务。
	    -   **影响**：**无**。`packer build` 是在本机运行打包工具，它调用的是华为云 API，而不是本机的 libvirt。因此本机有没有 libvirt 完全不重要。
	
	2.  **`Failed to restart libvirtd.service: Unit libvirtd.service not found.`**
	    -   **原因**：同上，因为根本没有安装 `libvirtd` 服务，所以无法重启。
	    -   **影响**：**无**。不需要这个服务。
	
	 ✅ 已经成功完成的关键步骤
	
	-   **OVMF 包**：已经解压并放到了正确位置（`online_packages_dep/OVMF/OVMF.fd` 等文件已存在）。
	-   **openssl098e**：已成功安装。
	-   **Packer**：已成功安装（版本 1.5.4）。
	-   **所有依赖包检查**：全部通过（`cloudinit_depend` 下的 tar.gz 都找到了）。
	
	 📌 结论
	
	你可以**放心地继续下一步**：
		```bash
		packer build -var "password=$pw" eulerosv2sp10_x86_64_uefi.json
		```
	
	那些 libvirt 相关的警告可以忽略，它们只是脚本试图为“本地虚拟机”环境做额外配置，但对你当前基于华为云 ECS + 云 API 的自动化制作流程毫无影响。
	
	如果在后续 `packer build` 中遇到其他问题，再根据具体报错处理。现在环境准备已经成功。

5. 执行以下命令，制作**eulerosv2sp10**的Ant1|Ant8和Hnt1|Hnt8镜像，执行命令报错，命令如下：
    **packer build -var "password=$pw" eulerosv2sp10_x86_64_uefi.json** 

错误信息：
	Build 'qemu' errored: Failed creating Qemu driver: exec: "/usr/libexec/qemu-kvm"                                                                                                        : stat /usr/libexec/qemu-kvm: no such file or directory
	
	==> Some builds didn't complete successfully and had errors:
	--> qemu: Failed creating Qemu driver: exec: "/usr/libexec/qemu-kvm":stat /usr/libexec/qemu-kvm: no such file or directory
	==> Builds finished but no artifacts were created.
❓ 错误原因
运行的 `packer build` 命令使用了 `qemu` 构建器，它会在本地创建一台临时的虚拟机来制作镜像[](https://developer.hashicorp.com/packer/integrations/hashicorp/qemu/latest/components/builder/qemu?optInFrom=packer-io)。要完成这项工作，需要虚拟机里有 QEMU 和 KVM 支持[](https://m.elecfans.com/zt/189642)。目前的报错信息正是缺少了相关的核心组件。


## 账号密码
1. 虚拟机
租户名称：gdhx-hdd
IAM 账号名称：huaweitest
密码：Guangdong@2025.

ECS 登录
root / Guangdong@2025

IAM 登录——首次登录需修改密码：
密码修改为：Guangdong@2025.
![[做镜像的虚拟机 华为云 IAM 登录密码更新.png|689]]

2. 镜像配置管理员初始密码、系统grub 明文密码 都是 ：`Jszn@2026`
![[镜像配置管理员初始密码、系统grub密码.png]]