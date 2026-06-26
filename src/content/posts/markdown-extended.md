---
title: Markdown 扩展功能
published: 2024-05-01
updated: 2024-11-29
description: '了解 Mizuki 中的 Markdown 扩展功能'
image: ''
tags: [Demo, Example, Markdown, Mizuki]
category: '示例'
draft: false 
---

## GitHub 仓库卡片
你可以添加链接到 GitHub 仓库的动态卡片，页面加载时会从 GitHub API 拉取仓库信息。

::github{repo="LyraVoid/Mizuki"}

使用代码 `::github{repo="LyraVoid/Mizuki"}` 来创建 GitHub 仓库卡片。

```markdown
::github{repo="LyraVoid/Mizuki"}
```

## 提示框

支持以下类型的提示框：`note` `tip` `important` `warning` `caution`

:::note
高亮用户即使在快速浏览时也应注意的信息。
:::

:::tip
可选信息，帮助用户更好地完成操作。
:::

:::important
用户成功完成操作所必需的关键信息。
:::

:::warning
由于存在潜在风险，需要用户立即关注的重要内容。
:::

:::caution
某个操作可能带来的负面后果。
:::

### 基本语法

```markdown
:::note
高亮用户即使在快速浏览时也应注意的信息。
:::

:::tip
可选信息，帮助用户更好地完成操作。
:::
```

### 自定义标题

提示框的标题可以自定义。

:::note[我的自定义标题]
这是一个带有自定义标题的 note 提示框。
:::

```markdown
:::note[我的自定义标题]
这是一个带有自定义标题的 note 提示框。
:::
```

### GitHub 语法

> [!TIP]
> 同样支持 [GitHub 语法](https://github.com/orgs/community/discussions/16925)。

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### 剧透

你可以在文本中添加剧透内容。剧透文本同样支持 **Markdown** 语法。

内容 :spoiler[被隐藏了 **嘿嘿**]！

```markdown
The content :spoiler[is hidden **ayyy**]!
```
