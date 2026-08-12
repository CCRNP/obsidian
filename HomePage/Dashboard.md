---
cssclasses:
  - homepage
---

```dataviewjs
// ===== 数据准备 =====
const allPages = dv.pages('""');
const now = new Date();
const excludePrefixes = ["Templates", "copilot", ".obsidian", "MD Help"];

function esc(s) { const d = document.createElement('div'); d.textContent = String(s || ''); return d.innerHTML; }

// 统计
const totalNotes = allPages.length;
const weekAgoMs = now.getTime() - 7 * 86400000;
const recentWeek = allPages.where(p => p.file.ctime && p.file.ctime.ts >= weekAgoMs).length;

// 标签
const tagMap = {};
allPages.forEach(p => { if (p.file.etags) p.file.etags.forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; }); });
const topTags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

// 目录
const folderMap = {};
allPages.forEach(p => { const f = (p.file.folder || "/").split("/")[0] || "根目录"; folderMap[f] = (folderMap[f] || 0) + 1; });
const topFolders = Object.entries(folderMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

// 待办任务（排除模板）
const tasks = [];
allPages
    .where(p => !excludePrefixes.some(pre => p.file.path.startsWith(pre)))
    .forEach(p => {
        p.file.tasks.where(t => !t.completed).forEach(t => {
            tasks.push({
                text: t.text.replace(/\[#.*?\]/g, "").replace(/\[.*?\]/g, "").replace(/^##/, "").trim(),
                name: p.file.name, path: p.file.path, due: t.due
            });
        });
    });
tasks.sort((a, b) => {
    if (a.due && b.due) return a.due < b.due ? -1 : (a.due > b.due ? 1 : 0);
    if (a.due) return -1; if (b.due) return 1; return 0;
});

// 最近修改的笔记（5条）
const recentNotes = allPages
    .where(p => p.file.mtime && !excludePrefixes.some(pre => p.file.path.startsWith(pre)))
    .sort(p => p.file.mtime, "desc")
    .limit(5)
    .array();

// 日历数据
const calYear = now.getFullYear();
const calMonth = now.getMonth();
const calToday = now.getDate();
const monthNames = ["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"];
const firstWeekday = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
const prevMonthLastDay = new Date(calYear, calMonth, 0).getDate();
const weekdayNames = ["一","二","三","四","五","六","日"];
const todayIdx = (firstWeekday + calToday - 1) % 7;
const todayWeekday = "周" + weekdayNames[todayIdx];
const calCells = [];
for (let i = firstWeekday; i > 0; i--) calCells.push({ day: prevMonthLastDay - i + 1, other: true });
for (let i = 1; i <= daysInMonth; i++) calCells.push({ day: i, other: false, today: i === calToday });
let nd = 1; while (calCells.length % 7 !== 0) calCells.push({ day: nd++, other: true });

// 每日名言（31条，按天轮换）
const quotes = [
    { text: "知识是一种快乐，而好奇则是知识的萌芽。", author: "培根" },
    { text: "学而不思则罔，思而不学则殆。", author: "孔子" },
    { text: "纸上得来终觉浅，绝知此事要躬行。", author: "陆游" },
    { text: "业精于勤，荒于嬉；行成于思，毁于随。", author: "韩愈" },
    { text: "三人行，必有我师焉。", author: "孔子" },
    { text: "读书破万卷，下笔如有神。", author: "杜甫" },
    { text: "问渠那得清如许，为有源头活水来。", author: "朱熹" },
    { text: "知之者不如好之者，好之者不如乐之者。", author: "孔子" },
    { text: "千里之行，始于足下。", author: "老子" },
    { text: "不积跬步，无以至千里。", author: "荀子" },
    { text: "书山有路勤为径，学海无涯苦作舟。", author: "韩愈" },
    { text: "读万卷书，行万里路。", author: "刘彝" },
    { text: "博学之，审问之，慎思之，明辨之，笃行之。", author: "礼记" },
    { text: "吾生也有涯，而知也无涯。", author: "庄子" },
    { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原" },
    { text: "锲而舍之，朽木不折；锲而不舍，金石可镂。", author: "荀子" },
    { text: "黑发不知勤学早，白首方悔读书迟。", author: "颜真卿" },
    { text: "敏而好学，不耻下问。", author: "孔子" },
    { text: "温故而知新，可以为师矣。", author: "孔子" },
    { text: "学如逆水行舟，不进则退。", author: "古语" },
    { text: "腹有诗书气自华。", author: "苏轼" },
    { text: "读书百遍，其义自见。", author: "陈寿" },
    { text: "立身以立学为先，立学以读书为本。", author: "欧阳修" },
    { text: "书犹药也，善读之可以医愚。", author: "刘向" },
    { text: "莫等闲，白了少年头，空悲切。", author: "岳飞" },
    { text: "少壮不努力，老大徒伤悲。", author: "汉乐府" },
    { text: "宝剑锋从磨砺出，梅花香自苦寒来。", author: "古语" },
    { text: "会当凌绝顶，一览众山小。", author: "杜甫" },
    { text: "欲穷千里目，更上一层楼。", author: "王之涣" },
    { text: "长风破浪会有时，直挂云帆济沧海。", author: "李白" },
    { text: "不畏浮云遮望眼，自缘身在最高层。", author: "王安石" }
];
const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
const todayQuote = quotes[dayOfYear % quotes.length];

// ===== HTML 构建 =====
const dateStr = calYear + '年' + String(calMonth + 1).padStart(2, '0') + '月' + String(calToday).padStart(2, '0') + '日';

// 概览三列
const overviewHtml = '<div class="rh-overview">' +
    '<div class="rh-overview-col"><div class="col-title">📈 笔记统计</div><div class="col-body">' +
    '<div class="item"><span class="tag">总数</span><span class="value">' + totalNotes + ' 篇</span></div>' +
    '<div class="item"><span class="tag">本周</span><span class="value">' + recentWeek + ' 篇</span></div>' +
    '<div class="item"><span class="tag">标签</span><span class="value">' + Object.keys(tagMap).length + ' 个</span></div>' +
    '<div class="item"><span class="tag">待办</span><span class="value">' + tasks.length + ' 项</span></div>' +
    '</div></div>' +
    '<div class="rh-overview-col"><div class="col-title">📁 目录分布</div><div class="col-body">' +
    topFolders.map(function(f) { return '<div class="item"><span class="tag">' + esc(f[0]) + '</span><span class="value">' + f[1] + ' 篇</span></div>'; }).join('') +
    '</div></div>' +
    '<div class="rh-overview-col"><div class="col-title">🏷️ 热门标签</div><div class="col-body">' +
    (topTags.length > 0
        ? topTags.map(function(t) { return '<div class="item"><span class="tag">' + esc(t[0]) + '</span><span class="value">' + t[1] + ' 次</span></div>'; }).join('')
        : '<div class="item"><span class="value muted">暂无标签</span></div>') +
    '</div></div>' +
    '</div>';

// 任务列表
const taskItems = tasks.slice(0, 10).map(function(t) {
    var dueStr = t.due ? '📅 ' + (t.due.toFormat ? t.due.toFormat('MM-dd') : '') : '';
    return '<div class="rh-task-item">' +
        '<span class="check">☐</span>' +
        '<span class="task-text">' + esc(t.text) + '</span>' +
        '<span class="task-source" data-href="' + esc(t.path) + '">📁 ' + esc(t.name) + '</span>' +
        '<span class="task-meta">' + dueStr + '</span>' +
        '</div>';
}).join('');
const taskHtml = '<div class="rh-card"><div class="rh-card-title">📋 待办任务</div>' +
    (taskItems || '<div class="rh-task-item"><span class="task-text" style="color:var(--text-muted)">🎉 暂无待办任务</span></div>') +
    '</div>';

// 最近修改笔记
const rnItems = recentNotes.map(function(p) {
    var mtime = p.file.mtime;
    var timeStr = mtime ? (mtime.toFormat ? mtime.toFormat('MM-dd HH:mm') : '') : '未知';
    return '<div class="rh-rn-item">' +
        '<span class="rn-icon">📄</span>' +
        '<span class="rn-name" data-href="' + esc(p.file.path) + '">' + esc(p.file.name) + '</span>' +
        '<span class="rn-folder">' + esc(p.file.folder || '/') + '</span>' +
        '<span class="rn-time">' + timeStr + '</span>' +
        '</div>';
}).join('');
const rnHtml = '<div class="rh-card"><div class="rh-card-title">📝 最近修改</div>' +
    (rnItems || '<div class="rh-rn-item"><span class="rn-name" style="color:var(--text-muted)">暂无笔记</span></div>') +
    '</div>';

// 日历
const calGrid = calCells.map(function(c) {
    return '<span class="day' + (c.other ? ' other' : '') + (c.today ? ' today' : '') + '">' + c.day + '</span>';
}).join('');
const calHtml = '<div class="rh-calendar">' +
    '<div class="rh-cal-header"><div class="month-year">' + calYear + '年' + monthNames[calMonth] + ' <small>· ' + todayWeekday + '</small></div></div>' +
    '<div class="rh-cal-weekdays">' +
    ['一','二','三','四','五','六','日'].map(function(w) { return '<span>' + w + '</span>'; }).join('') +
    '</div><div class="rh-cal-grid">' + calGrid + '</div></div>';

// 快捷信息
const infoHtml = '<div class="rh-info">' +
    '<div class="rh-info-row"><span class="label">🧭 导航</span>' +
    '<span class="rh-chip" data-href="XF/具身智能">🧠 具身智能</span>' +
    '<span class="rh-chip" data-href="IDEA">💡 IDEA</span>' +
    '<span class="rh-chip" data-href="Templates">📚 模板</span>' +
    '<span class="rh-chip" data-href="Dataview">📊 Dataview</span>' +
    '</div>' +
    '<div class="rh-info-row"><span class="label">⚡ 快捷</span>' +
    '<span class="rh-chip" data-href="XF">📁 XF 工作</span>' +
    '<span class="rh-chip" data-href="copilot">🤖 Copilot</span>' +
    '<span class="rh-chip" data-href="MD Help">📖 MD 语法</span>' +
    '</div>' +
    '<div class="rh-info-row"><span class="label">✅ 今日</span>' +
    '<span class="rh-chip">📋 ' + tasks.length + ' 项待办</span>' +
    '<span class="rh-chip">📝 ' + recentWeek + ' 篇本周</span>' +
    '</div></div>';

// 热力图插槽
const heatmapHtml = '<div class="rh-card"><div class="rh-card-title">🔥 写作热力图</div>' +
    '<div id="heatmap-slot"><div class="hm-loading">正在加载 Activity Graph…</div></div></div>';

// ===== 组装渲染 =====
dv.container.innerHTML =
    '<div class="rh-container">' +
    // Banner
    '<div class="rh-banner"><div class="rh-banner-content">' +
    '<h1>📚 CCRNP 知识库</h1>' +
    '<p class="rh-banner-desc">记录具身智能探索之路 · 沉淀技术成长 · 构建第二大脑</p>' +
    '<div class="rh-quote"><span class="rh-quote-text">"' + esc(todayQuote.text) + '"</span>' +
    '<span class="rh-quote-author">— ' + esc(todayQuote.author) + '</span></div>' +
    '</div></div>' +
    // Main grid
    '<div class="rh-grid">' +
    '<div class="rh-left">' + overviewHtml + taskHtml + rnHtml + '</div>' +
    '<div class="rh-right">' + calHtml + infoHtml + heatmapHtml + '</div>' +
    '</div></div>';

// ===== 事件绑定 =====
dv.container.querySelectorAll('[data-href]').forEach(function(el) {
    el.addEventListener('click', function(e) {
        e.preventDefault();
        app.workspace.openLinkText(el.getAttribute('data-href'), '', false);
    });
});

// ===== 移动 Activity Graph 到右下角插槽 =====
function moveHeatmap() {
    var ag = document.querySelector('.homepage .block-language-activity-graph');
    var slot = dv.container.querySelector('#heatmap-slot');
    if (ag && slot) {
        slot.innerHTML = '';
        slot.appendChild(ag);
        return true;
    }
    return false;
}
var attempts = 0;
var tryMove = setInterval(function() {
    if (moveHeatmap() || ++attempts > 30) clearInterval(tryMove);
}, 200);
```

```activity-graph
daysToShow: 60
showLegend: false
colorGradient: green
```

<!--
  Dashboard 配置说明
  ===================
  1. Homepage 插件设置 → 主页文件改为 HomePage/Dashboard.md
  2. Dataview 插件已启用 Enable JavaScript Queries
  3. CSS 样式位于 .obsidian/snippets/dashboard.css
     设置 → 外观 → CSS 代码片段 → 启用 dashboard
  4. Activity Graph 插件已启用，使用 60 天紧凑模式
  5. 待办任务已排除 Templates、copilot、MD Help 目录
  6. Banner 背景图来自 Unsplash，如离线则显示渐变色
  7. 每日名言按天轮换，共 31 条
  8. 页面宽度自适应，取消 Obsidian 默认行宽限制
-->