---
tags:
  - MA-训练
---

## 📝 训练启动报错 `ImportError: cannot import name 'DEFAULT_CIPHERS' from 'urllib3.util.ssl_'`

### 1️⃣ 问题现象

在 910B 容器内执行 PI0 训练脚本时，`accelerate` 启动阶段报错：
cat /home/ma-user/lerobot/test/output/train_performance_8p_base_fp32.log：
```text
ImportError: cannot import name 'DEFAULT_CIPHERS' from 'urllib3.util.ssl_'
```

完整报错栈指向 `botocore` → `urllib3` → `ssl_.py`。

---

### 2️⃣ 根因分析

- `botocore`（AWS SDK，被 `boto3` 依赖）在初始化时会尝试从 `urllib3.util.ssl_` 中导入 `DEFAULT_CIPHERS`。
- 在 **`urllib3 >= 2.0`** 中，`DEFAULT_CIPHERS` 已被移除（改为 `DEFAULT_CIPHERS` → `DEFAULT_CIPHER_SUITES`，且 API 变更）。
- 当前环境安装了 **`urllib3 2.7.0`**，而 `botocore` 版本较旧，尚不兼容新版 `urllib3`，导致导入失败。

> **本质**：这是一个 Python 包依赖版本不兼容的问题，与 NPU 硬件无关。

---

### 3️⃣ 解决方案

**降级 `urllib3` 到 `<2.0` 版本**，恢复 `DEFAULT_CIPHERS` 的可用性：

```bash
pip install "urllib3<2.0"
```

执行后，`urllib3` 会降级到 `1.26.x` 系列，`botocore` 的导入恢复正常。

**备选方案**（不推荐，可能引入其他问题）：升级 `botocore` 和 `boto3` 到支持 `urllib3>=2.0` 的版本，但需要确认与 `accelerate` 的兼容性。

---

### 4️⃣ 验证修复

降级后，执行以下命令确认 `accelerate` 可正常导入：

```bash
python -c "from accelerate import Accelerator; print('accelerate OK')"
```

---

### 5️⃣ 预防措施

- 在 `Dockerfile` 或 `requirements.txt` 中**锁定 `urllib3<2.0`**，避免后续 `pip install` 时自动升级到不兼容版本。
- 在依赖管理文件中加入：
  ```txt
  urllib3<2.0
  ```

---

### 6️⃣ 附加说明

- **错误中的 `msnpureport` 警告**不影响训练，是昇腾监控工具在容器内的提示，可通过 `export MSNPUREPORT_DOCKER_MODE=1` 消除。
- 该问题在 `cbh` 上不会出现，因为 `accelerate` 在无 NPU 环境下的初始化路径不同，**只有挂载了 NPU 设备的容器才会触发**。

---

### ✅ 一句话总结

> 训练启动报错是因为 `urllib3` 版本过高（≥2.0）与 `botocore` 不兼容，降级到 `<2.0` 即可解决。

---
