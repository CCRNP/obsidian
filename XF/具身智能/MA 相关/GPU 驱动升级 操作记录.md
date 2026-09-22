---
tags:
  - MA
---
## 一、准备阶段

### 1. 获取驱动包
- 确认服务器CPU架构（x86_64 / ARM）和操作系统（RHEL/openEuler等）。
- 从NVIDIA官网下载对应版本的 `.run` 驱动文件（推荐数据中心驱动 570.148.08 WHQL，满足CUDA 12.8要求）。
- 如官网无法直接下载，可使用 `curl -L -o` 加 `-e` 参数（Referer）绕过防盗链：

```bash
curl -L -o NVIDIA-Linux-x86_64-570.148.08.run -e "https://www.nvidia.cn/drivers/details/240206/" https://cn.download.nvidia.com/tesla/570.148.08/NVIDIA-Linux-x86_64-570.148.08.run
```

### 2. 上传驱动包到OBS
- **使用账号**：ModelArts二级VDC用户（或管理员）登录OBS控制台。[[各账号密码#^2cc096]]
- **桶名称**：`{region_id}-modelarts-common-region`。[[MA-API#参数 EX]]
- **上传路径**：桶的根目录 `/`。
- **权限设置**：将驱动文件设置为**匿名公共读**（否则ModelArts无法下载）。

NVIDIA-Linux-x86_64-570.148.08.run 驱动包上传到 obs 的 链接如下：
https://gdrising-global-1-modelarts-common-region.obsv3.gdrising-global-1.air.gdrising.com.cn/NVIDIA-Linux-x86_64-570.148.08.run

> ⚠️ 注意：严禁直接以ModelArts一级/二级VDC管理员登录运营面并删除存量的AK/SK，否则会导致ModelArts整体不可用。

---

## 二、录入新驱动版本

### 1. 登录CDK master节点
- 通过SSH登录到CDK master节点。[[登录 CDK]]

### 2. 找到并登录 modelarts-os-apiserver Pod
- 执行 `kubectl get pod`，找到任一 `modelarts-os-apiserver-xxx` Pod。
- 登录该Pod：
  ```bash
  kubectl exec -it <pod_name> bash
  ```
> ✅ 只需登录一个Pod修改即可，修改的是全局配置，所有Pod自动同步。

### 3. 编辑 gpu-driver 插件模板
- 执行命令：
  ```bash
  kubectl edit pt gpu-driver -o json
  ```
- 在打开的文件中，**新增一个版本块**（注意JSON格式和逗号）：
  ```json
  "570.148.08": {
    "address": {
      "driver": "https://<你的桶名>.obsv3.<你的endpoint>/NVIDIA-Linux-x86_64-570.148.08.run"
    },
    "creationTimestamp": "2026-09-22T10:00:00Z"
  },
  ```
  - `creationTimestamp` 填当前时间（ISO 8601格式），仅作记录用，不影响功能。
  - `driver` 中的URL需替换为真实的OBS桶名、Endpoint和文件名。
- 编辑完成后，输入 `wq` 保存。
- 若报错 `plugintemplates ... is invalid`，检查：
  - JSON语法（逗号、括号匹配）；
  - 字段名是否正确；
  - 可先用 `python -m json.tool` 校验临时文件 `/tmp/kubectl-edit-*.json`。
- 保存成功后提示 `plugintemplates.os.modelarts.huaweicloud/gpu-driver edited`。

---

## 三、升级资源池驱动

### 1. 进入ModelArts管理控制台
- 使用管理员账号登录ModelArts管理控制台。

### 2. 选择资源池并升级
- 进入 **“资源管理 > 专属资源池”**。
- 选择目标资源池，点击 **“更多 > 驱动升级”**。
- 在弹窗中选择**目标版本**（刚录入的 `570.148.08`）和升级模式：
  - **安全升级**：逐节点升级，业务不中断（推荐）。
  - **强制升级**：全部节点同时升级，可能中断业务。
- 确认后开始升级，等待完成。

### 3. 注意事项
- 升级前确认所有节点GPU型号支持新驱动。
- 建议在业务低峰期操作，并确保可通过BMC/IPMI带外管理，防止SSH断连。
- 如果驱动包是 `.run` 格式，平台会自动处理安装；如果是 `.rpm` 包，可能需要研发手动介入。

---

## 四、验证升级结果

### 1. 检查驱动版本
- 登录到GPU节点，执行：
  ```bash
  nvidia-smi
  ```
  查看顶部显示的驱动版本是否为 `570.148.08`。

### 2. 验证CUDA兼容性
- 在容器内运行 `nvidia-smi` 或 CUDA 示例程序，确认CUDA 12.8可正常调用。
- 启动客户的CUDA 12.8镜像，验证推理/训练任务能否正常运行。

### 3. 监控业务
- 观察升级后一段时间内的训练/推理任务，确认无异常报错。

---

## 五、常见问题与处理

| 问题 | 原因 | 解决 |
|---|---|---|
| `kubectl edit` 报 invalid | JSON格式错误或字段校验失败 | 检查临时文件，修正逗号、括号、时间格式 |
| 驱动下载403 | 防盗链 | 使用 `curl -e` 加Referer |
| 升级后任务失败 | 驱动与CUDA版本不匹配 | 确认驱动版本 ≥ 570.26，且镜像CUDA为12.8 |
| 升级过程中SSH断连 | 驱动重载导致网络中断 | 通过BMC/IPMI操作，或使用安全升级模式 |
| OBS文件无法下载 | 权限不是匿名公共读 | 修改对象ACL为公共读 |

---

**总结**：整个流程可概括为 **“下载驱动 → 上传OBS → 录入版本 → 控制台升级 → 验证”**。核心操作是在 `gpu-driver` 插件模板中新增版本条目，然后在ModelArts控制台触发升级。务必注意JSON格式和OBS权限，避免录入失败。


## 结果截图
![[Pasted image 20260920165200.png]]


