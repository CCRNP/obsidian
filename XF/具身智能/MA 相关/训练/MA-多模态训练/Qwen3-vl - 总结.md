---
tags:
  - MA-训练
---

## 一、整体目标
在华为云 ModelArts 上，基于**昇腾 910B NPU**，完成 **Qwen3-VL-8B-Instruct** 多模态模型的训练和推理验证，打通从数据准备到部署的完整流程。


## 二、环境与镜像构建

### 2.1 基础信息
- **基础镜像**：`swr.cn-south-1.myhuaweicloud.com/ascendhub/mindspeed-mm:26.0.0-910b-openeuler24.03-py3.11-aarch64`
- **最终镜像**：`swr.gdrising-global-1.air.gdrising.com.cn/ma-test/mindspeed-mm:full`
- **硬件**：华为昇腾 910B NPU（单卡 32GB HBM2e 显存）
- **架构**：ARM (aarch64)

### 2.2 镜像制作流程（关键步骤）
```bash
# 1. 启动容器
docker run -it --device=/dev/davinci0 ... <基础镜像> /bin/bash

# 2. 安装依赖
pip install einops transformers_stream_generator transformers==4.57.0 \
    optimum accelerate==0.32.1 sentencepiece protobuf six requests peft==0.7.1

# 3. 安装 MindSpeed-MM 和 MindSpeed（解决 mindspeed.fsdp 问题）
git clone --branch 26.0.0 https://gitcode.com/Ascend/MindSpeed-MM.git
git clone --branch 26.0.0_core_r0.12.1 https://gitcode.com/Ascend/MindSpeed.git
cp -r MindSpeed/mindspeed MindSpeed-MM/
cd MindSpeed-MM && pip install -e .

# 4. 安装 Megatron（因为 mindspeed_mm 导入时强依赖）
bash scripts/install.sh --megatron --msid 96bc0a3bf3398bf45ac26e0bded95ee174ac449b

# 5. 保存镜像
docker commit <容器ID> mindspeed-mm:full
docker tag mindspeed-mm:full swr.../ma-test/mindspeed-mm:full
docker push swr.../ma-test/mindspeed-mm:full
```

### 2.3 遇到的关键问题及解决

| 问题 | 解决方案 |
|------|----------|
| **`ModuleNotFoundError: No module named 'mindspeed.fsdp'`** | 不是 pip 包，需要把 MindSpeed 的 `mindspeed/` 目录复制到 MindSpeed-MM，然后 `pip install -e .` |
| **`ModuleNotFoundError: No module named 'megatron'`** | 必须安装 Megatron，因为 `mindspeed_mm/__init__.py` 导入时会触发 `import megatron`，无法绕过 |
| **pip 下载慢/卡住** | 换国内 PyPI 源：`pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple` |
| **离线安装依赖** | 在有网机器下载 `.whl`，打包传到目标机器：`pip install --no-index --find-links=. 包名` |
| **COCO 数据集下载慢** | 用 OpenDataLab 国内镜像站，或 aria2/axel 多线程下载 |


## 三、数据准备

### 3.1 数据集
- **图片**：COCO2017 训练集（`train2017.zip`，约 18GB，118,287 张图片）
- **问答**：LLaVA-Instruct-150K（`llava_instruct_150k.json`，约 15 万条对话）

### 3.2 数据转换
```bash
# 创建软链接（把 OBS 挂载的数据映射到代码目录）
ln -s /home/ma-user/modelarts/inputs/data_url_0 data

# 运行转换脚本
python examples/qwen2vl/llava_instruct_2_mllm_demo_format.py

# 输出：mllm_format_llava_instruct_data.json
```

### 3.3 关键路径（ModelArts 挂载）
| 挂载内容 | OBS 路径 | 容器内路径 |
|----------|---------|-----------|
| 代码 | `s3://ma-test/mm-training/MindSpeed-MM/` | `/workspace/MindSpeed-MM/` |
| 数据集 | `s3://ma-test/qwen3vl/COCO2017/train2017/` | `/home/ma-user/modelarts/inputs/data_url_0/` |
| 预训练权重 | `s3://ma-test/qwen3vl/ckpt/Qwen3-VL-8B-Instruct/` | `/home/ma-user/modelarts/inputs/weight_file_1/` |
| 训练输出 | `s3://ma-test/qwen3vl/output/` | `/home/ma-user/modelarts/outputs/output_url_0/` |


## 四、训练配置

### 4.1 关键 YAML 配置（`qwen3vl_full_sft_8B.yaml`）
```yaml
HF_MODEL_LOAD_PATH: &HF_MODEL_LOAD_PATH /home/ma-user/modelarts/inputs/weight_file_1
MM_MODEL_LOAD_PATH: &MM_MODEL_LOAD_PATH /home/ma-user/modelarts/inputs/weight_file_1

model:
  model_id: qwen3_vl
  model_name_or_path: *HF_MODEL_LOAD_PATH
  mlp_only_layers: []
  freeze:
    - model.visual

training:
  load: /home/ma-user/modelarts/inputs/weight_file_1   # 续训时改为 iter_*
  save: /home/ma-user/modelarts/outputs/output_url_0
  train_iters: 10000
  save_interval: 1000
  bf16: True
  use_distributed_optimizer: True
  global_batch_size: 2
  micro_batch_size: 1
  seq_length: 1024

data:
  basic_parameters:
    dataset_dir: /home/ma-user/modelarts/inputs/data_url_0
    dataset: /home/ma-user/modelarts/inputs/data_url_0/mllm_format_llava_instruct_data.json
```

### 4.2 启动训练
```bash
# 修改脚本中的 NPUS_PER_NODE（根据实际卡数）
sed -i 's/NPUS_PER_NODE=8/NPUS_PER_NODE=2/g' examples/qwen3vl/finetune_qwen3vl_8B.sh

# 启动
bash examples/qwen3vl/finetune_qwen3vl_8B.sh
```

### 4.3 训练状态
- **训练步数**：约 4000 步
- **loss 变化**：从 ~10+ 下降到 ~8
- **注意**：因为没有加载预训练权重（`weight_file_1` 里没有 `.safetensors` 文件），实际是**随机初始化后从头训练**，不是微调


## 五、模型转换与推理

### 5.1 转换 checkpoint 为 HuggingFace 格式
```bash
mm-convert Qwen3VLConverter dcp_to_hf \
  --load_dir /home/ma-user/modelarts/outputs/output_url_0/iter_0004000/ \
  --save_dir /home/ma-user/modelarts/outputs/output_url_0/iter_0004000_hf/ \
  --model_assets_dir /home/ma-user/modelarts/inputs/weight_file_1
```

### 5.2 推理验证
```bash
# 创建测试数据
cat > inference_data.json << 'EOF'
[
  {"image": "/path/to/image.jpg", "text": "这是什么？"}
]
EOF

# 修改推理脚本路径并运行
python examples/qwen3vl/inference_demo.py
```

### 5.3 推理结果（示例）
- 模型能够输出中文/英文回答
- 推理速度约 3-5 token/秒


## 六、部署在线服务（规划）

| 要素 | 要求 |
|------|------|
| **推理镜像** | 需包含 HTTP 服务（Flask/FastAPI），监听 8080 端口 |
| **模型挂载** | 通过 OBS 挂载 HuggingFace 格式权重到容器 |
| **资源池** | 专属资源池，Ascend 规格 |
| **架构** | ARM (aarch64) |


## 七、已保存的镜像信息

| 镜像 | 标签 | 用途 |
|------|------|------|
| `swr.../ma-test/mindspeed-mm` | `full` | 完整训练环境（包含所有依赖） |
| `swr.../ma-test/mm-validation` | `qwen3vl` | 基础训练镜像 |


## 八、常见问题快速索引

| 问题 | 原因 | 解决 |
|------|------|------|
| `No module named 'mindspeed.fsdp'` | 未正确安装 MindSpeed-MM | 复制 mindspeed 目录 + `pip install -e .` |
| `No module named 'megatron'` | 缺少 Megatron | `bash scripts/install.sh --megatron ...` |
| `NPU out of memory` | 显存不足 | 开启 `bf16` + `use_distributed_optimizer` |
| `No usable temporary directory` | 根分区 / 满 | 清理缓存或迁移到 `/cache` |


## 九、关键结论

1. **模型**：`Qwen3-VL-8B-Instruct`，80 亿参数，多模态视觉语言模型
2. **框架**：MindSpeed-MM 26.0.0，基于昇腾 NPU
3. **训练状态**：从随机权重开始，4000 步，loss ~8
4. **环境固化**：已保存完整镜像，新容器可直接使用
5. **下一步**：下载完整预训练权重进行正式微调，或部署在线服务

---

**可以新开会话了，把这份总结发给新会话，并说明你要继续做什么。**