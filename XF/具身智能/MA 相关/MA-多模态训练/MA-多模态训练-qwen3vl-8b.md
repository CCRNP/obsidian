---
tags:
  - MA
  - MA-训练
---
#### 保存为新镜像
docker commit a0b789629a66 mindspeed-mm:full

#### 打标签并推送到 SWR

[root@cbh-app ccr]# docker tag new-mindspeed-mm swr.gdrising-global-1.air.gdrising.com.cn/ma-test/mm-validation:qwen3vl
[root@cbh-app ccr]# docker push swr.gdrising-global-1.air.gdrising.com.cn/ma-test/mm-validation:qwen3vl


### Q

权重文件路径：/data/workspace/foo/Qwen3-VL-8B-Thinking

数据集路径：/data/workspace/foo/data/


#### 启动命令

挂起容器：
cd /home/ma-user/modelarts/user-job-dir/MindSpeed-MM && tail -f /dev/null

cd /home/ma-user/modelarts/user-job-dir/MindSpeed-MM && bash examples/qwen3vl/finetune_qwen3vl_30B_v1.sh

**sleep** 启动失败：**不识别 `--data_url`、`--data`、`--output_url` 这些参数**
- 改输入参数 **获取方式** 为：**环境变量**

#### 软链接
 1. 先删除现有的 data 目录
rm -rf data

2. 重新创建软链接
ln -s /home/ma-user/modelarts/inputs/data_url_0 data

3. 验证
ls -la data/llava_instruct_150k.json

### 2. 配置参数

#### 修改 qwen3vl_full_sft_8B.yaml

路径：examples/qwen3vl/qwen3vl_full_sft_8B.yaml


data:
  preprocess_parameters:
    # 权重路径：挂载到 data_1 的 Qwen3-VL-8B-Thinking
    model_name_or_path:  /home/ma-user/modelarts/inputs/weight_file_1
    
  basic_parameters:
    # 数据集根目录：指向软链接 data 指向的位置
    dataset_dir: /home/ma-user/modelarts/inputs/data_url_0
    # 数据集描述文件：就是之前转换生成的 JSON
    dataset: /home/ma-user/modelarts/inputs/data_url_0/mllm_format_llava_instruct_data.json

输出路径：
  save: /home/ma-user/modelarts/outputs/output_url_0


权重文件命名有误，修改
cd /home/ma-user/modelarts/inputs/weight_file_1
##### 如果有 config (1).json，重命名为 config.json
if [ -f "config (1).json" ]; then mv "config (1).json" config.json; fi
##### 同样处理其他文件
for f in *" (1)"*; do
    [ -f "$f" ] && mv "$f" "$(echo "$f" | sed 's/ (1)//g')"
done

#### 打包 site-packages

版本号（transformers 4.45.0，torch 2.7.1，torch_npu 2.7.1）

补全缺失：
app虚拟机 打包
cd /tmp
tar -czf numpy_pandas_fix.tar.gz numpy_pandas_fix/

scp 传输：
app->跳板机
(py311) [root@cbh-app tmp]# scp numpy_pandas_fix.tar.gz opsadmin@10.3.4.48:/tmp/ccr/
跳板机->910b
scp numpy_pandas_fix.tar.gz opsadmin@100.64.101.86:/tmp/

传到 910B 的 /tmp/

[root@os-node-created-c9tjc ~]# cat /tmp/py311_packages.tar.gz | crictl exec -i c5126a2c81f60 sh -c 'cat > /tmp/py311_packages.tar.gz'
进入容器内解压
cd /tmp
tar -xzf py311_packages.tar.gz -C /opt/conda/lib/python3.11/


cat /tmp/xx.tar.gz | crictl exec -i c5126a2c81f60 sh -c 'cat > /tmp/xx.tar.gz'


### 训练ing

训练过程中的**性能监控日志**，每一行代表一个 **iteration（迭代步骤）** 的状态。

---

#### 📊 日志字段详解

以这一行为例：

```
[2026-07-09 06:41:38] iteration 148/10000 | consumed samples: 592 | elapsed time per iteration (ms): 1292.8 | learning rate: 1.470000E-06 | global batch size: 4 | tokens per sample: 1.695000E+02 | loss: 8.218778E+00 | loss scale: 1.0 | grad norm: 19.432 | num zeros: 0.0 | number of skipped iterations: 0 | number of nan iterations: 0
```

| 字段                                  | 含义                         | 当前值示例              |
| ----------------------------------- | -------------------------- | ------------------ |
| **iteration 148/10000**             | 当前是第 148 步，总共 10000 步      | 进度 1.48%           |
| **consumed samples: 592**           | 已经处理了 592 个样本              | 592                |
| **elapsed time per iteration (ms)** | 每步耗时（毫秒）                   | 1292.8ms ≈ 1.3 秒/步 |
| **learning rate**                   | 当前学习率（按 cosine 衰减，逐渐上升中）   | 1.47e-06           |
| **global batch size: 4**            | 全局批次大小（4 张卡 × 每卡 1 样本）     | 4                  |
| **tokens per sample**               | 每个样本的平均 token 数（序列长度）      | ~170-237 tokens    |
| **loss: 8.218778E+00**              | 当前损失值（越高表示模型预测越差）          | 8.22（在下降中）         |
| **loss scale: 1.0**                 | 损失缩放因子（用于混合精度训练，1.0 表示未缩放） | 1.0                |
| **grad norm: 19.432**               | 梯度范数（监控梯度爆炸/消失，正常范围 1~100） | 19.43              |
| **num zeros: 0.0**                  | 梯度中零的比例（用于诊断优化器问题）         | 0%                 |
| **skipped iterations: 0**           | 跳过的迭代数（因 loss 爆炸等情况）       | 0（健康）              |
| **nan iterations: 0**               | 出现 NaN 的迭代数（训练异常的标志）       | 0（健康）              |

---

#### ✅ 当前训练状态评估

| 指标 | 当前状态 | 判断 |
|------|---------|------|
| loss 趋势 | 8.9 → 8.2（在下降） | ✅ 正常，模型在学习 |
| nan iterations | 0 | ✅ 无数值异常，训练稳定 |
| grad norm | 10~19 | ✅ 正常范围 |
| 每步耗时 | ~1.3 秒 | ✅ 4 卡 8B 模型，速度合理 |

---

#### 📈 loss 在下降吗？

从日志看：
- iteration 148: loss = **8.22**
- iteration 149: loss = **8.50**
- iteration 150: loss = **8.93**
- iteration 151: loss = **8.86**

**看起来有波动但整体还比较高，属于训练初期正常现象**。随着训练继续，loss 应该会逐步下降。

---

#### 🚀 后续关注

1. **loss 持续下降**：如果降到 1~2 左右，说明模型学得不错
2. **grad norm 不要爆炸**：如果突然飙升到 1000+，说明梯度爆炸，需要调整学习率或 clip_grad
3. **nan iterations 保持 0**：如果出现 >0，说明训练出了数值问题



## 启动推理

### 权重转换：

mm-convert Qwen3VLConverter dcp_to_hf \
  --load_dir /home/ma-user/modelarts/outputs/output_url_0/iter_0004000/ \
  --save_dir /home/ma-user/modelarts/outputs/output_url_0/iter_0004000_hf/ \
  --model_assets_dir /home/ma-user/modelarts/inputs/weight_file_1 \
  --to_bf16 False

### 创建简单推理数据文件

1. 确认数据集中存在的图片
`ls /home/ma-user/modelarts/inputs/data_url_0/COCO2017/train2017/ | head -n 5`

2. 创建推理数据文件
``` json
cat > /workspace/MindSpeed-MM/inference_data.json << 'EOF'
[
  {
    "image": "/home/ma-user/modelarts/inputs/data_url_0/COCO2017/train2017/000000033471.jpg",
    "text": "What are the colors of the bus in the image?"
  },
  {
    "image": "/home/ma-user/modelarts/inputs/data_url_0/COCO2017/train2017/000000033471.jpg",
    "text": "Is the bus driving down the street or pulled off to the side?"
  }
]
EOF
```

3. 修改 **examples/qwen3vl/inference_demo.py** 脚本的 **DATA_JSON_PATH**
``` json
sed -i 's|DATA_JSON_PATH = .*|DATA_JSON_PATH = "/workspace/MindSpeed-MM/inference_data.json"|' examples/qwen3vl/inference_demo.py

sed -i '1iMAX_NEW_TOKENS = 128' examples/qwen3vl/inference_demo.py
```


if __name__ == "__main__":
    # Configuration parameters
    #MODEL_PATH = "./ckpt/Qwen3-VL-30B-A3B-Instruct"  # Model directory path
    #DATA_JSON_PATH = "/workspace/MindSpeed-MM/inference_data.json"
    #MAX_NEW_TOKENS = 1000  # Maximum number of new tokens to generate
    MODEL_PATH = "/home/ma-user/modelarts/outputs/output_url_0/iter_0004000_hf/"
    MODEL_TYPE = "qwen3_vl"
    DATA_JSON_PATH = "/workspace/MindSpeed-MM/inference_data.json"


4. 执行推理
``` json
python examples/qwen3vl/inference_demo.py
```
