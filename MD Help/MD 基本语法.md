
## 段落

在 Markdown 中创建段落，需使用**空行**来分隔文本块。每个由空行分隔的文本块都被视为独立的段落。

```md
这是一个段落。

这是另一个段落。
```

这是一个段落。

这是另一个段落。

文本行之间的空行会创建独立的段落。这是 Markdown 的默认行为。  

### 多个空格
文本行之间的空行会创建独立的段落。这是 Markdown 的默认行为。

多个空格

段落内和段落之间的多个相邻空格在[阅读视图](https://obsidian.md/zh/help/edit-and-read#%E9%98%85%E8%AF%BB%E8%A7%86%E5%9B%BE)或 [Obsidian Publish](https://obsidian.md/zh/help/publish) 网站上显示时会折叠为单个空格。

```md
Multiple          adjacent          spaces



and multiple newlines between paragraphs.
```

> Multiple adjacent spaces
> 
> and multiple newlines between paragraphs.

如果你想防止空格被折叠或添加多个空格，可以使用 `&nbsp;`（不间断空格）或 `<br>`（换行）HTML 标签。


<hr>
## 换行
在 Obsidian 中，默认情况下按一次 `Enter` 会在笔记中创建新行，但在渲染输出中，这被视为同一段落的_延续_，这遵循了典型的 Markdown 行为。要在段落_内_插入换行而不开始新段落，你可以：

- 在按 `Enter` 之前在行末添加**两个空格**，或者
- 使用快捷键 `Shift+Enter` 直接插入换行。

为什么多次按 `Enter` 不会在阅读视图中产生更多换行？

在 Markdown 中，单个 `Enter` 会被忽略，多个连续的 `Enter` 只会产生一个新段落。这种行为符合 Markdown 的软换行规则，即额外的空行不会生成额外的换行或段落——它们会被折叠为单个段落分隔。这是 Markdown 处理文本的默认方式，确保段落自然流动而不会出现意外的断行。

Obsidian 包含一个**[严格换行](https://obsidian.md/zh/help/settings#%E4%B8%A5%E6%A0%BC%E6%8D%A2%E8%A1%8C)**设置，使 Obsidian 遵循标准 Markdown 规范处理换行。

要启用此功能：

1. 打开**[设置](https://obsidian.md/zh/help/settings)**。
2. 转到**编辑器**选项卡。
3. 启用**严格换行**。

在 Obsidian 中启用**严格换行**后，换行会根据行的分隔方式产生三种不同的行为：

**单次回车且无尾随空格**：单个 `Enter` 且没有尾随空格时，渲染后两行会合并为一行。

```md
line one
line two
```

渲染为：

line one line two

**单次回车且有两个或更多尾随空格**：如果在按 `Enter` 之前在第一行末尾添加两个或更多空格，两行仍属于同一段落，但会通过换行符（HTML `<br>` 元素）分隔。我们在此示例中用两个下划线代替空格。

```md
line three__  
line four
```

渲染为：

line three  
  
line four

**双次回车（无论是否有尾随空格）**：按两次（或更多次）`Enter` 会将行分为两个独立的段落（HTML `<p>` 元素），无论你是否在第一行末尾添加了空格。

```md
line five

line six
```

渲染为：

line five

line six


## 常用格式

### 加粗、斜体、高亮

| 样式      | 语法                    | 示例                  | 输出                |
| ------- | --------------------- | ------------------- | ----------------- |
| 加粗      | `** **` 或 `__ __`     | `**加粗文本**`          | **加粗文本**          |
| 斜体      | `* *` 或 `_ _`         | `*斜体文本*`            | _斜体文本_            |
| 删除线     | `~~ ~~`               | `~~删除线文本~~`         | ~~删除线文本~~         |
| 高亮      | `== ==`               | `==高亮文本==`          | ==高亮文本==          |
| 加粗和嵌套斜体 | `** **` 和 `_ _`       | `**加粗文本和_嵌套斜体_文本**` | **加粗文本和_嵌套斜体_文本** |
| 加粗和斜体   | `*** ***` 或 `___ ___` | `***加粗和斜体文本***`     | **_加粗和斜体文本_**     |

#### 可以通过在格式符号前添加反斜杠 `\` 来强制以纯文本显示。

**这行不会被加粗**

```markdown
\*\*这行不会被加粗\*\*
```

*_这行会是斜体并显示星号_*

```markdown
\**这行会是斜体并显示星号*\*
```

### 链接
#### 外部链接
你可以通过在[外部链接](https://obsidian.md/zh/help/syntax#%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5)前添加 `!` 符号来添加外部 URL 的图片。

```md
![Engelbart](https://history-computer.com/ModernComputer/Basis/images/Engelbart.jpg)
```

![Engelbart](https://history-computer.com/ModernComputer/Basis/images/Engelbart.jpg)

你可以通过在链接目标中添加 `|640x480` 来更改图片尺寸，其中 640 是宽度，480 是高度。

```md
![Engelbart|100x145](https://history-computer.com/ModernComputer/Basis/images/Engelbart.jpg)
```

如果只指定宽度，图片会按原始宽高比缩放。例如：

```md
![Engelbart|100](https://history-computer.com/ModernComputer/Basis/images/Engelbart.jpg)
```

### 引用
> [!info]
> 在文本前添加 > 就可以创建 引用块
>
> ```markdown
> [!info] 这是标注的标题
> ```
> ```markdown
> 它支持 **Markdown**、[[内部链接|内部链接]] 和 [[插入文件|嵌入]]！
> ```

> [!note]

>[!tip] this is tip

>[!faq]- 标注可以折叠
>语法为：[!XXX]-
>`]` 这个后面紧跟 `-`
>`> [!type]+` (默认展开) 或 `> [!type]-` (默认折叠)

> [!question] 标注嵌套
> > [!todo] 多加个 >
> > >[!example] 多层嵌套就多加 >

#### 📋 标注类型与别名列表

| 主要类型         | 别名 (Aliases)           |
| ------------ | ---------------------- |
| **Note**     | 无                      |
| **Abstract** | `summary`, `tldr`      |
| **Info**     | 无                      |
| **Todo**     | 无                      |
| **Tip**      | `hint`, `important`    |
| **Success**  | `check`, `done`        |
| **Question** | `help`, `faq`          |
| **Warning**  | `caution`, `attention` |
| **Failure**  | `fail`, `missing`      |
| **Danger**   | `error`                |
| **Bug**      | 无                      |
| **Example**  | 无                      |
| **Quote**    | `cite`                 |



