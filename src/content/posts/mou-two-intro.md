---
title: Mou：一个零框架的个人开发者网站
published: 2026-06-30T19:42:00+08:00
pinned: false
description: 某炜用纯 HTML/CSS/JS 构建的个人网站，单文件架构，零依赖，记录从想法到上线的全过程。
tags: [前端, HTML, CSS, JavaScript, 个人项目]
category: 项目分享
author: 某炜
sourceLink: "https://github.com/Mou-1205/Mou-Two"
draft: false
---

# Mou：一个零框架的个人开发者网站

> 以好奇心构建，以清晰度交付。
>
> —— 某炜

## 为什么做这个项目

用了很多框架之后，想回归最原始的方式——纯 HTML + CSS + JavaScript，不借助任何框架，看看能做到什么程度。

目标很简单：
- 一个能展示技能和项目的作品集网站
- 全部代码写在一个 `index.html` 里
- 部署到 GitHub Pages，推代码就上线

## 技术选型

| 技术 | 用途 |
|------|------|
| HTML5 | 语义化结构 |
| CSS3 | Grid / Flexbox 响应式布局 |
| Vanilla JS | 交互逻辑 |
| Canvas API | 墨迹擦除动效 |
| IntersectionObserver | 滚动渐入动画 |
| Google Fonts | Instrument Serif + DM Sans + Noto Serif SC |

没有构建工具，没有打包流程，浏览器直接打开 `index.html` 就能跑。

## 设计系统

整个网站用 CSS 变量统一管理：

```css
:root {
  --bg: #f6f4f0;
  --accent: #4a7c59;
  --text-primary: #1a1a17;
  --text-body: #4a4a45;
  --radius: 14px;
}
```

改一个变量值，全局跟着变。配色走的是偏暖的米白底 + 森林绿点缀，视觉上比较舒服。

![Mou 网站效果图](/images/posts/mou-two-screenshot.png)

## 设计灵感

整体设计借鉴了 [MiMo Code](https://mimo.xiaomi.com/mimocode)——导航栏的下划线 hover 动效，以及 Hero 区的墨迹擦除背景效果，都从那里获得启发。在此基础上做了自己的调整，比如配色换成米白 + 森林绿，字体换成 Instrument Serif + DM Sans 的组合。

## 核心特性

### 导航栏

固定在顶部，滚动时显示分隔线。导航链接的 hover 效果从左到右展开，用 `scaleX` + `cubic-bezier` 实现。

### 滚动渐入

用 `IntersectionObserver` 监听元素进入视口，触发 CSS 渐入动画。比传统的 `scroll` 事件监听性能好很多，不掉帧。

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
```

### 弹窗交互

点击赞助按钮弹出二维码，动画用 `visibility + opacity` 而不是 `display: none`，因为后者没法做 CSS 过渡。

### 无障碍

支持 `prefers-reduced-motion`，系统开了减少动效的用户会自动跳过所有动画。

## 项目结构

```
Mou-Two/
├── index.html          # 主页面（~800 行，CSS+JS 全内联）
├── assets/
│   ├── 背景.png        # Hero 区背景图
│   ├── 头像.jpg        # 导航栏头像
│   ├── 赞助.jpg        # 赞赏二维码
│   └── screenshot.png  # README 效果图
├── robots.txt
├── sitemap.xml
└── README.md
```

## 部署

GitHub Pages 自动部署，推送到 `main` 分支就生效：

```bash
git add .
git commit -m "feat: 更新内容"
git push origin main
```

访问地址：[www.mouy.site](https://www.mouy.site)

## 写在最后

单文件架构在小项目里其实挺好用的。代码全在一个文件里，改起来很快，也不用操心模块拆分的问题。当然，超过 1000 行之后就开始不舒服了——这个项目的 `index.html` 大概 800 行，刚好在舒适区边界。

如果想看源码或者提建议，欢迎来 GitHub：[Mou-1205/Mou-Two](https://github.com/Mou-1205/Mou-Two)
