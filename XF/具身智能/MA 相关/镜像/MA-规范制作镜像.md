---
tags:
  - MA
  - MA-文档
---
1. **创建`ma-user`用户**  
    在Dockerfile中添加以下命令，创建UID为1000的用户和组[](https://support.huaweicloud.com/intl/zh-cn/trouble-modelarts/modelarts_trouble_0117_1.html)[](https://support.huaweicloud.com/trouble-modelarts/modelarts_trouble_0117_1.html)：
    
    Dockerfile:
    
    RUN groupadd ma-group -g 1000 && \
        useradd -d /home/ma-user -m -u 1000 -g 1000 -s /bin/bash ma-user
    
2. **设置正确的目录权限**  
    确保`/home/ma-user`目录属主为`ma-user:ma-group`，权限为`750`[](https://doc.hcs.huawei.com/usermanual/modelarts/modelarts_trouble_0118.html#EN-US_TOPIC_0000001967027913__en-us_topic_0000001072729016_table1771312193816)[](https://support.huaweicloud.com/intl/zh-cn/trouble-modelarts/modelarts_trouble_0117_1.html)：
    
    Dockerfile:
    
    RUN chown -R ma-user:ma-group /home/ma-user && \
        chmod 750 /home/ma-user
    
3. **配置Ascend环境**  
    镜像需要包含并正确配置Ascend NPU驱动和工具。建议**基于ModelArts官方提供的Ascend基础镜像进行构建**[](https://support.huaweicloud.com/intl/zh-cn/trouble-modelarts/modelarts_trouble_0117_1.html)[](https://support.huaweicloud.com/trouble-modelarts/modelarts_trouble_0117_1.html)，这能确保所有依赖就绪。自行安装，参考华为云官方文档。
