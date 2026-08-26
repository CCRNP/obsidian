要单独安装 `bash scripts/install.sh --megatron --msid 96bc0a3bf3398bf45ac26e0bded95ee174ac449b` 这个命令所涵盖的内容，其实就是要手动完成脚本里的几个核心步骤：安装 Megatron-LM，以及安装特定 Commit ID 的 MindSpeed 和 MindSpeed-MM。

### 1. 安装 Megatron-LM

脚本中的 `--megatron` 参数就是用来安装 Megatron-LM 的。

1.  进入 MindSpeed-MM 目录：
    ```bash
    cd /home/ma-user/MindSpeed-MM
    ```
2.  克隆 Megatron-LM 仓库并安装：
    ```bash
    git clone https://github.com/NVIDIA/Megatron-LM.git
    cd Megatron-LM
    pip install -e .
    ```

> **注意**：如果 GitHub 访问慢，可以尝试使用代理或换源。

### 2. 安装指定 Commit ID 的 MindSpeed

脚本中的 `--msid` 参数指定了要安装的 MindSpeed 核心库的特定 Commit ID。

1.  在 MindSpeed-MM 的同级目录下克隆 MindSpeed 仓库：
    ```bash
    cd /home/ma-user
    git clone https://gitcode.com/Ascend/MindSpeed.git
    cd MindSpeed
    ```
2.  切换到指定的 Commit ID（`96bc0a3bf3398bf45ac26e0bded95ee174ac449b`）：
    ```bash
    git checkout 96bc0a3bf3398bf45ac26e0bded95ee174ac449b
    ```
3.  以开发模式安装：
    ```bash
    pip install -e .
    ```

### 3. 安装 MindSpeed-MM

最后，还需要安装 MindSpeed-MM 项目本身。

1.  回到 MindSpeed-MM 目录：
    ```bash
    cd /home/ma-user/MindSpeed-MM
    ```
2.  以开发模式安装：
    ```bash
    pip install -e .
    ```

### 4. （可选）安装 torch_npu

脚本还会检查并安装与 PyTorch 版本匹配的 `torch_npu`。如果你的环境里没有，可以参考以下步骤安装：

```bash
# 首先确认 PyTorch 版本
python -c "import torch; print(torch.__version__)"

# 然后安装对应版本的 torch_npu
# 示例：如果 PyTorch 是 2.7.1，则：
pip install torch_npu==2.7.1
```

---

### 💎 总结

总的来说，就是把 `install.sh` 脚本自动完成的工作拆解成几个独立的手动步骤。你可以按顺序执行上面的命令，来达到和运行 `bash scripts/install.sh --megatron --msid ...` 一样的效果。