---
cssclasses:
  - dashboard
---

```dataviewjs
// ===== 数据准备 =====
var allPages = dv.pages('""');
var now = new Date();
var excludePrefixes = ["Templates", "copilot", ".obsidian", "MD Help"];

function esc(s) {
    var d = document.createElement('div');
    d.textContent = String(s || '');
    return d.innerHTML;
}

// 统计
var totalNotes = allPages.length;
var weekAgoMs = now.getTime() - 7 * 86400000;
var recentWeek = allPages.where(function(p) { return p.file.ctime && p.file.ctime.ts >= weekAgoMs; }).length;

// 标签
var tagMap = {};
allPages.forEach(function(p) {
    if (p.file.etags) p.file.etags.forEach(function(t) { tagMap[t] = (tagMap[t] || 0) + 1; });
});
var topTags = Object.entries(tagMap).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
var totalTags = Object.keys(tagMap).length;

// 目录
var folderMap = {};
allPages.forEach(function(p) {
    var f = (p.file.folder || "/").split("/")[0] || "根目录";
    folderMap[f] = (folderMap[f] || 0) + 1;
});
var topFolders = Object.entries(folderMap).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);

// 最近修改的笔记（5条）
var recentNotes = allPages
    .where(function(p) {
        return p.file.mtime && !excludePrefixes.some(function(pre) { return p.file.path.startsWith(pre); });
    })
    .sort(function(p) { return p.file.mtime; }, "desc")
    .limit(5)
    .array();

// 待办任务（排除模板目录）
var tasks = [];
allPages
    .where(function(p) {
        return !excludePrefixes.some(function(pre) { return p.file.path.startsWith(pre); });
    })
    .forEach(function(p) {
        p.file.tasks.where(function(t) { return !t.completed; }).forEach(function(t) {
            var cleanText = t.text
                .replace(/\[#.*?\]/g, '')
                .replace(/\[.*?::.*?\]/g, '')
                .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, '')
                .replace(/✅\s*\d{4}-\d{2}-\d{2}/g, '')
                .replace(/^##\s*/, '')
                .trim();
            var dueStr = '';
            if (t.due) {
                try { dueStr = t.due.toFormat ? t.due.toFormat('MM-dd') : ''; } catch(e) {}
            }
            tasks.push({
                text: cleanText,
                path: p.file.path,
                line: t.line,
                due: dueStr,
                name: p.file.name
            });
        });
    });
tasks.sort(function(a, b) {
    if (a.due && b.due) return a.due < b.due ? -1 : (a.due > b.due ? 1 : 0);
    if (a.due) return -1;
    if (b.due) return 1;
    return 0;
});

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

// 导航数据
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
// 概览
var overviewHtml = '<div class="rh-overview">' +
    '<div class="rh-overview-col"><div class="col-title">📈 笔记统计</div><div class="col-body">' +
    '<div class="item"><span class="tag">总数</span><span class="value">' + totalNotes + ' 篇</span></div>' +
    '<div class="item"><span class="tag">本周</span><span class="value">' + recentWeek + ' 篇</span></div>' +
    '<div class="item"><span class="tag">标签</span><span class="value">' + totalTags + ' 个</span></div>' +
    '</div></div>' +
    '<div class="rh-overview-col"><div class="col-title">📁 目录分布</div><div class="col-body">' +
    topFolders.map(function(f) {
        return '<div class="item"><span class="tag">' + esc(f[0]) + '</span><span class="value">' + f[1] + ' 篇</span></div>';
    }).join('') +
    '</div></div>' +
    '<div class="rh-overview-col"><div class="col-title">🏷️ 热门标签</div><div class="col-body">' +
    (topTags.length > 0
        ? topTags.map(function(t) {
            return '<div class="item"><span class="tag">' + esc(t[0]) + '</span><span class="value">' + t[1] + ' 次</span></div>';
        }).join('')
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

// 待办任务容器（稍后用 JS 填充）
var tasksHtml = '<div class="rh-card"><div class="rh-card-title">✅ 待办任务</div>' +
    '<div id="rh-tasks-list"></div></div>';

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
    '<div class="rh-right">' + tasksHtml + '</div>' +
    '</div>';

// ===== 填充待办任务（用 createElement 绑定事件）=====
var tasksList = dv.container.querySelector('#rh-tasks-list');
if (tasks.length === 0) {
    tasksList.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:15px">🎉 暂无待办任务</div>';
} else {
    tasks.slice(0, 15).forEach(function(t, i) {
        var item = document.createElement('div');
        item.className = 'rh-task-item';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.idx = i;

        var textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = t.text;

        var linkSpan = document.createElement('span');
        linkSpan.className = 'task-link';
        linkSpan.textContent = '📁 ' + t.name;
        linkSpan.dataset.path = t.path;

        var dueSpan = document.createElement('span');
        dueSpan.className = 'task-due';
        dueSpan.textContent = t.due ? '📅 ' + t.due : '';

        item.appendChild(checkbox);
        item.appendChild(textSpan);
        if (t.due) item.appendChild(dueSpan);
        item.appendChild(linkSpan);
        tasksList.appendChild(item);
    });

    // 复选框勾选事件：修改源文件
    tasksList.addEventListener('change', async function(e) {
        if (e.target.type === 'checkbox') {
            var idx = parseInt(e.target.dataset.idx);
            var t = tasks[idx];
            if (e.target.checked && t) {
                try {
                    var file = app.vault.getAbstractFileByPath(t.path);
                    if (file) {
                        var content = await app.vault.read(file);
                        var lines = content.split('\n');
                        if (lines[t.line] && lines[t.line].includes('- [ ]')) {
                            lines[t.line] = lines[t.line].replace('- [ ]', '- [x]');
                            await app.vault.modify(file, lines.join('\n'));
                        }
                    }
                } catch(err) {
                    console.log('Toggle task error:', err);
                }
                e.target.parentElement.classList.add('completed');
            }
        }
    });

    // 任务来源链接点击：跳转到源文件
    tasksList.addEventListener('click', function(e) {
        if (e.target.classList.contains('task-link')) {
            e.preventDefault();
            var path = e.target.dataset.path;
            var file = app.vault.getAbstractFileByPath(path);
            if (file) app.workspace.getLeaf().openFile(file);
        }
    });
}

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
  4. Activity Graph → 原生代码块渲染，不再用 JS 移动，显示在页面底部
  5. 待办任务 → dataviewjs 直接渲染，复选框可勾选（自动修改源文件），点击链接跳转源文件
  6. 已排除 Templates、copilot、MD Help 目录的任务
  7. 每日一言 → Hitokoto API 实时获取
  8. Banner 图片 → 7张图片每日轮换
  9. 日历 → 已移除，请安装 Calendar 插件（设置→社区插件→浏览→搜索 Calendar→安装→启用）
     Calendar 插件会在左侧边栏显示日历，点击日期可跳转对应日记
  10. 导航 → 点击跳转已存在文件，不创建新文件
-->