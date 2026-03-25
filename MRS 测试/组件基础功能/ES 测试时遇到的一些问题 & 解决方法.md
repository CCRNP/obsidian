
1. 安装客户端
	参考文档：MapReduce Service 3.6.0-ESL-产品文档
![[Pasted image 20260325210005.png]]

可选远端安装，选自动部署，部署目录就按测试的文档来

安装的目录 按 测试 文档来（测试文档中安装目录位 hadoopclient)

![[Pasted image 20260325210128.png|579]]

2. curl 报错
	curl -XPUT --negotiate -k -u: "https://10.1.46.44:24147/my_index-1" curl: (1) Received HTTP/0.9 when not allowed
	在 MRS 管理面的 ES 集群 配置下 把  SERVER_PORT_REMOTE_ENABLED 的值 设为 true
	![[Pasted image 20260325211330.png]]


