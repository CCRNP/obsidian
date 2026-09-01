---
tags:
  - MA-训练
---


FROM swr.cn-south-1.myhuaweicloud.com/ascendhub/mindspeed-mm:26.0.0-910b-openeuler24.03-py3.11-aarch64

WORKDIR /home/ma-user

USER root


# ===== 一、系统工具 =====
RUN yum install -y git

# ===== 二、安装 Python 依赖 =====
# 先升级 pip
RUN /opt/conda/bin/pip install --upgrade pip setuptools wheel

# 安装所有依赖
RUN /opt/conda/bin/pip install --no-cache-dir \
    einops \
    transformers_stream_generator \
    transformers==4.57.0 \
    optimum \
    accelerate==0.32.1 \
    sentencepiece \
    protobuf \
    six \
    requests \
    peft==0.7.1

# ===== 三、安装 MindSpeed + MindSpeed-MM =====
RUN git clone --branch 26.0.0 https://gitcode.com/Ascend/MindSpeed-MM.git /home/ma-user/MindSpeed-MM && \
    git clone --branch 26.0.0_core_r0.12.1 https://gitcode.com/Ascend/MindSpeed.git /home/ma-user/MindSpeed && \
    cp -r /home/ma-user/MindSpeed/mindspeed /home/ma-user/MindSpeed-MM/ && \
    cd /home/ma-user/MindSpeed-MM && \
    /opt/conda/bin/pip install -e . --no-cache-dir && \
    python -c "import mindspeed.fsdp; print('✅ mindspeed.fsdp 导入成功')"

# ===== 四、设置环境变量 =====
ENV PYTHONPATH=/home/ma-user/MindSpeed-MM:$PYTHONPATH
ENV TMPDIR=/cache/tmp

CMD ["/bin/bash"]