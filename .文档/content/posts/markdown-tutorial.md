---
title: Markdown 教程
published: 2025-01-20
pinned: true
description: 一个简单的 Markdown 博客文章示例。
tags: [Markdown, Blogging]
category: Examples
licenseName: "Unlicensed"
author: emn178
sourceLink: "https://github.com/emn178/markdown"
draft: false
---

# Markdown 教程

一个 Markdown 示例，展示如何编写 Markdown 文件。本文档涵盖了核心语法和扩展语法（GMF）。

- [块级元素](#block-elements)
  - [段落与换行](#paragraphs-and-line-breaks)
  - [标题](#headers)
  - [引用块](#blockquotes)
  - [列表](#lists)
  - [代码块](#code-blocks)
  - [水平线](#horizontal-rules)
  - [表格](#table)
- [行内元素](#span-elements)
  - [链接](#links)
  - [强调](#emphasis)
  - [行内代码](#code)
  - [图片](#images)
  - [删除线](#strikethrough)
- [其他](#miscellaneous)
  - [自动链接](#automatic-links)
  - [反斜杠转义](#backslash-escapes)
- [行内 HTML](#inline-html)

## 块级元素

### 段落与换行

#### 段落

HTML 标签：`<p>`

一个或多个空行。（空行是指只包含**空格**或**制表符**的行，也被视为空行。）

代码：

    This will be
    inline.

    This is second paragraph.

预览：

---

This will be
inline.

This is second paragraph.

---

#### 换行

HTML 标签：`<br />`

在行末添加**两个或更多空格**。

代码：

    This will be not
    inline.

预览：

---

This will be not
inline.

---

### 标题

Markdown 支持两种标题样式：Setext 和 atx。

#### Setext

HTML 标签：`<h1>`、`<h2>`

使用**等号（=）**"下划线"表示 `<h1>`，使用**短横线（-）**表示 `<h2>`，数量不限。

代码：

    This is an H1
    =============
    This is an H2
    -------------

预览：

---

# This is an H1

## This is an H2

---

#### atx

HTML 标签：`<h1>`、`<h2>`、`<h3>`、`<h4>`、`<h5>`、`<h6>`

在行首使用 1-6 个**井号（#）**，对应 `<h1>` 到 `<h6>`。

代码：

    # This is an H1
    ## This is an H2
    ###### This is an H6

预览：

---

# This is an H1

## This is an H2

###### This is an H6

---

你也可以选择"关闭" atx 样式标题。关闭用的井号**不需要与开头的井号数量匹配**。

代码：

    # This is an H1 #
    ## This is an H2 ##
    ### This is an H3 ######

预览：

---

# This is an H1

## This is an H2

### This is an H3

---

### 引用块

HTML 标签：`<blockquote>`

Markdown 使用类似邮件的 **>** 字符来表示引用块。如果对文本进行硬换行并在每行前加上 >，效果最佳。

代码：

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    > consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    > Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
    >
    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    > id sem consectetuer libero luctus adipiscing.

预览：

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

Markdown 允许你偷懒，只在硬换行段落的第一行前加上 >。

代码：

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    id sem consectetuer libero luctus adipiscing.

预览：

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

引用块可以嵌套（即引用块中的引用块），只需添加更多层级的 >。

代码：

    > This is the first level of quoting.
    >
    > > This is nested blockquote.
    >
    > Back to the first level.

预览：

---

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

---

引用块可以包含其他 Markdown 元素，包括标题、列表和代码块。

代码：

    > ## This is a header.
    >
    > 1.   This is the first list item.
    > 2.   This is the second list item.
    >
    > Here's some example code:
    >
    >     return shell_exec("echo $input | $markdown_script");

预览：

---

> ## This is a header.
>
> 1.  This is the first list item.
> 2.  This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");

---

### 列表

Markdown 支持有序（带编号）列表和无序（带符号）列表。

#### 无序列表

HTML 标签：`<ul>`

无序列表使用**星号（\*）**、**加号（+）**和**短横线（-）**。

代码：

    *   Red
    *   Green
    *   Blue

预览：

---

- Red
- Green
- Blue

---

等价于：

代码：

    +   Red
    +   Green
    +   Blue

以及：

代码：

    -   Red
    -   Green
    -   Blue

#### 有序列表

HTML 标签：`<ol>`

有序列表使用数字后跟句点：

代码：

    1.  Bird
    2.  McHale
    3.  Parish

预览：

---

1.  Bird
2.  McHale
3.  Parish

---

有时可能会意外触发有序列表，例如写如下内容：

代码：

    1986. What a great season.

预览：

---

1986. What a great season.

---

你可以使用**反斜杠转义（\\）**句点：

代码：

    1986\. What a great season.

预览：

---

1986\. What a great season.

---

#### 缩进

##### 引用块

要在列表项中放置引用块，引用块的 > 分隔符需要缩进：

代码：

    *   A list item with a blockquote:

        > This is a blockquote
        > inside a list item.

预览：

---

- A list item with a blockquote:

  > This is a blockquote
  > inside a list item.

---

##### 代码块

要在列表项中放置代码块，代码块需要缩进两次——**8 个空格**或**两个制表符**：

代码：

    *   A list item with a code block:

            <code goes here>

预览：

---

- A list item with a code block:

      <code goes here>

---

##### 嵌套列表

代码：

    * A
      * A1
      * A2
    * B
    * C

预览：

---

- A
  - A1
  - A2
- B
- C

---

### 代码块

HTML 标签：`<pre>`

将块中的每一行至少缩进 **4 个空格**或 **1 个制表符**。

代码：

    This is a normal paragraph:

        This is a code block.

预览：

---

This is a normal paragraph:

    This is a code block.

---

代码块会一直持续到遇到非缩进行（或文章结束）。

在代码块内，**_& 符号（&）_**和**尖括号（< 和 >）**会自动转换为 HTML 实体。

代码：

        <div class="footer">
            &copy; 2004 Foo Corporation
        </div>

预览：

---

    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>

---

以下章节"围栏代码块"和"语法高亮"是扩展语法，你可以用另一种方式编写代码块。

#### 围栏代码块

只需用 ` ``` ` 包裹代码（如下所示），就无需缩进四个空格。

代码：

    Here's an example:

    ```
    function test() {
      console.log("notice the blank line before this function?");
    }
    ```

预览：

---

Here's an example:

```
function test() {
  console.log("notice the blank line before this function?");
}
```

---

#### 语法高亮

在围栏代码块中添加可选的语言标识符，系统会对其进行语法高亮处理（[支持的语言](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml)）。

代码：

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

预览：

---

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

---

### 水平线

HTML 标签：`<hr />`
在一行中放置**三个或更多短横线（-）、星号（\*）或下划线（\_）**。短横线或星号之间可以使用空格。

代码：

    * * *
    ***
    *****
    - - -
    ---------------------------------------
    ___

预览：

---

---

---

---

---

---

---

---

---

### 表格

HTML 标签：`<table>`

这是一个扩展语法。

使用**竖线（|）**分隔列，使用**短横线（-）**分隔表头，使用**冒号（:）**设置对齐方式。

外层的**竖线（|）**和对齐方式是可选的。分隔表头时每个单元格至少需要 **3 个分隔符**。

代码：

```
| Left | Center | Right |
|:-----|:------:|------:|
|aaa   |bbb     |ccc    |
|ddd   |eee     |fff    |

 A | B
---|---
123|456


A |B
--|--
12|45
```

预览：

---

| Left | Center | Right |
| :--- | :----: | ----: |
| aaa  |  bbb   |   ccc |
| ddd  |  eee   |   fff |

| A   | B   |
| --- | --- |
| 123 | 456 |

| A   | B   |
| --- | --- |
| 12  | 45  |

---

## 行内元素

### 链接

HTML 标签：`<a>`

Markdown 支持两种链接样式：行内链接和引用链接。

#### 行内链接

行内链接格式如下：`[链接文本](URL "标题")`

标题是可选的。

代码：

    This is [an example](http://example.com/ "Title") inline link.

    [This link](http://example.net/) has no title attribute.

预览：

---

This is [an example](http://example.com/ "Title") inline link.

[This link](http://example.net/) has no title attribute.

---

如果引用的是同一服务器上的本地资源，可以使用相对路径：

代码：

    See my [About](/about/) page for details.

预览：

---

See my [About](/about/) page for details.

---

#### 引用链接

你可以预定义链接引用。格式如下：`[id]: URL "标题"`

标题也是可选的。引用链接时格式如下：`[链接文本][id]`

代码：

    [id]: http://example.com/  "Optional Title Here"
    This is [an example][id] reference-style link.

预览：

---

[id]: http://example.com/ "Optional Title Here"

This is [an example][id] reference-style link.

---

具体规则：

- 方括号中包含链接标识符（**不区分大小写**，可选择从左边距缩进最多三个空格）；
- 后跟冒号；
- 后跟一个或多个空格（或制表符）；
- 后跟链接的 URL；
- 链接 URL 可以选择用尖括号包裹。
- 可选择后跟链接的标题属性，用双引号、单引号或圆括号包裹。

以下三种链接定义是等价的：

代码：

    [foo]: http://example.com/  "Optional Title Here"
    [foo]: http://example.com/  'Optional Title Here'
    [foo]: http://example.com/  (Optional Title Here)
    [foo]: <http://example.com/>  "Optional Title Here"

使用空的方括号，链接文本本身将作为名称使用。

代码：

    [Google]: http://google.com/
    [Google][]

预览：

---

[Google]: http://google.com/

[Google][]

---

### 强调

HTML 标签：`<em>`、`<strong>`

Markdown 将**星号（\*）**和**下划线（\_）**视为强调标记。**单个分隔符**将生成 `<em>`；**双分隔符**将生成 `<strong>`。

代码：

    *single asterisks*

    _single underscores_

    **double asterisks**

    __double underscores__

预览：

---

_single asterisks_

_single underscores_

**double asterisks**

**double underscores**

---

但如果在 \* 或 \_ 两侧加上空格，它们将被视为字面量的星号或下划线。

你可以使用反斜杠转义：

代码：

    \*this text is surrounded by literal asterisks\*

预览：

---

\*this text is surrounded by literal asterisks\*

---

### 行内代码

HTML 标签：`<code>`

使用**反引号（`）**包裹。

代码：

    Use the `printf()` function.

预览：

---

Use the `printf()` function.

---

要在行内代码中包含字面量的反引号字符，可以使用**多个反引号**作为开始和结束分隔符：

代码：

    ``There is a literal backtick (`) here.``

预览：

---

``There is a literal backtick (`) here.``

---

行内代码的反引号分隔符中可以包含空格——开始分隔符后一个，结束分隔符前一个。这样你就可以在行内代码的开头或结尾放置字面量的反引号字符：

代码：

    A single backtick in a code span: `` ` ``

    A backtick-delimited string in a code span: `` `foo` ``

预览：

---

A single backtick in a code span: `` ` ``

A backtick-delimited string in a code span: `` `foo` ``

---

### 图片

HTML 标签：`<img />`

Markdown 使用的图片语法类似于链接语法，支持两种样式：行内和引用。

#### 行内图片

行内图片语法如下：`![替代文本](URL "标题")`

标题是可选的。

代码：

    ![Alt text](/path/to/img.jpg)

    ![Alt text](/path/to/img.jpg "Optional title")

预览：

---

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp)

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title")

---

具体规则：

- 一个感叹号：!;
- 后跟一对方括号，包含图片的替代文本；
- 后跟一对圆括号，包含图片的 URL 或路径，以及可选的用双引号或单引号包裹的标题属性。

#### 引用图片

引用图片语法如下：`![替代文本][id]`

代码：

    [img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp  "Optional title attribute"
    ![Alt text][img id]

预览：

---

[img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title attribute"

![Alt text][img id]

---

### 删除线

HTML 标签：`<del>`

这是一个扩展语法。

GFM 添加了删除线文本的语法。

代码：

```
~~Mistaken text.~~
```

预览：

---

~~Mistaken text.~~

---

## 其他

### 自动链接

Markdown 支持一种快捷方式来为 URL 和电子邮件地址创建"自动"链接：只需用尖括号包裹 URL 或电子邮件地址即可。

代码：

    <http://example.com/>

    <address@example.com>

预览：

---

<http://example.com/>

<address@example.com>

---

GFM 会自动链接标准 URL。

代码：

```
https://github.com/emn178/markdown
```

预览：

---

https://github.com/emn178/markdown

---

### 反斜杠转义

Markdown 允许你使用反斜杠转义来生成字面量字符，这些字符在 Markdown 格式语法中原本具有特殊含义。

代码：

    \*literal asterisks\*

预览：

---

\*literal asterisks\*

---

Markdown 为以下字符提供反斜杠转义：

代码：

    \   backslash
    `   backtick
    *   asterisk
    _   underscore
    {}  curly braces
    []  square brackets
    ()  parentheses
    #   hash mark
    +   plus sign
    -   minus sign (hyphen)
    .   dot
    !   exclamation mark

## 行内 HTML

对于 Markdown 语法未涵盖的任何标记，你可以直接使用 HTML 本身。无需预先声明或分隔来表示你正在从 Markdown 切换到 HTML；只需使用标签即可。

代码：

    This is a regular paragraph.

    <table>
        <tr>
            <td>Foo</td>
        </tr>
    </table>

    This is another regular paragraph.

预览：

---

This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.

---

请注意，Markdown 格式语法**不会在块级 HTML 标签内进行处理**。

与块级 HTML 标签不同，Markdown 语法**会在行内标签内进行处理**。

代码：

    <span>**Work**</span>

    <div>
        **No Work**
    </div>

预览：

---

<span>**Work**</span>

<div>
  **No Work**
</div>
***
