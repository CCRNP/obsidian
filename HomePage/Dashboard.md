---
cssclasses:
  - homepage
---

```dataviewjs
// ===== 数据准备 =====
var allPages = dv.pages('""');
var now = new Date();
var excludePrefixes = ["Templates", "copilot", ".obsidian", "MD Help"];

function esc(s) { var d = document.createElement('div'); d.textContent = String(s || ''); return d.innerHTML; }

// 统计
<<<<<<< HEAD
const totalNotes = allPages.length;
const weekAgoMs = now.getTime() - 7 * 86400000;
const recentWeek = allPages.where(p => p.file.ctime && p.file.ctime.ts >= weekAgoMs).length;
=======
var totalNotes = allPages.length;
var weekAgoMs = now.getTime() - 7 * 86400000;
var recentWeek = allPages.where(function(p) { return p.file.ctime && p.file.ctime.ts >= weekAgoMs; }).length;
>>>>>>> origin/main

// 标签
var tagMap = {};
allPages.forEach(function(p) { if (p.file.etags) p.file.etags.forEach(function(t) { tagMap[t] = (tagMap[t] || 0) + 1; }); });
var topTags = Object.entries(tagMap).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
var totalTags = Object.keys(tagMap).length;

// 目录
var folderMap = {};
allPages.forEach(function(p) { var f = (p.file.folder || "/").split("/")[0] || "根目录"; folderMap[f] = (folderMap[f] || 0) + 1; });
var topFolders = Object.entries(folderMap).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);

// 最近修改的笔记（5条）
var recentNotes = allPages
    .where(function(p) { return p.file.mtime && !excludePrefixes.some(function(pre) { return p.file.path.startsWith(pre); }); })
    .sort(function(p) { return p.file.mtime; }, "desc")
    .limit(5)
    .array();

// 日历数据
var calYear = now.getFullYear();
var calMonth = now.getMonth();
var calToday = now.getDate();
var monthNames = ["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"];
var firstWeekday = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
var prevMonthLastDay = new Date(calYear, calMonth, 0).getDate();
var weekdayNames = ["一","二","三","四","五","六","日"];
var todayIdx = (firstWeekday + calToday - 1) % 7;
var todayWeekday = "周" + weekdayNames[todayIdx];
var calCells = [];
for (var i = firstWeekday; i > 0; i--) calCells.push({ day: prevMonthLastDay - i + 1, other: true, mmdd: '' });
for (var i = 1; i <= daysInMonth; i++) {
    var mmdd = String(calMonth + 1).padStart(2, '0') + '-' + String(i).padStart(2, '0');
    calCells.push({ day: i, other: false, today: i === calToday, mmdd: mmdd });
}
var nd = 1; while (calCells.length % 7 !== 0) calCells.push({ day: nd++, other: true, mmdd: '' });

// 中国节日和节气
var holidays = {
    '01-01': '元旦', '02-17': '春节', '03-03': '元宵',
    '04-05': '清明', '05-01': '劳动节', '06-19': '端午',
    '08-19': '七夕', '09-25': '中秋', '10-01': '国庆', '10-19': '重阳'
};
var solarTerms = {
    '01-05': '小寒', '01-20': '大寒', '02-04': '立春', '02-18': '雨水',
    '03-05': '惊蛰', '03-20': '春分', '04-05': '清明', '04-20': '谷雨',
    '05-05': '立夏', '05-21': '小满', '06-05': '芒种', '06-21': '夏至',
    '07-07': '小暑', '07-22': '大暑', '08-07': '立秋', '08-23': '处暑',
    '09-07': '白露', '09-23': '秋分', '10-08': '寒露', '10-23': '霜降',
    '11-07': '立冬', '11-22': '小雪', '12-07': '大雪', '12-22': '冬至'
};

// Banner 图片每日轮换
var bannerImages = [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=80',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&q=80',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1400&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1400&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1400&q=80'
];
var dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
var bannerUrl = bannerImages[dayOfYear % bannerImages.length];

// 导航数据（指向实际存在的文件）
var navData = [
    { icon: "🧠", text: "具身智能", path: "XF/具身智能" },
    { icon: "💡", text: "IDEA", path: "IDEA" },
    { icon: "📁", text: "XF 工作", path: "XF" },
    { icon: "📚", text: "模板库", path: "Templates" },
    { icon: "📊", text: "Dataview", path: "Dataview" },
    { icon: "🤖", text: "Copilot", path: "copilot" },
    { icon: "📖", text: "MD 语法", path: "MD Help" },
    { icon: "🏠", text: "HomePage", path: "HomePage" }
];

// ===== HTML 构建 =====
var dateStr = calYear + '年' + String(calMonth + 1).padStart(2, '0') + '月' + String(calToday).padStart(2, '0') + '日';

// 概览
var overviewHtml = '<div class="rh-overview">' +
    '<div class="rh-overview-col"><div class="col-title">📈 笔记统计</div><div class="col-body">' +
    '<div class="item"><span class="tag">总数</span><span class="value">' + totalNotes + ' 篇</span></div>' +
    '<div class="item"><span class="tag">本周</span><span class="value">' + recentWeek + ' 篇</span></div>' +
    '<div class="item"><span class="tag">标签</span><span class="value">' + totalTags + ' 个</span></div>' +
    '</div></div>' +
    '<div class="rh-overview-col"><div class="col-title">📁 目录分布</div><div class="col-body">' +
    topFolders.map(function(f) { return '<div class="item"><span class="tag">' + esc(f[0]) + '</span><span class="value">' + f[1] + ' 篇</span></div>'; }).join('') +
    '</div></div>' +
    '<div class="rh-overview-col"><div class="col-title">🏷️ 热门标签</div><div class="col-body">' +
    (topTags.length > 0
        ? topTags.map(function(t) { return '<div class="item"><span class="tag">' + esc(t[0]) + '</span><span class="value">' + t[1] + ' 次</span></div>'; }).join('')
        : '<div class="item"><span class="value">暂无标签</span></div>') +
    '</div></div>' +
    '</div>';

// 导航
var navHtml = '<div class="rh-card"><div class="rh-card-title">🧭 导航入口</div><div class="rh-nav-grid">' +
    navData.map(function(n) {
        return '<div class="rh-nav-item" data-nav="' + esc(n.path) + '">' +
            '<span class="rh-nav-icon">' + n.icon + '</span>' +
            '<span class="rh-nav-text">' + esc(n.text) + '</span></div>';
    }).join('') +
    '</div></div>';

// 最近修改
var rnHtml = '<div class="rh-card"><div class="rh-card-title">📝 最近修改</div>' +
    (recentNotes.length > 0
        ? recentNotes.map(function(p) {
            var mtime = p.file.mtime;
            var timeStr = mtime ? (mtime.toFormat ? mtime.toFormat('MM-dd HH:mm') : '') : '未知';
            return '<div class="rh-rn-item">' +
                '<span class="rn-icon">📄</span>' +
                '<span class="rn-name" data-nav="' + esc(p.file.path) + '">' + esc(p.file.name) + '</span>' +
                '<span class="rn-folder">' + esc(p.file.folder || '/') + '</span>' +
                '<span class="rn-time">' + timeStr + '</span></div>';
        }).join('')
        : '<div class="rh-rn-item"><span class="rn-name">暂无笔记</span></div>') +
    '</div>';

// 日历
var calGridHtml = calCells.map(function(c) {
    var holiday = c.mmdd ? holidays[c.mmdd] : '';
    var term = c.mmdd ? solarTerms[c.mmdd] : '';
    var cls = 'day' + (c.other ? ' other' : '') + (c.today ? ' today' : '');
    var html = '<span class="' + cls + '">' + c.day;
    if (holiday) html += '<span class="holiday">' + holiday + '</span>';
    else if (term) html += '<span class="term">' + term + '</span>';
    html += '</span>';
    return html;
}).join('');

var calHtml = '<div class="rh-calendar">' +
    '<div class="rh-cal-header"><div class="month-year">' + calYear + '年' + monthNames[calMonth] + ' <small>· ' + todayWeekday + '</small></div></div>' +
    '<div class="rh-cal-weekdays">' +
    ['一','二','三','四','五','六','日'].map(function(w) { return '<span>' + w + '</span>'; }).join('') +
    '</div><div class="rh-cal-grid">' + calGridHtml + '</div></div>';

// 任务和热力图插槽
var tasksSlotHtml = '<div class="rh-card"><div class="rh-card-title">✅ 待办任务</div><div id="tasks-slot"><div class="rh-loading">正在加载任务...</div></div></div>';
var heatmapSlotHtml = '<div class="rh-card"><div class="rh-card-title">🔥 写作热力图</div><div id="heatmap-slot"><div class="rh-loading">正在加载热力图...</div></div></div>';

// ===== 组装渲染 =====
dv.container.innerHTML =
    '<div class="rh-banner" style="background-image: url(\'' + bannerUrl + '\'); background-size: cover; background-position: center;">' +
    '<div class="rh-banner-content">' +
    '<h1>📚 CCRNP 个人知识库</h1>' +
    '<p class="rh-banner-desc">技术笔记 · 项目记录 · 学习成长 · 构建个人知识体系</p>' +
    '<div class="rh-quote"><span id="rh-quote-text">正在获取每日一言...</span><span id="rh-quote-author"></span></div>' +
    '</div></div>' +
    '<div class="rh-grid">' +
    '<div class="rh-left">' + overviewHtml + navHtml + rnHtml + '</div>' +
    '<div class="rh-right">' + calHtml + tasksSlotHtml + heatmapSlotHtml + '</div>' +
    '</div>';

// ===== 获取每日一言（Hitokoto API）=====
fetch('https://v1.hitokoto.cn/?c=i')
    .then(function(r) { return r.json(); })
    .then(function(data) {
        var qt = dv.container.querySelector('#rh-quote-text');
        var qa = dv.container.querySelector('#rh-quote-author');
        if (qt) qt.textContent = data.hitokoto;
        if (qa) qa.textContent = '— ' + (data.from || '佚名');
    })
    .catch(function() {
        var qt = dv.container.querySelector('#rh-quote-text');
        var qa = dv.container.querySelector('#rh-quote-author');
        if (qt) qt.textContent = '学而不思则罔，思而不学则殆。';
        if (qa) qa.textContent = '— 孔子';
    });

// ===== 导航：检查文件存在性，不创建新文件 =====
function findFirstMd(folder) {
    for (var i = 0; i < folder.children.length; i++) {
        var child = folder.children[i];
        if (child.extension === 'md') return child;
        if (child.children) { var f = findFirstMd(child); if (f) return f; }
    }
    return null;
}

function navigateTo(path) {
    var file = app.vault.getAbstractFileByPath(path);
    if (file && !file.children) {
        app.workspace.getLeaf().openFile(file);
    } else if (file && file.children) {
        var firstMd = findFirstMd(file);
        if (firstMd) { app.workspace.getLeaf().openFile(firstMd); }
    } else {
        var resolved = app.metadataCache.getFirstLinkpathDest(path, '');
        if (resolved) { app.workspace.getLeaf().openFile(resolved); }
    }
}

dv.container.querySelectorAll('[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(el.getAttribute('data-nav'));
    });
});

// ===== 移动 Tasks 和 Activity Graph 到插槽 =====
function tryMove(selector, targetId) {
    var root = dv.container.closest('.markdown-preview-section') || dv.container.parentElement;
    if (!root) return false;
    var el = root.querySelector(selector + ':not(.rh-moved)');
    var target = dv.container.querySelector('#' + targetId);
    if (el && target) {
        target.innerHTML = '';
        target.appendChild(el);
        el.classList.add('rh-moved');
        return true;
    }
    return false;
}

var moveAttempts = 0;
var moveInterval = setInterval(function() {
    var t = tryMove('.block-language-tasks', 'tasks-slot');
    var h = tryMove('.block-language-activity-graph', 'heatmap-slot');
    if ((t && h) || ++moveAttempts > 50) clearInterval(moveInterval);
}, 200);
```

```tasks
not done
path excludes Templates
path excludes copilot
path excludes MD Help
sort by due
sort by path
limit 15
```

```activity-graph
daysToShow: 60
showLegend: false
colorGradient: green
```

<!--
  Dashboard 配置说明
  ===================
  1. Homepage 插件 → 主页文件设为 HomePage/Dashboard.md
  2. Dataview 插件 → 开启 Enable JavaScript Queries
  3. CSS 样式 → .obsidian/snippets/dashboard.css → 设置→外观→CSS 代码片段→启用 dashboard
  4. Activity Graph 插件 → 已启用（60天，绿色，无图例）
  5. Tasks 插件 → 已启用（排除 Templates/copilot/MD Help）
  6. 每日一言 → 从 Hitokoto API 实时获取诗词名言
  7. Banner 图片 → 7张知识主题图片每日轮换
  8. 日历 → 显示中国节日和二十四节气
  9. 导航 → 点击跳转已存在文件，不创建新文件
  10. 待办任务 → Tasks 插件原生渲染，可勾选，点击链接跳转源文件
-->