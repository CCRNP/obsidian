---
cssclasses:
  - dashboard
---

```dataviewjs
var allPages = dv.pages('""');
var now = new Date();
var excludePrefixes = ["Templates", "copilot", ".obsidian", "MD Help"];

function esc(s) { var d = document.createElement('div'); d.textContent = String(s || ''); return d.innerHTML; }

var totalNotes = allPages.length;
var weekAgoMs = now.getTime() - 7 * 86400000;
var recentWeek = allPages.where(function(p) { return p.file.ctime && p.file.ctime.ts >= weekAgoMs; }).length;

var tagMap = {};
allPages.forEach(function(p) { if (p.file.etags) p.file.etags.forEach(function(t) { tagMap[t] = (tagMap[t] || 0) + 1; }); });
var topTags = Object.entries(tagMap).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
var totalTags = Object.keys(tagMap).length;

var folderMap = {};
allPages.forEach(function(p) { var f = (p.file.folder || "/").split("/")[0] || "根目录"; folderMap[f] = (folderMap[f] || 0) + 1; });
var topFolders = Object.entries(folderMap).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);

var recentNotes = allPages
    .where(function(p) { return p.file.mtime && !excludePrefixes.some(function(pre) { return p.file.path.startsWith(pre); }); })
    .sort(function(p) { return p.file.mtime; }, "desc")
    .limit(5)
    .array();

var tasks = [];
allPages
    .where(function(p) { return !excludePrefixes.some(function(pre) { return p.file.path.startsWith(pre); }); })
    .forEach(function(p) {
        p.file.tasks.where(function(t) { return !t.completed; }).forEach(function(t) {
            var cleanText = t.text.replace(/\[#.*?\]/g, '').replace(/\[.*?::.*?\]/g, '').replace(/📅\s*\d{4}-\d{2}-\d{2}/g, '').replace(/✅\s*\d{4}-\d{2}-\d{2}/g, '').replace(/^##\s*/, '').trim();
            var dueStr = '';
            if (t.due) { try { dueStr = t.due.toFormat ? t.due.toFormat('MM-dd') : ''; } catch(e) {} }
            tasks.push({ text: cleanText, path: p.file.path, line: t.line, due: dueStr, name: p.file.name });
        });
    });
tasks.sort(function(a, b) { if (a.due && b.due) return a.due < b.due ? -1 : (a.due > b.due ? 1 : 0); if (a.due) return -1; if (b.due) return 1; return 0; });

var bannerImages = [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1400&q=80',
    'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=1400&q=80',
    'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=1400&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1400&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80'
];
var dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
var bannerUrl = bannerImages[dayOfYear % bannerImages.length];

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

// ===== 构建主内容 =====
var overviewHtml = '<div class="rh-overview">' +
    '<div class="rh-overview-col"><div class="col-title">📊 STATS</div><div class="col-body">' +
    '<div class="item"><span class="tag">TOTAL</span><span class="value">' + totalNotes + '</span></div>' +
    '<div class="item"><span class="tag">WEEK</span><span class="value">' + recentWeek + '</span></div>' +
    '<div class="item"><span class="tag">TAGS</span><span class="value">' + totalTags + '</span></div>' +
    '</div></div>' +
    '<div class="rh-overview-col"><div class="col-title">📁 FOLDERS</div><div class="col-body">' +
    topFolders.map(function(f) { return '<div class="item"><span class="tag">' + esc(f[0]) + '</span><span class="value">' + f[1] + '</span></div>'; }).join('') +
    '</div></div>' +
    '<div class="rh-overview-col"><div class="col-title">🏷️ TAGS</div><div class="col-body">' +
    (topTags.length > 0 ? topTags.map(function(t) { return '<div class="item"><span class="tag">' + esc(t[0]) + '</span><span class="value">' + t[1] + '</span></div>'; }).join('') : '<div class="item"><span class="value">--</span></div>') +
    '</div></div></div>';

var navHtml = '<div class="rh-card"><div class="rh-card-title">NAV</div><div class="rh-nav-grid">' +
    navData.map(function(n) { return '<div class="rh-nav-item" data-nav="' + esc(n.path) + '"><span class="rh-nav-icon">' + n.icon + '</span><span class="rh-nav-text">' + esc(n.text) + '</span></div>'; }).join('') +
    '</div></div>';

var rnHtml = '<div class="rh-card"><div class="rh-card-title">RECENT</div>' +
    (recentNotes.length > 0 ? recentNotes.map(function(p) {
        var mtime = p.file.mtime; var timeStr = mtime ? (mtime.toFormat ? mtime.toFormat('MM-dd HH:mm') : '') : '???';
        return '<div class="rh-rn-item"><span class="rn-icon">▣</span><span class="rn-name" data-nav="' + esc(p.file.path) + '">' + esc(p.file.name) + '</span><span class="rn-folder">' + esc(p.file.folder || '/') + '</span><span class="rn-time">' + timeStr + '</span></div>';
    }).join('') : '<div class="rh-rn-item"><span class="rn-name">NO DATA</span></div>') +
    '</div>';

var tasksHtml = '<div class="rh-card"><div class="rh-card-title">QUESTS</div><div id="rh-tasks-list"></div></div>';

// ===== 渲染主结构（不包含按钮）=====
dv.container.innerHTML =
    '<div class="rh-banner" style="background-image: url(\'' + bannerUrl + '\'); background-size: cover; background-position: center; background-repeat: no-repeat;">' +
    '<div class="rh-banner-content">' +
    '<h1>CCRNP KB</h1>' +
    '<p class="rh-banner-desc">&gt; Knowledge Base / 技术笔记 / 项目记录 / 学习成长</p>' +
    '<div class="rh-quote"><span id="rh-quote-text">LOADING...</span><span id="rh-quote-author"></span></div>' +
    '</div></div>' +
    '<div class="rh-grid"><div class="rh-left">' + overviewHtml + navHtml + rnHtml + '</div><div class="rh-right">' + tasksHtml + '</div></div>';

// ===== 浮动主题按钮 — appendChild 到 body，position:fixed =====
// 先检查是否已存在（避免重复创建）
var existingBtn = document.getElementById('rh-theme-btn');
if (existingBtn) existingBtn.remove();

var themeBtn = document.createElement('div');
themeBtn.className = 'rh-theme-toggle';
themeBtn.id = 'rh-theme-btn';
themeBtn.textContent = '☀ DARK';
themeBtn.title = '切换深色/浅色主题';
document.body.appendChild(themeBtn);

// ===== 主题切换逻辑 =====
function getDashboardEl() {
    return document.querySelector('.markdown-preview-view.dashboard') ||
           document.querySelector('.markdown-preview-pusher.dashboard') ||
           document.querySelector('.dashboard');
}

function applyTheme(theme) {
    var el = getDashboardEl();
    if (el) {
        if (theme === 'light') { el.setAttribute('data-theme', 'light'); }
        else { el.removeAttribute('data-theme'); }
    }
    var btn = document.getElementById('rh-theme-btn');
    if (btn) { btn.textContent = (theme === 'light') ? '☾ LIGHT' : '☀ DARK'; }
}

var savedTheme = localStorage.getItem('rh-dashboard-theme') || 'dark';
applyTheme(savedTheme);

themeBtn.addEventListener('click', function(e) {
    e.preventDefault(); e.stopPropagation();
    var current = localStorage.getItem('rh-dashboard-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('rh-dashboard-theme', next);
    applyTheme(next);
});

// 页面切换时清理按钮
dv.container.addEventListener('DOMNodeRemovedFromDocument', function() {
    var btn = document.getElementById('rh-theme-btn');
    if (btn) btn.remove();
});

// ===== 填充待办任务 =====
var tasksList = dv.container.querySelector('#rh-tasks-list');
if (tasks.length === 0) {
    tasksList.innerHTML = '<div style="padding:12px;color:#58a6ff;font-family:VT323,monospace;font-size:1.1em">★ NO QUESTS ACTIVE</div>';
} else {
    tasks.slice(0, 15).forEach(function(t, i) {
        var item = document.createElement('div');
        item.className = 'rh-task-item';
        var checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.dataset.idx = i;
        var textSpan = document.createElement('span'); textSpan.className = 'task-text'; textSpan.textContent = t.text;
        var linkSpan = document.createElement('span'); linkSpan.className = 'task-link'; linkSpan.textContent = '▶ ' + t.name; linkSpan.dataset.path = t.path;
        var dueSpan = document.createElement('span'); dueSpan.className = 'task-due'; dueSpan.textContent = t.due ? '◆ ' + t.due : '';
        item.appendChild(checkbox); item.appendChild(textSpan);
        if (t.due) item.appendChild(dueSpan); item.appendChild(linkSpan);
        tasksList.appendChild(item);
    });
    tasksList.addEventListener('change', async function(e) {
        if (e.target.type === 'checkbox') {
            var idx = parseInt(e.target.dataset.idx); var t = tasks[idx];
            if (e.target.checked && t) {
                try {
                    var file = app.vault.getAbstractFileByPath(t.path);
                    if (file) { var content = await app.vault.read(file); var lines = content.split('\n');
                        if (lines[t.line] && lines[t.line].includes('- [ ]')) { lines[t.line] = lines[t.line].replace('- [ ]', '- [x]'); await app.vault.modify(file, lines.join('\n')); } } }
                catch(err) { console.log('Toggle task error:', err); }
                e.target.parentElement.classList.add('completed');
            }
        }
    });
    tasksList.addEventListener('click', function(e) {
        var linkEl = e.target.closest('.task-link');
        if (linkEl) { e.preventDefault(); var path = linkEl.dataset.path; if (!path) return;
            var file = app.vault.getAbstractFileByPath(path); if (file) { app.workspace.openLinkText(path, "", true); } }
    });
}

// ===== 每日一言 =====
fetch('https://v1.hitokoto.cn/?c=i')
    .then(function(r) { return r.json(); })
    .then(function(data) {
        var qt = dv.container.querySelector('#rh-quote-text'); var qa = dv.container.querySelector('#rh-quote-author');
        if (qt) qt.textContent = data.hitokoto; if (qa) qa.textContent = '— ' + (data.from || '佚名');
    })
    .catch(function() {
        var qt = dv.container.querySelector('#rh-quote-text'); var qa = dv.container.querySelector('#rh-quote-author');
        if (qt) qt.textContent = '学而不思则网，思而不学则殆。'; if (qa) qa.textContent = '— 孔子';
    });

// ===== 导航 =====
function findFirstMd(folder) {
    for (var i = 0; i < folder.children.length; i++) { var child = folder.children[i];
        if (child.extension === 'md') return child;
        if (child.children) { var f = findFirstMd(child); if (f) return f; } }
    return null;
}
function navigateTo(path) {
    var file = app.vault.getAbstractFileByPath(path);
    if (file && !file.children) { app.workspace.getLeaf().openFile(file); }
    else if (file && file.children) { var firstMd = findFirstMd(file); if (firstMd) app.workspace.getLeaf().openFile(firstMd); }
    else { var resolved = app.metadataCache.getFirstLinkpathDest(path, ''); if (resolved) app.workspace.getLeaf().openFile(resolved); }
}
dv.container.querySelectorAll('[data-nav]').forEach(function(el) {
    el.addEventListener('click', function(e) { e.preventDefault(); navigateTo(el.getAttribute('data-nav')); });
});
```

```activity-graph
TABLE file.day AS date, 1 AS value
FROM ""
SORT file.day ASC
```

<!--
  Dashboard v5c — 主题按钮改为 fixed 浮动定位
  按钮挂在 document.body 上，position:fixed top:16px right:20px
  不占页面空间，不独占一行，跟随屏幕滚动
  离开页面时自动清理
-->