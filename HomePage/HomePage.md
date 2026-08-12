```dataviewjs
const allPages = dv.pages('""');
const totalNotes = allPages.length;

const now = dv.date("now");
const weekAgo = now.minus({ days: 7 });
const recentNotes = allPages.where(p => p.file.ctime && p.file.ctime >= weekAgo).length;

const allTags = new Set();
allPages.forEach(p => {
    if (p.file.tags) p.file.tags.forEach(t => allTags.add(t));
    if (p.file.etags) p.file.etags.forEach(t => allTags.add(t));
});
const totalTags = allTags.size;

const lastModified = allPages.where(p => p.file.mtime).sort(p => p.file.mtime, "desc")[0];
const lastModName = lastModified ? lastModified.file.name : "暂无";
const lastModShort = lastModName.length > 10 ? lastModName.substring(0, 10) + "…" : lastModName;

dv.container.innerHTML = `
<style>
/* ===== 主页仪表盘全局样式 ===== */
.dv-banner{
  background:linear-gradient(135deg,#667eea 0%,#764ba2 50%,#6b8cce 100%);
  border-radius:20px;padding:40px 30px;text-align:center;
  margin-bottom:24px;position:relative;overflow:hidden;
  box-shadow:0 8px 32px rgba(102,126,234,0.25);
}
.dv-banner::before{
  content:'';position:absolute;top:-50%;left:-50%;
  width:200%;height:200%;
  background:radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 60%);
  animation:dv-shimmer 8s linear infinite;
}
@keyframes dv-shimmer{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.dv-banner h1{
  color:#fff;font-size:2.2em;margin:0 0 8px 0;font-weight:700;
  text-shadow:0 2px 10px rgba(0,0,0,0.2);position:relative;z-index:1;
}
.dv-banner p{
  color:rgba(255,255,255,0.85);font-size:1.05em;margin:0;
  position:relative;z-index:1;
}
.dv-stats-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:8px;
}
.dv-stat-card{
  background:var(--background-secondary);
  backdrop-filter:blur(8px);
  border:1px solid var(--background-modifier-border);
  border-radius:16px;padding:20px;text-align:center;
  transition:transform 0.2s ease,box-shadow 0.2s ease,border-color 0.2s ease;
  position:relative;overflow:hidden;
}
.dv-stat-card::after{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--interactive-accent),transparent);
  opacity:0;transition:opacity 0.2s ease;
}
.dv-stat-card:hover{
  transform:translateY(-4px);
  box-shadow:0 8px 24px rgba(0,0,0,0.12);
  border-color:var(--interactive-accent);
}
.dv-stat-card:hover::after{opacity:1;}
.dv-stat-emoji{font-size:1.8em;margin-bottom:6px;}
.dv-stat-value{font-size:1.6em;font-weight:700;color:var(--text-normal);line-height:1.2;}
.dv-stat-label{font-size:0.85em;color:var(--text-muted);margin-top:4px;}
.dv-note-list{display:flex;flex-direction:column;gap:8px;}
.dv-note-card{
  display:flex;align-items:center;gap:12px;
  background:var(--background-secondary);
  backdrop-filter:blur(6px);
  border:1px solid var(--background-modifier-border);
  border-radius:12px;padding:12px 16px;
  transition:transform 0.15s ease,border-color 0.15s ease,box-shadow 0.15s ease;
}
.dv-note-card:hover{
  transform:translateX(4px);
  border-color:var(--interactive-accent);
  box-shadow:0 4px 12px rgba(0,0,0,0.08);
}
.dv-note-icon{font-size:1.3em;flex-shrink:0;}
.dv-note-info{flex:1;min-width:0;}
.dv-note-title{font-weight:600;color:var(--text-normal);}
.dv-note-title a{color:var(--text-accent);text-decoration:none;}
.dv-note-title a:hover{text-decoration:underline;}
.dv-note-meta{font-size:0.8em;color:var(--text-muted);margin-top:2px;}
.dv-note-time{font-size:0.8em;color:var(--text-muted);white-space:nowrap;}
.dv-tag-cloud{display:flex;flex-wrap:wrap;gap:8px;}
.dv-tag-item{
  display:inline-flex;align-items:center;gap:4px;
  padding:5px 14px;border-radius:20px;
  font-size:0.85em;font-weight:500;
  transition:transform 0.15s ease,box-shadow 0.15s ease;cursor:default;
}
.dv-tag-item:hover{transform:scale(1.08);box-shadow:0 2px 8px rgba(0,0,0,0.1);}
.dv-tag-count{font-size:0.8em;opacity:0.7;font-weight:700;}
@media(max-width:768px){.dv-stats-grid{grid-template-columns:repeat(2,1fr)}}
</style>

<div class="dv-banner">
  <h1>📚 我的知识库</h1>
  <p>「知识是一种快乐，而好奇则是知识的萌芽。」 — 培根</p>
</div>

<div class="dv-stats-grid">
  <div class="dv-stat-card">
    <div class="dv-stat-emoji">📝</div>
    <div class="dv-stat-value">${totalNotes}</div>
    <div class="dv-stat-label">总笔记数</div>
  </div>
  <div class="dv-stat-card">
    <div class="dv-stat-emoji">📅</div>
    <div class="dv-stat-value">${recentNotes}</div>
    <div class="dv-stat-label">本周新建</div>
  </div>
  <div class="dv-stat-card">
    <div class="dv-stat-emoji">🏷️</div>
    <div class="dv-stat-value">${totalTags}</div>
    <div class="dv-stat-label">总标签数</div>
  </div>
  <div class="dv-stat-card">
    <div class="dv-stat-emoji">🔄</div>
    <div class="dv-stat-value" style="font-size:1.15em">${lastModShort}</div>
    <div class="dv-stat-label">最近修改</div>
  </div>
</div>
`;
```

<!-- 需要安装 Dataview 插件并开启 Enable JavaScript Queries -->

> 顶部横幅展示知识库标题与格言，下方四个统计卡片实时反映笔记库整体状态。卡片悬停有上浮动效与顶部高光条。

---

## 🔥 写作热力图

```activity-graph
title: 写作热力图
period: 3months
highlightToday: true
highlightColor: #7c3aed
```

<!-- 需要安装 Activity Graph 插件 -->

> 最近 90 天的写作活跃度，颜色深浅代表当日修改笔记的数量。点击日期可跳转对应日记。

---

## 📝 最近修改的笔记

```dataviewjs
const pages = dv.pages('""')
    .where(p => p.file.mtime)
    .sort(p => p.file.mtime, "desc")
    .limit(10);

let cards = "";
for (const p of pages) {
    const mtime = p.file.mtime;
    const timeStr = (mtime && mtime.toFormat)
        ? mtime.toFormat("yyyy-MM-dd HH:mm")
        : "未知时间";
    const folder = p.file.folder || "/";
    cards += `
    <div class="dv-note-card">
      <span class="dv-note-icon">📄</span>
      <div class="dv-note-info">
        <div class="dv-note-title">
          <a class="internal-link" data-href="${p.file.path}" href="${p.file.path}">${p.file.name}</a>
        </div>
        <div class="dv-note-meta">📁 ${folder}</div>
      </div>
      <span class="dv-note-time">${timeStr}</span>
    </div>`;
}

if (cards === "") {
    dv.paragraph("*暂无笔记数据*");
} else {
    dv.container.innerHTML = `<div class="dv-note-list">${cards}</div>`;
}
```

<!-- 需要安装 Dataview 插件 -->

> 列出最近修改的 10 篇笔记，点击标题可直接跳转。卡片悬停时有右滑动效。

---

## ✅ 待办任务

```tasks
not done
sort by due
sort by path
show task text
show backlink
show due date
```

<!-- 需要安装 Tasks 插件 -->

> 汇总全库未完成任务，按截止日期排序。没有截止日期的任务排在最后。若列表为空，说明当前没有待办事项。

---

## ☁️ 标签云

```dataviewjs
const tags = {};
dv.pages('""').forEach(p => {
    if (p.file.etags) {
        p.file.etags.forEach(t => {
            tags[t] = (tags[t] || 0) + 1;
        });
    }
});

const sorted = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

const palettes = [
    { bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
    { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
    { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
    { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
    { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
    { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)" },
    { bg: "rgba(34,211,238,0.12)", border: "rgba(34,211,238,0.3)" },
    { bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.3)" },
    { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)" },
    { bg: "rgba(132,204,22,0.12)", border: "rgba(132,204,22,0.3)" }
];

let html = '<div class="dv-tag-cloud">';
sorted.forEach(([tag, count], i) => {
    const c = palettes[i % palettes.length];
    html += `<span class="dv-tag-item" style="background:${c.bg};border:1px solid ${c.border};color:var(--text-normal)">${tag} <span class="dv-tag-count">${count}</span></span>`;
});
html += '</div>';

if (sorted.length === 0) {
    dv.paragraph("*暂无标签数据*");
} else {
    dv.container.innerHTML = html;
}
```

<!-- 需要安装 Dataview 插件 -->

> 展示使用频率最高的 10 个标签，不同颜色区分。悬停时标签会微微放大。标签颜色使用半透明 rgba，深色/浅色模式下均可正常显示。

---

<!--
  Homepage 配置说明
  ===================
  1. Homepage 插件已设置主页路径为 HomePage/HomePage.md
  2. Dataview 插件已启用，且开启了 Enable JavaScript Queries
  3. Tasks 插件已启用
  4. Activity Graph 插件已启用
  5. 所有样式使用 Obsidian CSS 变量，自动适配深色/浅色模式
  6. 标签云使用半透明 rgba 背景，在两种模式下均可正常显示
-->