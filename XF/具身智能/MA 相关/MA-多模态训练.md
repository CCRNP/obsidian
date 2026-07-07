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

