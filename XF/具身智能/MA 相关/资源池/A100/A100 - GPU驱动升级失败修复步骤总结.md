---
tags:
  - MA
---
## 一、问题现象
- 平台显示驱动已更新至 570.148.08，但节点 `nvidia-smi` 仍显示 470.103.01
- 重启后 `nvidia-smi` 报 `No devices were found`
- `dmesg` 报错：`Direct firmware load for nvidia/570.148.08/gsp_tu10x.bin failed with error -2`

## 二、根因分析
1. **首次失败原因**：OBS 桶中驱动文件未设置匿名公共读，平台下载时被拒，得到 263 字节的 `AccessDenied` XML 文件，安装失败。
2. **二次失败原因**：修正 OBS 权限后驱动包下载成功（359MB），但 570 驱动默认启用 GSP，系统缺少 GSP 固件文件（`gsp_tu10x.bin`、`gsp_ga10x.bin`），导致 GPU 无法初始化。

## 三、修复步骤

### 步骤1：修正 OBS 文件权限
- 登录 OBS 控制台，进入桶 `{region_id}-modelarts-common-region`
- 将 `NVIDIA-Linux-x86_64-570.148.08.run` 设置为**匿名公共读**
- 浏览器直接访问 OBS 链接，验证能下载完整 359MB 文件

### 步骤2：重新触发平台驱动升级
- ModelArts 控制台 → 资源管理 → 专属资源池 → 更多 → 驱动升级
- 选择 570.148.08，等待升级完成
- 确认节点上 `/usr/local/nvidia/nvidia.run` 大小为 **359MB**

### 步骤3：手动提取 GSP 固件
```bash
chmod +x /usr/local/nvidia/nvidia.run
cd /tmp
/usr/local/nvidia/nvidia.run --extract-only
```
固件位于 `/tmp/NVIDIA-Linux-x86_64-570.148.08/firmware/` 下。

### 步骤4：复制固件到系统目录
```bash
mkdir -p /lib/firmware/nvidia/570.148.08/
cp /tmp/NVIDIA-Linux-x86_64-570.148.08/firmware/*.bin /lib/firmware/nvidia/570.148.08/
```
确认文件存在：
```bash
ls -lh /lib/firmware/nvidia/570.148.08/
```

### 步骤5：重建 initramfs
```bash
dracut --force
```

### 步骤6：重启节点
- **前提**：确认节点无关键业务运行，选择业务低峰期
- **方式**：优先通过 ModelArts 控制台重启节点；若手动重启，使用 `reboot`
- **注意**：准备带外管理（BMC/IPMI）以防 SSH 断连

### 步骤7：验证修复结果
```bash
nvidia-smi
dmesg | grep -i nvidia | grep gsp
```
- `nvidia-smi` 应显示 8 块 A100，驱动版本 570.148.08
- `dmesg` 无 `gsp_tu10x.bin failed` 报错

## 四、回滚方案（如修复失败）
1. 删除固件目录：`rm -rf /lib/firmware/nvidia/570.148.08/`
2. 重新执行 `dracut --force` 并重启
3. 平台侧重新选择 470 驱动版本升级（或手动安装旧驱动）
4. 若 CUDA 12.8 镜像仍无法使用，需客户降级 CUDA 版本至 11.x

## 五、生产环境注意事项
- 所有操作前备份关键配置，确认无运行中任务
- 重启会影响该节点业务，但不影响平台其他节点
- HCE 2.0 需留意安全启动可能导致的引导问题
- 操作全程记录，便于审计和回溯

---

**一句话总结**：修 OBS 权限 → 重下驱动 → 提固件 → 放固件 → 重建 initramfs → 重启 → 验证。