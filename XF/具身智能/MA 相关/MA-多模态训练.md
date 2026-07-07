---
tags:
  - MA
  - MA-训练
---


### 推送到 SWR

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


### 2. 配置参数

#### 修改 `qwen3vl_30B_config_v1.yaml`

data:
  preprocess_parameters:
    # 权重路径：挂载到 data_1 的 Qwen3-VL-8B-Thinking
    model_name_or_path:  /home/ma-user/modelarts/inputs/weight_file_1
    
  basic_parameters:
    # 数据集根目录：指向软链接 data 指向的位置
    dataset_dir: /home/ma-user/modelarts/inputs/data_url_0
    # 数据集描述文件：就是之前转换生成的 JSON
    dataset: /home/ma-user/modelarts/inputs/data_url_0/mllm_format_llava_instruct_data.json




/opt/conda/lib/python3.11/site-packages/transformers/__init__.py

25e9ce9dbb48d