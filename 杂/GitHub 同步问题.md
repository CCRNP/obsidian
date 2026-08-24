---
tags:
  - git
---

```shell
# 获取远程最新代码，不合并 
git fetch --all 
# 强制重置本地分支到远程对应分支，以 main 分支举例 
git reset --hard origin/main 
# 清理本地新增未跟踪文件/文件夹（可选） 
git clean -fd
```

commit-and-sync 等同于如下命令：
	git add .
	git commit -m "你的提交信息"
	git pull && git push

