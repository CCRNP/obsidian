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

// 待办任务：排除模板文件和 copilot 文件
const excludePrefixes = ["Templates", "copilot", ".obsidian", "MD Help"];
const realTaskCount = allPages
  .where(p => !excludePrefixes.some(pre => p.file.path.startsWith(pre)))
  .file.tasks
  .where(t => !t.completed)
  .length;

const stats = [
  ["📝", totalNotes,    "总笔记数", false],
  ["📅", recentNotes,   "本周新建", false],
  ["🏷️", totalTags,     "标签数",   false],
  ["✅", realTaskCount, "待办任务", true]
];
const grid = dv.container.createEl("div", {cls: "dv-stats"});
for (const [emoji, value, label, accent] of stats) {
  const card = grid.createEl("div", {cls: accent ? "dv-stat-card dv-stat-accent" : "dv-stat-card"});
  card.createEl("div", {cls: "dv-stat-emoji", text: emoji});
  card.createEl("div", {cls: "dv-stat-value", text: String(value)});
  card.createEl("div", {cls: "dv-stat-label", text: label});
}
```

```dataviewjs
// ===== 左右双栏：最近笔记 + 待办任务 =====
const row = dv.container.createEl("div", {cls: "dv-two-col"});

// ---- 左栏：最近修改的笔记 ----
const leftCard = row.createEl("div", {cls: "dv-card"});
leftCard.createEl("div", {cls: "dv-card-title", text: "📝 最近修改的笔记"});

const recentPages = dv.pages('""')
  .where(p => p.file.mtime && !excludePrefixes.some(pre => p.file.path.startsWith(pre)))
  .sort(p => p.file.mtime, "desc")
  .limit(10);

if (recentPages.length === 0) {
  leftCard.createEl("p", {cls: "dv-empty", text: "暂无笔记数据"});
} else {
  const table = leftCard.createEl("table");
  const thead = table.createEl("thead");
  const headRow = thead.createEl("tr");
  headRow.createEl("th", {text: "笔记"});
  headRow.createEl("th", {text: "修改时间"});
  headRow.createEl("th", {text: "目录"});
  const tbody = table.createEl("tbody");
  for (const p of recentPages) {
    const tr = tbody.createEl("tr");
    const td1 = tr.createEl("td");
    const a = td1.createEl("a", {text: p.file.name, cls: "internal-link"});
    a.setAttribute("data-href", p.file.path);
    a.href = "#";
    a.addEventListener("click", e => {
      e.preventDefault();
      app.workspace.openLinkText(p.file.path, "", false);
    });
    tr.createEl("td", {text: p.file.mtime ? p.file.mtime.toFormat("MM-dd HH:mm") : "未知"});
    tr.createEl("td", {text: p.file.folder || "/"});
  }
}

// ---- 右栏：待办任务（排除模板） ----
const rightCard = row.createEl("div", {cls: "dv-card"});
rightCard.createEl("div", {cls: "dv-card-title", text: "✅ 待办任务"});

const taskItems = [];
dv.pages('""')
  .where(p => !excludePrefixes.some(pre => p.file.path.startsWith(pre)))
  .forEach(p => {
    p.file.tasks.where(t => !t.completed).forEach(t => {
      taskItems.push({
        text: t.text.replace(/\[.*?\]/g, "").trim(),
        path: p.file.path,
        name: p.file.name,
        mtime: p.file.mtime
      });
    });
  });

taskItems.sort((a, b) => {
  if (a.mtime && b.mtime) return b.mtime - a.mtime;
  return 0;
});
const displayTasks = taskItems.slice(0, 15);

if (displayTasks.length === 0) {
  rightCard.createEl("p", {cls: "dv-empty", text: "🎉 暂无待办任务"});
} else {
  const ul = rightCard.createEl("ul", {cls: "dv-task-list"});
  for (const t of displayTasks) {
    const li = ul.createEl("li", {cls: "dv-task-item"});
    li.createEl("div", {cls: "dv-task-text", text: "☐ " + t.text});
    const source = li.createEl("div", {cls: "dv-task-source"});
    source.appendText("📁 ");
    const a = source.createEl("a", {text: t.name});
    a.setAttribute("data-href", t.path);
    a.href = "#";
    a.addEventListener("click", e => {
      e.preventDefault();
      app.workspace.openLinkText(t.path, "", false);
    });
  }
}
```

```activity-graph
``` 

```dataviewjs
// ===== 左右双栏：标签云 + 快速入口 =====
const row2 = dv.container.createEl("div", {cls: "dv-two-col-even"});

// ---- 左栏：标签云 ----
const tagCard = row2.createEl("div", {cls: "dv-card"});
tagCard.createEl("div", {cls: "dv-card-title", text: "☁️ 标签云 Top 10"});

const tags = {};
dv.pages('""').forEach(p => {
  if (p.file.etags) p.file.etags.forEach(t => { tags[t] = (tags[t] || 0) + 1; });
});
const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 10);

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

if (sortedTags.length === 0) {
  tagCard.createEl("p", {cls: "dv-empty", text: "暂无标签数据"});
} else {
  const cloud = tagCard.createEl("div", {cls: "dv-tag-cloud"});
  sortedTags.forEach(([tag, count], i) => {
    const [bg, border] = palettes[i % palettes.length];
    const item = cloud.createEl("span", {cls: "dv-tag-item"});
    item.style.background = bg;
    item.style.border = `1px solid ${border}`;
    item.style.color = "var(--text-normal)";
    item.appendText(tag + " ");
    item.createEl("span", {cls: "dv-tag-count", text: String(count)});
  });
}

// ---- 右栏：快速入口 ----
const navCard = row2.createEl("div", {cls: "dv-card"});
navCard.createEl("div", {cls: "dv-card-title", text: "🧭 快速入口"});

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
    ["模板库",        "Templates"],
    ["Dataview 组件", "Dataview"],
    ["Copilot",      "copilot"],
    ["MD 语法",      "MD Help"]
  ]}
];

const navGrid = navCard.createEl("div", {cls: "dv-nav-grid"});
for (const card of navData) {
  const navItem = navGrid.createEl("div", {cls: "dv-nav-card"});
  navItem.createEl("div", {cls: "dv-nav-title", text: card.title});
  const list = navItem.createEl("ul", {cls: "dv-nav-list"});
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
  5. 热力图需要在此页处于「阅读视图」时才能渲染
     Homepage 插件设置中建议开启 Open in reading view
  6. 待办任务已排除 Templates、copilot、MD Help 目录中的模板任务
  7. 所有样式使用 Obsidian CSS 变量，自动适配深色/浅色模式
-->