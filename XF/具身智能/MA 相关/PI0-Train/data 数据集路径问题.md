好的，我把**数据集相关的所有错误**整理成一份完整的笔记，方便你记录和回顾。

---

## 📝 笔记：PI0 训练数据集错误排查

### 一、数据集相关错误概览

在 PI0 训练启动过程中，数据集相关的错误一共出现了 **3 个**，它们按排查顺序依次是：

| 序号 | 错误现象 | 发生阶段 |
| :--- | :--- | :--- |
| ① | `HFValidationError: Repo id must be in the form 'repo_name' or 'namespace/repo_name'` | 训练脚本解析数据集路径时 |
| ② | `FileNotFoundError: meta/info.json` | 数据集加载阶段 |
| ③ | `ArrowInvalid: Parquet magic bytes not found in footer` | 读取具体数据文件时 |


### 二、详细错误记录

#### 错误 ①：路径被当作 Hugging Face 仓库 ID

**现象**：
```python
huggingface_hub.errors.HFValidationError: Repo id must be in the form 'repo_name' or 'namespace/repo_name': '/home/ma-user/modelarts/inputs/train_url_0'
```

**原因**：
- `train.py` 期望的 `--dataset.repo_id` 参数通常是 Hugging Face 仓库 ID（如 `danaaubakirova/koch_test`）。
- 当传入本地路径时，如果数据集缺少 `meta/info.json`，`LeRobotDataset` 无法识别其为本地数据集，转而尝试将其解析为 Hugging Face 仓库 ID，导致格式错误。

**修复方法**：
- 确保数据集目录下存在 `meta/info.json` 文件。
- `info.json` 必须包含数据集的基本元信息（如 `codebase_version`、`robot_type`、`data_path` 等）。


#### 错误 ②：缺少 `meta/info.json`

**现象**：
```python
FileNotFoundError: [Errno 2] No such file or directory: '/home/ma-user/modelarts/inputs/train_url_0/meta/info.json'
```

**原因**：
- `koch_test` 数据集在下载或上传过程中，`meta/` 目录丢失或未被包含。
- 该文件是 `LeRobotDataset` 加载数据集的**必需入口**，缺失会导致加载失败。

**修复方法**：
- 重新下载完整数据集，确保目录结构包含 `meta/`、`data/`、`videos/`。
- 或手动创建 `meta/info.json`（仅用于临时测试，不保证完整训练）。


#### 错误 ③：Parquet 文件损坏

**现象**：
```python
pyarrow.lib.ArrowInvalid: Parquet magic bytes not found in footer. Either the file is corrupted or this is not a parquet file.
```

**原因**：
- `.parquet` 文件头部应为 `PAR1`（十六进制 `50 41 52 31`）。
- 验证时实际显示 `vers`（`76 65 72 73`），说明文件已损坏。
- 损坏原因：下载中断、网络不稳定、传输过程中文件损坏。

**修复方法**：
- 重新下载数据集。
- 下载完成后，使用以下命令验证文件完整性：
  ```bash
  python -c "with open('data/chunk-000/episode_000000.parquet', 'rb') as f: print(f.read(4))"
  ```
- 预期输出应为 `b'PAR1'`。


### 三、数据集标准目录结构

`koch_test` 数据集的完整结构应为：

```
train_url_0/
├── meta/
│   └── info.json          # 数据集的元信息（必需）
├── data/
│   └── chunk-000/
│       ├── episode_000000.parquet
│       ├── episode_000001.parquet
│       └── ...            # 多个 .parquet 文件
└── videos/
    └── chunk-000/
        ├── laptop/
        │   └── episode_000000.mp4
        ├── phone/
        └── ...            # 多个 .mp4 文件
```

**关键要求**：
- `meta/info.json` 必须存在且格式正确。
- 所有 `.parquet` 文件头部必须为 `b'PAR1'`。
- 视频文件 `.mp4` 为可选，但缺失可能导致部分功能受限。


### 四、根本原因总结

以上三个错误本质上是**同一个问题的不同表现**：**数据集下载或传输过程中损坏/不完整**。

| 错误 | 根源 |
| :--- | :--- |
| ① 路径解析错误 | `meta/info.json` 缺失 → 无法识别为本地数据集 → 被当作 Hugging Face ID |
| ② 文件不存在 | `meta/` 目录未正确上传 |
| ③ Parquet 损坏 | 文件在下载/上传/解压过程中损坏（头部为 `vers` 而非 `PAR1`） |


### 五、完整解决方案

#### 1. 重新下载数据集

```bash
# 在 Mac/Windows 或 cbh 上执行
hf download danaaubakirova/koch_test --repo-type dataset --local-dir ./koch_test
```

#### 2. 验证下载完整性

```bash
cd koch_test
python -c "with open('data/chunk-000/episode_000000.parquet', 'rb') as f: print(f.read(4))"
```

#### 3. 上传到 OBS

确保上传的是 `koch_test/` 目录下的**所有内容**（包括 `meta/`、`data/`、`videos/`），而不是 `koch_test` 文件夹本身。

#### 4. 在训练脚本中传入正确的数据集路径

```bash
--dataset.repo_id=/home/ma-user/modelarts/inputs/train_url_0
```

该路径必须包含 `meta/` 和 `data/` 子目录。


### 六、验证清单

| 检查项 | 命令 | 预期结果 |
| :--- | :--- | :--- |
| 检查数据集目录结构 | `ls -la train_url_0/` | 包含 `meta/`、`data/`、`videos/` |
| 检查 `info.json` 是否存在 | `cat train_url_0/meta/info.json` | 显示有效的 JSON 内容 |
| 验证 `.parquet` 文件头部 | `python -c "with open('train_url_0/data/chunk-000/episode_000000.parquet', 'rb') as f: print(f.read(4))"` | `b'PAR1'` |


### 七、经验教训

1. **下载后必须验证**：不要假设下载一定成功，大文件容易损坏。
2. **上传时注意目录层级**：OBS 挂载后的路径必须与训练脚本期望的路径匹配。
3. **`meta/info.json` 是必需文件**：缺少它会导致路径解析错误。
4. **网络稳定性是关键**：断点续传功能可靠，但需确保最终文件完整。

---
