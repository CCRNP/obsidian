---
cssclasses:
  - dashboard-page
---

```dataviewjs
// ===== 数据准备 =====
const allPages = dv.pages('""');
const now = new Date();
const excludePrefixes = ["Templates", "copilot", ".obsidian", "MD Help"];

// HTML 转义
function esc(str) {
    const d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
}

// 本地日期格式化
function fmtDate(d) {
    return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
}

// 统计数据
const totalNotes = allPages.length;
const weekAgoMs = now.getTime() - 7 * 86400000;
const monthAgoMs = now.getTime() - 30 * 86400000;
const recentWeek = allPages.where(p => p.file.ctime && p.file.ctime.ts >= weekAgoMs).length;
const recentMonth = allPages.where(p => p.file.ctime && p.file.ctime.ts >= monthAgoMs).length;

// 标签统计
const tagMap = {};
allPages.forEach(p => {
    if (p.file.etags) p.file.etags.forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; });
});
const topTags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
const totalTags = Object.keys(tagMap).length;

// 目录统计
const folderMap = {};
allPages.forEach(p => {
    const f = (p.file.folder || "/").split("/")[0] || "根目录";
    folderMap[f] = (folderMap[f] || 0) + 1;
});
const topFolders = Object.entries(folderMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

// 待办任务（排除模板文件）
const tasks = [];
allPages
    .where(p => !excludePrefixes.some(pre => p.file.path.startsWith(pre)))
    .forEach(p => {
        p.file.tasks.where(t => !t.completed).forEach(t => {
            tasks.push({
                text: t.text.replace(/\[#.*?\]/g, "").replace(/\[.*?\]/g, "").replace(/^##/, "").trim(),
                name: p.file.name,
                path: p.file.path,
                due: t.due
            });
        });
    });
tasks.sort((a, b) => {
    if (a.due && b.due) return a.due < b.due ? -1 : (a.due > b.due ? 1 : 0);
    if (a.due) return -1;
    if (b.due) return 1;
    return 0;
});

// 热力图数据（最近7周，纯CSS实现，不依赖插件）
const modDates = {};
allPages.where(p => p.file.mtime).forEach(p => {
    const d = p.file.mtime.toFormat("yyyy-MM-dd");
    modDates[d] = (modDates[d] || 0) + 1;
});

const todayDay = now.getDay();
const daysSinceMonday = todayDay === 0 ? 6 : todayDay - 1;
const startMonday = new Date(now);
startMonday.setDate(now.getDate() - daysSinceMonday - 6 * 7);

const heatCells = [];
for (let i = 0; i < 49; i++) {
    const d = new Date(startMonday);
    d.setDate(startMonday.getDate() + i);
    const dStr = fmtDate(d);
    const count = modDates[dStr] || 0;
    let lv = 0;
    if (count >= 10) lv = 5;
    else if (count >= 5) lv = 4;
    else if (count >= 3) lv = 3;
    else if (count >= 2) lv = 2;
    else if (count >= 1) lv = 1;
    heatCells.push({ dStr, count, lv });
}

// 日历数据
const calYear = now.getFullYear();
const calMonth = now.getMonth();
const calToday = now.getDate();
const monthNames = ["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"];
const weekdayShort = ["周一","周二","周三","周四","周五","周六","周日"];
const firstDayOfMonth = new Date(calYear, calMonth, 1);
let firstWeekday = firstDayOfMonth.getDay() - 1;
if (firstWeekday < 0) firstWeekday = 6;
const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
const prevMonthLastDay = new Date(calYear, calMonth, 0).getDate();
const todayWeekday = weekdayShort[(firstWeekday + calToday - 1) % 7];

const calCells = [];
for (let i = firstWeekday; i > 0; i--) {
    calCells.push({ day: prevMonthLastDay - i + 1, other: true });
}
for (let i = 1; i <= daysInMonth; i++) {
    calCells.push({ day: i, other: false, today: i === calToday });
}
let nextDay = 1;
while (calCells.length % 7 !== 0) {
    calCells.push({ day: nextDay++, other: true });
}

// ===== HTML 生成 =====
const dateStr = calYear + '年' + String(calMonth + 1).padStart(2, '0') + '月' + String(calToday).padStart(2, '0') + '日';

// 概览三列
const overviewHtml = '<div class="overview">' +
    '<div class="overview-col"><div class="col-title">📈 笔记统计</div><div class="col-body">' +
    '<div class="item"><span class="tag">总数</span><span class="value">' + totalNotes + ' 篇</span></div>' +
    '<div class="item"><span class="tag">本周</span><span class="value">' + recentWeek + ' 篇</span></div>' +
    '<div class="item"><span class="tag">本月</span><span class="value">' + recentMonth + ' 篇</span></div>' +
    '<div class="item"><span class="tag">标签</span><span class="value">' + totalTags + ' 个</span></div>' +
    '<div class="item"><span class="tag">待办</span><span class="value">' + tasks.length + ' 项</span></div>' +
    '</div></div>' +
    '<div class="overview-col"><div class="col-title">📁 目录分布</div><div class="col-body">' +
    topFolders.map(function(f) { return '<div class="item"><span class="tag">' + esc(f[0]) + '</span><span class="value">' + f[1] + ' 篇</span></div>'; }).join('') +
    '</div></div>' +
    '<div class="overview-col"><div class="col-title">🏷️ 热门标签</div><div class="col-body">' +
    (topTags.length > 0
        ? topTags.map(function(t) { return '<div class="item"><span class="tag">' + esc(t[0]) + '</span><span class="value">' + t[1] + ' 次</span></div>'; }).join('')
        : '<div class="item"><span class="value muted">暂无标签</span></div>') +
    '</div></div>' +
    '</div>';

// 任务列表
var taskItems = tasks.slice(0, 10).map(function(t) {
    var dueStr = t.due ? '📅 ' + (t.due.toFormat ? t.due.toFormat('MM-dd') : '') : '';
    return '<div class="task-item">' +
        '<span class="check">☐</span>' +
        '<span class="task-text">' + esc(t.text) + '</span>' +
        '<span class="task-source" data-href="' + esc(t.path) + '">📁 ' + esc(t.name) + '</span>' +
        '<span class="task-meta">' + dueStr + '</span>' +
        '</div>';
}).join('');

var taskHtml = '<div class="task-list"><div class="task-title">📋 待办任务</div>' +
    (taskItems || '<div class="task-item"><span class="task-text" style="color:#7a9a7a">🎉 暂无待办任务</span></div>') +
    '</div>';

// 元数据
var metaHtml = '<div class="metadata"><span class="meta-label">🏷️ 热门标签</span><div class="tags">' +
    (topTags.map(function(t) { return '<span>' + esc(t[0]) + '</span>'; }).join('') || '<span>暂无</span>') +
    '</div></div>';

// 热力图
var heatGrid = heatCells.map(function(c) {
    return '<span class="cell' + (c.lv > 0 ? ' lv' + c.lv : '') + '" title="' + c.dStr + ': ' + c.count + ' 篇"></span>';
}).join('');

var heatHtml = '<div class="heatmap"><div class="hm-title">🔥 写作热力图（最近 7 周）</div>' +
    '<div class="heatmap-grid">' + heatGrid + '</div>' +
    '<div class="heatmap-legend"><span>少</span><div class="legend-squares">' +
    '<span></span><span class="lv1"></span><span class="lv2"></span><span class="lv3"></span><span class="lv4"></span><span class="lv5"></span>' +
    '</div><span>多</span></div></div>';

// 日历
var calGrid = calCells.map(function(c) {
    return '<span class="day' + (c.other ? ' other' : '') + (c.today ? ' today' : '') + '">' + c.day + '</span>';
}).join('');

var calHtml = '<div class="calendar-card">' +
    '<div class="calendar-header"><div class="month-year">' + calYear + '年' + monthNames[calMonth] + ' <small>· ' + todayWeekday + '</small></div></div>' +
    '<div class="calendar-header weekdays">' +
    ['一','二','三','四','五','六','日'].map(function(w) { return '<span>' + w + '</span>'; }).join('') +
    '</div>' +
    '<div class="calendar-grid">' + calGrid + '</div>' +
    '</div>';

// 快捷信息
var infoHtml = '<div class="info-compact">' +
    '<div class="compact-row"><span class="label">🧭 导航</span>' +
    '<span class="compact-chip" data-href="XF/具身智能">🧠 具身智能</span>' +
    '<span class="compact-chip" data-href="IDEA">💡 IDEA</span>' +
    '<span class="compact-chip" data-href="Templates">📚 模板</span>' +
    '<span class="compact-chip" data-href="Dataview">📊 Dataview</span>' +
    '</div>' +
    '<div class="compact-row"><span class="label">⚡ 快捷</span>' +
    '<span class="compact-chip" data-href="XF">📁 XF 工作</span>' +
    '<span class="compact-chip" data-href="copilot">🤖 Copilot</span>' +
    '<span class="compact-chip" data-href="MD Help">📖 MD 语法</span>' +
    '</div>' +
    '<div class="compact-row"><span class="label">✅ 今日</span>' +
    '<span class="compact-chip">📋 ' + tasks.length + ' 项待办</span>' +
    '<span class="compact-chip">📝 ' + recentWeek + ' 篇本周</span>' +
    '</div>' +
    '</div>';

// ===== 组装渲染 =====
dv.container.innerHTML =
    '<div class="rainbow-home">' +
    '<div class="main-content">' +
    '<div class="date-nav">' +
    '<span class="nav-btn">◀ 前一天</span>' +
    '<span class="current-date">' + dateStr + '</span>' +
    '<span class="nav-btn">后一天 ▶</span>' +
    '</div>' +
    overviewHtml +
    taskHtml +
    metaHtml +
    heatHtml +
    '</div>' +
    '<div class="right-panel">' +
    calHtml +
    infoHtml +
    '</div>' +
    '</div>';

// ===== 事件绑定 =====
dv.container.querySelectorAll('[data-href]').forEach(function(el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function(e) {
        e.preventDefault();
        app.workspace.openLinkText(el.getAttribute('data-href'), '', false);
    });
});
```

<!--
  Dashboard 配置说明
  ===================
  1. Homepage 插件设置 → 主页文件改为 HomePage/Dashboard.md
  2. Dataview 插件已启用 Enable JavaScript Queries
  3. CSS 样式位于 .obsidian/snippets/dashboard.css
     设置 → 外观 → CSS 代码片段 → 启用 dashboard
  4. 热力图为纯 CSS 实现，不需要 Activity Graph 插件
  5. 待办任务已排除 Templates、copilot、MD Help 目录
  6. 所有数据实时从笔记库读取，自动更新
-->