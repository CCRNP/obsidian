---
tags:
  - MA
  - 日志
  - 告警
---


![[MA日志告警处理-ICAgent状态.png]]

![[MA日志告警处理-Agent管理状态.png]]

### 原因：

license 不足，导致 monitor 数据会频繁重发阻塞导致发送通道阻塞，影响 icagent 阻塞无法发现容器日志


### 解决方法：
	icAgent 探测日志下发的任务备阻塞了，重启 icAgent 进程恢复。



[root@os-node-created-c9tjc ICAgent]# crictl ps | grep icagent


```
[opsadmin@os-node-created-c9tjc ~]$ su -
Password:
Last login: Mon May 11 16:21:09 CST 2026 on pts/1
[root@os-node-created-c9tjc ~]# ps -aux | grep icagent
root      582018  5.6  0.0 7867656 140452 ?      Sl   5月07 303:01 /opt/oss/servicemgr/ICAgent/bin/manual/icagent -DNFW=icagent
root     1082096  0.0  0.0  21872  1884 pts/1    S+   16:41   0:00 grep --color=auto icagent
[root@os-node-created-c9tjc ~]#
[root@os-node-created-c9tjc ~]#
[root@os-node-created-c9tjc ~]# kill -9 582018
[root@os-node-created-c9tjc ~]# cd /var/ICAgent/
[root@os-node-created-c9tjc ICAgent]# tail -F oss.icAgent.trace

```
