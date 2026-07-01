---
tags:
  - MA
---

好的，我们来一步步完成CLIP预训练权重的下载。

你提供的代码是使用Hugging Face `transformers` 库下载模型的标准方法。考虑到国内网络环境可能不稳定，我这里提供三种方法，并重点介绍如何通过配置国内镜像来加速下载，确保过程顺利。

### ⚙️ 准备工作：安装必要的库

在开始任何下载方法前，请先在命令行或终端中执行以下命令，安装必需的Python库：

```bash
pip install transformers torch Pillow
```
*   `transformers`：Hugging Face的核心库，用于加载模型。
*   `torch`：PyTorch深度学习框架，是CLIP模型运行的基石。
*   `Pillow`：Python图像处理库，用于处理图像数据。

---

### 🚀 方法一：使用 `from_pretrained` + `save_pretrained` (代码方式)

这是最直接的方式，适合集成到Python脚本中。

1.  **新建一个Python文件**，比如 `download_clip.py`。
2.  **将以下代码复制进去**：

    ```python
    from transformers import CLIPModel, CLIPProcessor

    # 1. 设置镜像源（关键一步！可大幅提升国内下载速度）
    import os
    os.environ["HF_ENDPOINT"] = "https://hf-mirror.com" # 设置Hugging Face镜像

    # 2. 指定模型名称
    model_name = "openai/clip-vit-base-patch32"

    # 3. 下载并加载模型和处理器
    print("正在从镜像站下载模型，请稍候...")
    model = CLIPModel.from_pretrained(model_name)
    processor = CLIPProcessor.from_pretrained(model_name)
    print("模型和处理器下载并加载完成！")

    # 4. 保存到本地指定目录
    local_dir = "./my_clip_model"  # 你可以修改这个路径
    model.save_pretrained(local_dir)
    processor.save_pretrained(local_dir)
    print(f"模型和处理器已成功保存到本地目录: {local_dir}")
    ```

3.  **在终端中运行这个脚本**：

    ```bash
    python download_clip.py
    ```

脚本运行后，模型文件（包括`pytorch_model.bin`、`config.json`等）就会下载并保存到你指定的 `./my_clip_model` 文件夹中。

### ⌨️ 方法二：使用 `huggingface-cli` 命令行工具 (推荐)

这是Hugging Face官方推荐的命令行下载方式，更为灵活和可靠。

1.  **安装 `huggingface_hub` 库**（如果尚未安装）：
    ```bash
    pip install huggingface_hub
    ```

2.  **设置镜像源环境变量**（在命令行中执行）：
    *   **Windows (CMD)**:
        ```cmd
        set HF_ENDPOINT=https://hf-mirror.com
        ```
    *   **Windows (PowerShell)**:
        ```powershell
        $env:HF_ENDPOINT = "https://hf-mirror.com"
        ```
    *   **macOS / Linux**:
        ```bash
        export HF_ENDPOINT=https://hf-mirror.com
        ```

3.  **执行下载命令**：
    ```bash
    huggingface-cli download openai/clip-vit-base-patch32 --local-dir ./my_clip_model
    ```
    这个命令会将模型所有文件完整地下载到你指定的 `./my_clip_model` 目录下。

### 🌐 方法三：从Hugging Face网页手动下载

如果无法使用命令行，可以直接从浏览器下载。

1.  访问模型页面：[https://huggingface.co/openai/clip-vit-base-patch32](https://huggingface.co/openai/clip-vit-base-patch32)
2.  在页面的 **“Files and versions”** 区域，逐一点击每个文件（特别是 `pytorch_model.bin`，大小约577MB）右侧的下载按钮，将它们全部下载下来。
3.  将所有下载的文件放入一个文件夹中，例如 `my_clip_model`。

### ✅ 验证与后续

*   **验证下载**：下载完成后，检查 `my_clip_model` 文件夹，确保包含 `pytorch_model.bin`, `config.json`, `preprocessor_config.json` 等关键文件。
*   **离线加载**：将来在ModelArts或其他环境中使用时，可以直接从该文件夹加载模型，无需再次联网下载：
    ```python
    model = CLIPModel.from_pretrained("./my_clip_model")
    processor = CLIPProcessor.from_pretrained("./my_clip_model")
    ```

### ⚠️ 故障排查

*   **`ModuleNotFoundError: No module named 'transformers'`**：说明 `transformers` 库未安装或未正确安装，请检查第一步。
*   **下载速度慢或连接失败**：请务必确认已正确设置 `HF_ENDPOINT` 环境变量。如果仍不行，可以尝试更换网络或使用方法三。
*   **`pytorch_model.bin` 文件不完整**：检查文件大小，完整的 `pytorch_model.bin` 大约577MB。如果大小不对，请删除后重新下载。

下载好模型权重后，下一步就是把它和训练脚本一起上传到OBS，然后在ModelArts上创建训练作业了。如果遇到问题，随时可以再来问我。