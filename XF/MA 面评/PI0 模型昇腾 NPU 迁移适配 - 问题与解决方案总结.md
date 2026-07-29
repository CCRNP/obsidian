# PI0 模型昇腾 NPU 迁移适配 - 问题与解决方案总结

以下是我在 PI0 模型从 GPU 环境迁移到华为昇腾 NPU（910B）平台，并在 ModelArts 上进行训练和推理适配过程中遇到的核心问题及解决方案，供面试复盘使用。


## 一、环境与版本对齐问题

### 问题 1：Driver/Firmware 版本不匹配

**现象**：
```bash
npu-smi info -t board -i 0
# Software Version: 25.2.2
# Firmware Version: 7.5.0.1.129
# 文档要求: Driver 25.2.0, Firmware 配套 25.2.0
```

**根因**：
- 服务器（IT21HMDC_Bin5 工程板）的驱动版本过新（25.2.2）但固件严重偏旧（7.5.0.1.129），属于非标准组合。

**解决方案**：
- 先固件后驱动，按顺序降级到配套版本。
- 离线操作：在有网机器下载 .run 包 → scp 传到 910B → 本地安装 → reboot 重启生效。

**经验**：昇腾驱动和固件必须严格配套，否则容器内 `torch_npu` 导入会报 `libascend_hal.so` 找不到。

### 问题 2：基础镜像版本不匹配

**现象**：
- 拉取的 `verl` 镜像内组件版本：
  - torch 2.7.1（要求 2.1.0）
  - torch_npu 2.7.1（要求 2.1.0/v7.1.0）
  - CANN 未找到（要求 8.2.RC1）

**根因**：
- `verl` 项目镜像基于 CANN 8.3.RC1 构建，与 PI0 要求的 CANN 8.2.RC1 不兼容。

**解决方案**：
- 放弃 `verl` 镜像，改用华为云 SWR 官方基础镜像：
  ```
  swr.cn-southwest-2.myhuaweicloud.com/atelier/pytorch_2_1_ascend:pytorch_2.1.0-cann_8.2.rc1-...
  ```
- 验证后该镜像包含：PyTorch 2.1.0、torch_npu 2.1.0.post13、CANN 8.2.RC1。

**经验**：镜像拉取后必须验证内部版本，不能只看镜像名。`torch_npu` 版本号 `2.1.0.post13` 本质对应 v7.1.0 release 分支。


## 二、代码依赖与迁移问题

### 问题 3：urllib3 版本冲突导致 accelerate 无法导入

**现象**：
```python
ImportError: cannot import name 'DEFAULT_CIPHERS' from 'urllib3.util.ssl_'
```

**根因**：
- `accelerate` → `boto3` → `botocore` 依赖链中，`botocore` 尝试从 `urllib3.util.ssl_` 导入 `DEFAULT_CIPHERS`。
- `urllib3 >= 2.0` 已移除该常量，而环境安装的是 `urllib3 2.7.0`。

**解决方案**：
```bash
pip install "urllib3<2.0"
# 降级到 1.26.20
```

**经验**：版本冲突是 Python 环境最常见的问题。排查时看报错栈顶部的 `import` 链，逐层追溯。

### 问题 4：mindspeed 模块缺失

**现象**：
```python
ModuleNotFoundError: No module named 'mindspeed'
# 错误位置: from mindspeed.optimizer.adamw import AdamW
```

**根因**：
- 昇腾适配补丁引用了 `mindspeed` 优化库，但该库未预装在基础镜像中。

**解决方案**：
```bash
sed -i 's/from mindspeed.optimizer.adamw import AdamW/from torch.optim import AdamW/g' \
  lerobot/common/optim/optimizers.py
```

**经验**：直接替换为 PyTorch 原生 AdamW 即可，功能等价，减少外部依赖。


## 三、数据集问题

### 问题 5：数据集目录结构不完整

**现象**：
```python
FileNotFoundError: meta/info.json
HFValidationError: Repo id must be in the form 'repo_name' or 'namespace/repo_name': '/home/.../train_url_0'
```

**根因**：
- `LeRobotDataset` 加载数据集时需要 `meta/info.json` 来识别数据集结构。
- 缺少该文件时，脚本会将本地路径误判为 Hugging Face 仓库 ID。

**解决方案**：
- 确保数据集包含完整的 `meta/`、`data/`、`videos/` 目录结构。
- 若数据在 OBS 上，上传时需保持目录层级不变。

### 问题 6：Parquet 文件损坏

**现象**：
```python
pyarrow.lib.ArrowInvalid: Parquet magic bytes not found in footer
```

**根因**：
- 验证 `.parquet` 文件头部发现是 `vers` 而非 `PAR1`。
- 下载/传输过程中文件损坏。

**解决方案**：
- 重新下载数据集，下载后验证文件完整性：
  ```bash
  python -c "with open('episode_000000.parquet', 'rb') as f: print(f.read(4))"
  # 预期输出: b'PAR1'
  ```

**经验**：大文件传输后必须校验，不能假设下载成功。Parquet 文件头部固定为 `PAR1`（十六进制 `50 41 52 31`）。


## 四、训练调试问题

### 问题 7：TensorBoard 写入 AverageMeter 对象报错

**现象**：
```python
NotImplementedError: Got <class 'lerobot.common.utils.logging_utils.AverageMeter'>, 
but numpy array, torch tensor, or caffe2 blob name are expected.
```

**根因**：
- `train_tracker.loss` 是 `AverageMeter` 对象，但 `writer.add_scalar()` 期望数值或 Tensor。

**解决方案**：
```bash
# 将 train_tracker.loss 改为 train_tracker.loss.avg
sed -i 's/train_tracker\.loss/train_tracker.loss.avg/g' lerobot/scripts/train.py
sed -i 's/train_tracker\.lr/train_tracker.lr.avg/g' lerobot/scripts/train.py
```

**经验**：训练脚本中常见的日志记录问题，`AverageMeter` 是分布式训练中用于平滑统计的辅助类。


## 五、推理部署问题

### 问题 8：推理脚本反复失败

**现象**：
- 自行编写的 `inference.py` 在模型加载、数据加载、特征对齐等多个环节报错。
- 主要错误包括：`KeyError: 'task'`、`KeyError: 'action'`、`AttributeError: 'dict' object has no attribute 'type'`、`RuntimeError: dim mismatch in cat` 等。

**根因**：
- PI0 的推理流程没有统一的离线推理入口，`eval.py` 仅支持模拟环境。
- 手动处理 `LeRobotDataset` 的 batch 格式、`input_features` 特征对齐、时序维度拼接等，容易出错。

**解决方案**：
- 使用昇腾官方提供的 `cann-recipes-embodied-ai` 仓库中的推理脚本：
  - `run_pi0_inference.sh`：Shell 入口
  - `test_pi0_on_ascend.py`：Python 推理核心
- 关键差异：
  - 使用 `make_policy(cfg, device)` 而非 `PI0Policy.from_pretrained()`
  - 使用 `policy.select_action(batch)` 而非 `policy(obs)`
  - 使用 `DataLoader` + `episodes=[idx]` 加载单 episode，而非全量加载

**经验**：官方适配脚本经过了充分验证，优先使用而非自行编写。推理脚本与训练脚本的差异在于：推理需要 `select_action`（仅前向），而训练用 `forward`（含损失计算）。


## 六、完整错误速查表

| 错误现象                            | 根因                 | 解决方案                            |
| :------------------------------ | :----------------- | :------------------------------ |
| `libascend_hal.so: cannot open` | 无 NPU 硬件或驱动未挂载     | 在 910B 上运行，容器需 `--device` 映射    |
| `DEFAULT_CIPHERS` 导入失败          | urllib3 版本过高       | `pip install "urllib3<2.0"`     |
| `mindspeed` 模块不存在               | 缺少昇腾优化库            | 替换为 `torch.optim.AdamW`         |
| `meta/info.json` 不存在            | 数据集结构不完整           | 重新下载/上传完整数据集                    |
| `Parquet magic bytes not found` | 数据文件损坏             | 重新下载，验证 `b'PAR1'`               |
| `AverageMeter` 写入 TensorBoard   | 类型不匹配              | 使用 `.avg` 属性取值                  |
| `config.json` 字段不兼容             | Hugging Face 元数据残留 | 删除 `push_to_hub`、`repo_id` 等字段  |
| 推理 `KeyError: task/action`      | 推理 batch 缺少必要字段    | 使用 `select_action` 而非 `forward` |


## 七、面试回答要点

### 1. 项目背景（STAR 法则）
- **S**：需要将 PI0 模型迁移到昇腾 NPU 平台，在 ModelArts 上完成训练和推理适配。
- **T**：环境版本对齐、依赖冲突、数据集损坏、训练脚本适配、推理脚本缺失等多层挑战。
- **A**：按“环境验证 → 镜像构建 → 代码迁移 → 训练调试 → 推理部署”顺序推进。
- **R**：成功在 910B 上完成 8 卡训练（FPS 100.5，Loss 0.024），并输出可部署的模型权重。

### 2. 关键技术决策
- 为什么不用 `verl` 镜像 → 版本不匹配，改用 SWR 官方基础镜像。
- 为什么 `mindspeed` 直接替换 → 减少外部依赖，`torch.optim.AdamW` 功能等价。
- 为什么推理用官方脚本 → 自行编写面临数据加载、特征对齐等复杂问题，官方脚本已验证。

### 3. 亮点
- 在内网环境下完成整套离线镜像制作和部署。
- 系统化整理了所有错误码及解决方案。
- 形成了可复用的 PI0 训练推理方案文档。