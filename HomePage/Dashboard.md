---
cssclasses: [dashboard]
---

```dataviewjs
// ===== 横幅 + 统计卡片 =====
const hour = new Date().getHours();
let greeting, icon;
if (hour < 6)       { greeting = "夜深了";   icon = "🌙"; }
else if (hour < 9)  { greeting = "早上好";   icon = "🌅"; }
else if (hour < 12) { greeting = "上午好";   icon = "☀️"; }
else if (hour < 14) { greeting = "中午好";   icon = "🌞"; }
else if (hour < 18) { greeting = "下午好";   icon = "🌤️"; }
else if (hour < 22) { greeting = "晚上好";   icon = "🌆"; }
else                { greeting = "夜深了";   icon = "🌙"; }

const banner = dv.container.createEl("div", {cls: "dv-banner"});
banner.createEl("h2", {text: `${icon} ${greeting}，欢迎回来`});
banner.createEl("p", {text: "「知识是一种快乐，而好奇则是知识的萌芽。」 — 培根"});

// 统计数据
const allPages = dv.pages('""');
const totalNotes = allPages.length;
const weekAgo = dv.date("now").minus({days: 7});
const recentNotes = allPages.where(p => p.file.ctime && p.file.ctime >= weekAgo).length;
const allTags = new Set();
allPages.forEach(p => { if (p.file.etags) p.file.etags.forEach(t => allTags.add(t)); });
const totalTags = allTags.size;
const totalTasks = allPages.file.tasks.where(t => !t.completed).length;

const stats = [
  ["📝", totalNotes,  "总笔记数", false],
  ["📅", recentNotes, "本周新建", false],
  ["🏷️", totalTags,   "标签数",   false],
  ["✅", totalTasks,  "待办任务", true]
];
const grid = dv.container.createEl("div", {cls: "dv-stats"});
for (const [emoji, value, label, accent] of stats) {
  const card = grid.createEl("div", {cls: accent ? "dv-stat-card dv-stat-accent" : "dv-stat-card"});
  card.createEl("div", {cls: "dv-stat-emoji", text: emoji});
  card.createEl("div", {cls: "dv-stat-value", text: String(value)});
  card.createEl("div", {cls: "dv-stat-label", text: label});
}
```

```activity-graph
title: 写作热力图
period: 3months
highlightToday: true
highlightColor: #7c3aed
```

```dataviewjs
// ===== 最近修改的笔记 =====
dv.container.classList.add("dv-card");
dv.el("div", "📝 最近修改的笔记", {cls: "dv-card-title"});
const pages = dv.pages('""')
  .where(p => p.file.mtime)
  .sort(p => p.file.mtime, "desc")
  .limit(10);
if (pages.length === 0) {
  dv.el("p", "暂无笔记数据", {cls: "dv-empty"});
} else {
  dv.table(["笔记", "修改时间", "所在目录"],
    pages.map(p => [
      p.file.link,
      p.file.mtime ? p.file.mtime.toFormat("yyyy-MM-dd HH:mm") : "未知",
      p.file.folder || "/"
    ])
  );
}
```

```dataviewjs
// ===== 待办任务 =====
dv.container.classList.add("dv-card");
dv.el("div", "✅ 待办任务", {cls: "dv-card-title"});
const tasks = dv.pages('""').file.tasks
  .where(t => !t.completed)
  .sort(t => t.due, "desc")
  .limit(15);
if (tasks.length === 0) {
  dv.el("p", "🎉 暂无待办任务", {cls: "dv-empty"});
} else {
  dv.taskList(tasks, false);
}
```

```dataviewjs
// ===== 标签云 Top 10 =====
dv.container.classList.add("dv-card");
dv.el("div", "☁️ 标签云 Top 10", {cls: "dv-card-title"});
const tags = {};
dv.pages('""').forEach(p => {
  if (p.file.etags) p.file.etags.forEach(t => { tags[t] = (tags[t] || 0) + 1; });
});
const sorted = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 10);
const palettes = [
  ["rgba(124,58,237,0.12)", "rgba(124,58,237,0.3)"],
  ["rgba(59,130,246,0.12)",  "rgba(59,130,246,0.3)"],
  ["rgba(16,185,129,0.12)",  "rgba(16,185,129,0.3)"],
  ["rgba(245,158,11,0.12)",  "rgba(245,158,11,0.3)"],
  ["rgba(239,68,68,0.12)",   "rgba(239,68,68,0.3)"],
  ["rgba(168,85,247,0.12)",  "rgba(168,85,247,0.3)"],
  ["rgba(34,211,238,0.12)",  "rgba(34,211,238,0.3)"],
  ["rgba(244,114,182,0.12)", "rgba(244,114,182,0.3)"],
  ["rgba(99,102,241,0.12)",  "rgba(99,102,241,0.3)"],
  ["rgba(132,204,22,0.12)",  "rgba(132,204,22,0.3)"]
];
if (sorted.length === 0) {
  dv.el("p", "暂无标签数据", {cls: "dv-empty"});
} else {
  const cloud = dv.container.createEl("div", {cls: "dv-tag-cloud"});
  sorted.forEach(([tag, count], i) => {
    const [bg, border] = palettes[i % palettes.length];
    const item = cloud.createEl("span", {cls: "dv-tag-item"});
    item.style.background = bg;
    item.style.border = `1px solid ${border}`;
    item.style.color = "var(--text-normal)";
    item.appendText(tag + " ");
    item.createEl("span", {cls: "dv-tag-count", text: String(count)});
  });
}
```

```dataviewjs
// ===== 快速入口 =====
const navData = [
  { title: "🧠 具身智能", links: [
    ["MA 相关",   "XF/具身智能/MA 相关"],
    ["MRS 相关",  "XF/具身智能/MRS 相关"],
    ["PI0 训练",  "XF/具身智能/MA 相关/PI0-Train"],
    ["交付文档",  "XF/具身智能/MA 相关/交付文档"]
  ]},
  { title: "💡 个人项目", links: [
    ["IDEA",        "IDEA"],
    ["Plan 项目",   "IDEA/Plan"],
    ["今天吃什么",  "IDEA/瑗/今天吃什么-APP"]
  ]},
  { title: "📚 资源", links: [
    ["模板库",       "Templates"],
    ["Dataview 组件", "Dataview"],
    ["Copilot",     "copilot"],
    ["MD 语法",     "MD Help"]
  ]}
];
const navRow = dv.container.createEl("div", {cls: "dv-nav-row"});
for (const card of navData) {
  const navCard = navRow.createEl("div", {cls: "dv-nav-card"});
  navCard.createEl("div", {cls: "dv-nav-title", text: card.title});
  const list = navCard.createEl("ul", {cls: "dv-nav-list"});
  for (const [text, path] of card.links) {
    const li = list.createEl("li");
    const a = li.createEl("a", {text: text});
    a.setAttribute("data-href", path);
    a.href = "#";
    a.addEventListener("click", e => {
      e.preventDefault();
      app.workspace.openLinkText(path, "", false);
    });
  }
}
```

<!--
  Dashboard 配置说明
  ===================
  1. 在 Homepage 插件设置中，将主页路径改为 HomePage/Dashboard.md
  2. 确保 Dataview 插件已启用 Enable JavaScript Queries
  3. 确保 Activity Graph 插件已启用
  4. CSS 样式文件位于 .obsidian/snippets/dashboard.css
     请在 设置 → 外观 → CSS 代码片段 中启用 dashboard
  5. 所有样式使用 Obsidian CSS 变量，自动适配深色/浅色模式
-->