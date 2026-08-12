# 我的知识库首页

> [!quote] 欢迎来到我的 Obsidian 知识库
> 这是一个由 Dataview、Tasks 和 Activity Graph 驱动的动态仪表盘，所有数据实时更新。

---

## 📊 笔记统计概览

```dataviewjs
const allPages = dv.pages('""');
const totalNotes = allPages.length;

const now = dv.date("now");
const weekAgo = now.minus({days: 7});
const recentNotes = allPages.where(p => p.file.ctime && p.file.ctime >= weekAgo).length;

const allTags = new Set();
allPages.forEach(p => {
    if (p.file.tags) {
        p.file.tags.forEach(t => allTags.add(t));
    }
    if (p.file.etags) {
        p.file.etags.forEach(t => allTags.add(t));
    }
});
const totalTags = allTags.size;

const lastModified = allPages.where(p => p.file.mtime)
    .sort(p => p.file.mtime, "desc")[0];

const stats = [
    ["📝 总笔记数", totalNotes + " 篇"],
    ["📅 本周新建", recentNotes + " 篇"],
    ["🏷️ 总标签数", totalTags + " 个"],
    ["🔄 最近修改", lastModified ? lastModified.file.name : "暂无"]
];

dv.table(["统计项", "数值"], stats);
```

<!-- 需要安装 Dataview 插件并开启 Enable JavaScript Queries 才能显示此区域 -->

---

## 🔥 写作活跃度热力图

```activity-graph
title: 写作热力图
period: 3months
highlightToday: true
highlightColor: #7c3aed
```

<!-- 需要安装 Activity Graph 插件才能显示此区域 -->

> 上述热力图展示最近 90 天的写作活跃度，颜色深浅代表当日修改笔记的数量。点击任意日期可跳转到对应的日记。

---

## 📝 最近修改的笔记

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  dateformat(file.mtime, "yyyy-MM-dd HH:mm") AS "修改时间",
  file.folder AS "所在目录"
FROM ""
SORT file.mtime DESC
LIMIT 10
```

<!-- 需要安装 Dataview 插件才能显示此区域 -->

> 列出最近修改的 10 篇笔记，点击笔记名称可直接跳转。

---

## ✅ 待办任务汇总

```tasks
not done
sort by due
sort by path
show task text
show backlink
show due date
```

<!-- 需要安装 Tasks 插件才能显示此区域 -->

> 汇总全库未完成任务，按截止日期排序。没有截止日期的任务排在最后。
> 若列表为空，说明当前没有未完成的待办事项。

---

## 🔖 快速入口与常用标签

### 📌 常看笔记

```dataview
LIST
FROM #常看 OR #主页入口
SORT file.mtime DESC
```

<!-- 若没有笔记使用 #常看 或 #主页入口 标签，此列表将为空。可给常用笔记添加这两个标签之一 -->

> 标记了 `#常看` 或 `#主页入口` 标签的笔记会出现在此处，方便快速跳转。

### ☁️ 标签云（使用频率 Top 10）

```dataviewjs
const tags = {};
dv.pages().forEach(p => {
    if (p.file.etags) {
        p.file.etags.forEach(t => {
            tags[t] = (tags[t] || 0) + 1;
        });
    }
});

const sorted = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

if (sorted.length === 0) {
    dv.paragraph("*暂无标签数据*");
} else {
    dv.table(["标签", "使用次数"], sorted);
}
```

<!-- 需要安装 Dataview 插件并开启 Enable JavaScript Queries 才能显示此区域 -->

> 展示全库使用频率最高的 10 个标签，帮助快速定位核心知识领域。

---
<!--
  Homepage 配置说明
  ===================
  1. 确保 Homepage 插件已设置主页路径为 HomePage/HomePage.md
  2. 确保 Dataview 插件已启用，且设置中开启 "Enable JavaScript Queries"
  3. 确保 Tasks 插件已启用
  4. 确保 Activity Graph 插件已启用
  5. 所有查询均基于 file.ctime / file.mtime 等内置元数据，无需额外 frontmatter
-->