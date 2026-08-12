# 🏠 HomePage 主页使用说明

## 一、主页概览

`HomePage/Dashboard.md` 是 Obsidian 笔记库的动态主页，通过 Dataview JS 实时查询笔记数据，配合 CSS 样式渲染出类似 Notion / GitHub 风格的仪表盘。

### 页面布局

```
┌────────────────────────────────────────────────────┐
│  [Banner] 每日轮换图片 + 标题 + 描述 + 一言 API 名言   │
├──────────────────────────┬─────────────────────────┤
│  📈 笔记统计（三列）        │                         │
│  🧭 导航入口（两列网格）    │  ✅ 待办任务              │
│  📝 最近修改（5条）        │  ☐ 可勾选复选框           │
│                          │  📁 点击跳转源文件        │
├──────────────────────────┼─────────────────────────┤
│         🔥 写作热力图（Activity Graph 原生渲染）        │
└────────────────────────────────────────────────────┘

日历 → Calendar 插件在左侧边栏显示
```

---

## 二、功能模块详解

### 1. Banner 横幅
- **功能**：顶部渐变图片背景，显示标题、描述、每日名言
- **图片来源**：7 张 Unsplash 知识主题图片，按天轮换（`dayOfYear % 7`）
- **名言来源**：Hitokoto API (`https://v1.hitokoto.cn/?c=i`) 实时获取诗词名言，网络失败时回退到「学而不思则罔，思而不学则殆。— 孔子」
- **当前内容**：
  - 标题：📚 CCRNP 个人知识库
  - 描述：技术笔记 · 项目记录 · 学习成长 · 构建个人知识体系

### 2. 笔记统计概览
- **功能**：三列卡片，展示笔记库实时统计
- **数据来源**：Dataview `dv.pages()` 查询
- **内容**：
  - 📈 笔记统计：总数、本周新建、标签数
  - 📁 目录分布：Top 5 目录的笔记数量
  - 🏷️ 热门标签：Top 5 标签及使用次数

### 3. 导航入口
- **功能**：两列网格，点击跳转到对应目录/文件
- **特性**：检查文件存在性，不会创建新文件
- **当前入口**：
  | 图标 | 名称 | 跳转路径 |
  |------|------|----------|
  | 🧠 | 具身智能 | `XF/具身智能` |
  | 💡 | IDEA | `IDEA` |
  | 📁 | XF 工作 | `XF` |
  | 📚 | 模板库 | `Templates` |
  | 📊 | Dataview | `Dataview` |
  | 🤖 | Copilot | `copilot` |
  | 📖 | MD 语法 | `MD Help` |
  | 🏠 | HomePage | `HomePage` |

### 4. 最近修改
- **功能**：列出最近修改的 5 篇笔记
- **显示**：文件名（可点击跳转）、目录、修改时间
- **排除**：Templates、copilot、MD Help 目录

### 5. 待办任务
- **功能**：显示全库未完成任务，可勾选完成
- **数据来源**：Dataview 查询 `file.tasks` 中未完成的任务
- **特性**：
  - 复选框可勾选，勾选后自动修改源文件 `- [ ]` → `- [x]`
  - 点击 `📁 文件名` 跳转到任务所在文件
  - 按截止日期排序，无截止日期排在最后
  - 已排除 Templates、copilot、MD Help 目录
  - 自动清理任务文本中的元数据标签（`[#...]`、`📅` 等）

### 6. 写作热力图
- **功能**：显示最近 60 天的写作活跃度
- **插件**：Activity Graph（原生代码块渲染）
- **参数**：`daysToShow: 60`、`showLegend: false`、`colorGradient: green`

### 7. 日历
- **插件**：Calendar（在左侧边栏显示）
- **功能**：月历视图，点击日期跳转对应日记

---

## 三、依赖插件清单

| 插件 | 用途 | 是否必须 |
|------|------|----------|
| **Dataview** | 动态查询笔记数据（核心） | ✅ 必须 |
| **Homepage** | 设置主页文件、启动时自动打开 | ✅ 必须 |
| **Activity Graph** | 写作热力图 | ⚠️ 可选（不装则热力图区域为空） |
| **Calendar** | 左侧边栏日历 | ⚠️ 可选 |
| **obsidian-git** | 自动同步仓库 | ⚠️ 可选 |
| **Tasks** | 任务管理（当前未直接使用，待办用 Dataview 实现） | ⚠️ 可选 |

### 插件配置要求

**Dataview**：
- 设置 → Enable JavaScript Queries：**必须开启**
- 其他设置保持默认

**Homepage**：
- Home page file：`HomePage/Dashboard`
- Open on startup：✅
- Open mode：Replace all open notes
- Pin：✅
- View：Default view

**Activity Graph**：
- 无需额外配置，代码块参数已写在 Dashboard.md 中

---

## 四、文件结构

```
CCRNP/obsidian/
├── .obsidian/
│   ├── community-plugins.json          # 已启用插件列表
│   ├── snippets/
│   │   └── dashboard.css               # 主页 CSS 样式（核心）
│   └── plugins/
│       ├── dataview/                    # Dataview 插件
│       ├── homepage/                    # Homepage 插件
│       ├── activity-graph/              # Activity Graph 插件
│       ├── obsidian-tasks-plugin/       # Tasks 插件
│       └── ...
├── HomePage/
│   ├── Dashboard.md                    # 主页文件（核心）
│   └── README.md                       # 本说明文件
└── ...
```

### CSS 代码片段启用方法

1. 打开 Obsidian → 设置 → 外观
2. 滚动到底部找到「CSS 代码片段」
3. 点击刷新按钮 🔄
4. 找到 `dashboard`，打开开关

---

## 五、如何修改主页

### 5.1 修改 Banner 文字

打开 `HomePage/Dashboard.md`，在 dataviewjs 代码块中搜索以下内容：

```javascript
'<h1>📚 CCRNP 个人知识库</h1>' +
'<p class="rh-banner-desc">技术笔记 · 项目记录 · 学习成长 · 构建个人知识体系</p>' +
```

- 修改 `<h1>` 标签内的文字 = 修改标题
- 修改 `<p>` 标签内的文字 = 修改描述

### 5.2 修改 Banner 图片

搜索 `bannerImages`，修改图片 URL 数组：

```javascript
var bannerImages = [
    'https://images.unsplash.com/photo-xxx',  // 替换为你想要的图片
    // 可以添加更多，也可以减少
];
```

图片每天轮换一张，数量不限。推荐从 [Unsplash](https://unsplash.com) 获取免费高清图片。

### 5.3 修改导航入口

搜索 `navData`，按格式添加/删除/修改：

```javascript
var navData = [
    { icon: "🧠", text: "具身智能", path: "XF/具身智能" },
    { icon: "💡", text: "IDEA", path: "IDEA" },
    // ↓ 添加新入口（icon 填 emoji，text 填显示名称，path 填文件/文件夹路径）
    { icon: "🌟", text: "新模块", path: "新模块路径" },
];
```

### 5.4 修改最近修改的显示数量

搜索 `.limit(5)`，把 `5` 改为你想要的数量：

```javascript
var recentNotes = allPages
    .where(...)
    .sort(function(p) { return p.file.mtime; }, "desc")
    .limit(5)  // ← 改这里，比如改成 10
    .array();
```

### 5.5 修改待办任务显示数量

搜索 `tasks.slice(0, 15)`，把 `15` 改为你想要的数量：

```javascript
tasks.slice(0, 15).forEach(function(t, i) {  // ← 改 15 为其他数字
```

### 5.6 修改待办任务排除目录

搜索 `excludePrefixes`，添加或删除目录名：

```javascript
var excludePrefixes = ["Templates", "copilot", ".obsidian", "MD Help"];
// 比如想排除 Test 目录：
// var excludePrefixes = ["Templates", "copilot", ".obsidian", "MD Help", "Test"];
```

### 5.7 修改热力图参数

在文件底部找到 activity-graph 代码块，修改参数：

````markdown
```activity-graph
daysToShow: 60        # 改显示天数，如 90、180
showLegend: false      # 改为 true 显示图例
colorGradient: green   # 颜色方案：green, blue, red, purple 等
```
````

### 5.8 修改名言 API

搜索 `fetch('https://v1.hitokoto.cn/?c=i')`：

- `c=i` = 诗词类名言
- `c=k` = 哲学类名言
- `c=a` = 动画类名言
- `c=d` = 文学类名言
- 去掉 `?c=i` = 随机所有类型

如果想换其他名言 API，替换整个 URL 即可。

### 5.9 修改 CSS 样式

打开 `.obsidian/snippets/dashboard.css`，按需修改：

| 想修改的 | 搜索关键词 | 说明 |
|---------|-----------|------|
| 卡片圆角 | `border-radius: 18px` | 改数值，如 `12px`（更方）或 `24px`（更圆） |
| 卡片背景色 | `var(--background-secondary)` | 可替换为具体颜色如 `#f0f0f0` |
| 主网格列宽 | `grid-template-columns: 1fr 360px` | `360px` 是右侧栏宽度 |
| 字体大小 | `font-size: 15px` | 按需调大调小 |
| 间距 | `gap: 16px` | 卡片之间的间距 |
| 响应式断点 | `@media (max-width: 760px)` | 屏幕宽度小于此值时切换为单列 |

---

## 六、如何添加新模块

### 6.1 添加一个新的左侧卡片

在 dataviewjs 代码块中，找到 `// ===== 组装渲染 =====` 部分：

```javascript
dv.container.innerHTML =
    '<div class="rh-banner">...' +
    '<div class="rh-grid">' +
    '<div class="rh-left">' + overviewHtml + navHtml + rnHtml + '</div>' +  // ← 左侧区域
    '<div class="rh-right">' + tasksHtml + '</div>' +                       // ← 右侧区域
    '</div>';
```

**步骤**：

1. 在 HTML 构建区定义新模块的 HTML 变量：

```javascript
// 新模块示例：今日计划
var planHtml = '<div class="rh-card"><div class="rh-card-title">📌 今日计划</div>' +
    '<div style="font-size:15px;color:var(--text-normal)">' +
    '这里写你的内容...' +
    '</div></div>';
```

2. 把新变量加到组装渲染的对应位置：

```javascript
'<div class="rh-left">' + overviewHtml + navHtml + rnHtml + planHtml + '</div>' +
//                                                ↑ 加在这里 ^^^^^^^^
```

### 6.2 添加一个新的右侧卡片

同样的方法，加到 `rh-right` 区域：

```javascript
'<div class="rh-right">' + tasksHtml + newCardHtml + '</div>' +
//                         ↑ 加在这里 ^^^^^^^^^^^^
```

### 6.3 添加一个全宽模块（横跨左右）

在 `rh-grid` 闭合 `</div>` 之后添加：

```javascript
dv.container.innerHTML =
    '<div class="rh-banner">...' +
    '<div class="rh-grid">' +
    '<div class="rh-left">...</div>' +
    '<div class="rh-right">...</div>' +
    '</div>' +  // rh-grid 结束
    fullWidthHtml;  // ← 全宽模块加在这里
```

### 6.4 添加 Dataview 查询模块

如果想用 Dataview 查询数据并渲染：

```javascript
// 示例：列出所有带 #重要 标签的笔记
var importantNotes = allPages.where(function(p) {
    return p.file.etags && p.file.etags.includes("#重要");
}).limit(5).array();

var importantHtml = '<div class="rh-card"><div class="rh-card-title">⭐ 重要笔记</div>' +
    importantNotes.map(function(p) {
        return '<div class="rh-rn-item">' +
            '<span class="rn-icon">⭐</span>' +
            '<span class="rn-name" data-nav="' + esc(p.file.path) + '">' + esc(p.file.name) + '</span>' +
            '</div>';
    }).join('') +
    '</div>';
```

然后把 `importantHtml` 加到组装渲染中即可。

---

## 七、常见问题

### Q: 主页打开是空白？
**A**: 检查以下几点：
1. Dataview 插件是否启用，且 Enable JavaScript Queries 已开启
2. CSS 代码片段 `dashboard` 是否启用
3. `HomePage/Dashboard.md` 的 frontmatter 是否有 `cssclasses: [dashboard]`

### Q: 热力图不显示？
**A**: 确认 Activity Graph 插件已安装并启用。热力图使用原生代码块渲染，必须在**阅读视图**下才能显示。

### Q: 待办任务无法勾选？
**A**: 勾选功能通过 `app.vault.modify()` 修改源文件实现，需要 Obsidian 有文件写入权限。如果任务所在文件被其他程序锁定，勾选可能失败。

### Q: 导航点击后创建了新文件？
**A**: 导航逻辑会先检查文件是否存在，不存在则不操作。如果仍然创建新文件，说明路径不匹配，检查 `navData` 中的 `path` 是否正确。

### Q: 名言显示「正在获取每日一言...」一直不变？
**A**: 网络问题导致 Hitokoto API 无法访问，会自动回退到默认名言。检查网络连接，或更换为其他名言 API。

### Q: Banner 图片不显示？
**A**: Unsplash 图片需要联网加载。如果网络不稳定，会只显示渐变色背景。可以替换为本地图片路径。

### Q: 如何切换深色/浅色模式？
**A**: 主页 CSS 全部使用 Obsidian CSS 变量（如 `var(--background-secondary)`），会自动适配当前主题的深色/浅色模式，无需额外配置。

### Q: 修改了 Dashboard.md 但没有生效？
**A**: 确保修改已经保存（Ctrl/Cmd + S），然后关闭并重新打开主页文件。如果使用了 obsidian-git，确保修改已同步到本地。

---

## 八、配置文件备份与恢复

### 需要备份的文件

| 文件 | 说明 |
|------|------|
| `HomePage/Dashboard.md` | 主页核心文件 |
| `.obsidian/snippets/dashboard.css` | CSS 样式 |
| `.obsidian/community-plugins.json` | 插件启用列表 |
| `.obsidian/plugins/homepage/data.json` | Homepage 插件配置 |

### 恢复步骤

1. 将上述文件恢复到仓库对应位置
2. 打开 Obsidian，同步仓库
3. 设置 → 外观 → CSS 代码片段 → 刷新 → 启用 `dashboard`
4. 设置 → 社区插件 → 确认所有插件已启用
5. 重新打开主页

---

## 九、版本历史

| 日期 | 版本 | 修改内容 |
|------|------|----------|
| 2026-08-12 | v1.0 | 初始版本，包含 Banner、统计、导航、待办、热力图、最近修改 |

---

*本文档由 TRAE 辅助生成，如有疑问请参考 Dashboard.md 中的代码注释。*