# 🌸 某炜

基于 [Astro](https://astro.build) 的静态博客模板。

[![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-6.3.8-orange)](https://astro.build/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

[**🖥️ 在线演示**](https://mouy.site) | [**📝 文档**](https://docs.mizuki.mysqil.com/)

## 🚀 快速开始

### 安装

```bash
git clone https://github.com/Mou-1205/Mou.git
cd Mou

npm install -g pnpm
pnpm install
```

### 启动

```bash
pnpm dev
```

博客将在 `http://localhost:4321` 可用。

### 部署

部署前在 `src/config.ts` 中更新 `siteURL`。支持 Vercel、Netlify、GitHub Pages、Cloudflare Pages 等静态托管平台。

环境变量参照 `.env.example` 配置，**不建议**将 `.env` 提交到 Git，云平台部署建议通过平台的环境变量配置传入。

## ⚡ 命令

| 命令 | 操作 |
| :--- | :--- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建生产站点到 `./dist/` |
| `pnpm preview` | 本地预览构建 |
| `pnpm check` | 运行 Astro 错误检查 |
| `pnpm format` | Prettier 格式化代码 |
| `pnpm lint` | 检查并修复代码问题 |
| `pnpm new-post <文件名>` | 创建新博客文章 |

## 📝 文章 Frontmatter

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 文章描述，用于 SEO 和预览
image: ./cover.jpg
tags: [标签1, 标签2]
category: 前端
draft: false
pinned: false
comment: true
lang: zh-CN # 仅当文章语言与站点语言不同时设置
---
```

**字段说明：**

- **title** — 文章标题（必填）
- **published** — 发布日期（必填）
- **description** — 文章描述，用于 SEO 和预览
- **image** — 封面图片路径（相对于文章文件）
- **tags** — 标签数组
- **category** — 文章分类
- **draft** — `true` 在生产环境隐藏文章
- **pinned** — `true` 将文章置顶（按发布日期排序）
- **comment** — `true` 启用评论（需全局启用评论功能）
- **lang** — 文章语言（仅与站点默认语言不同时设置）

## 🧩 Markdown 扩展

- **提示框：** `> [!NOTE]`、`> [!TIP]`、`> [!WARNING]` 等
- **数学公式：** `$行内$` 和 `$$块级$$` 语法（KaTeX）
- **代码高亮：** 基于 Expressive Code，支持行号和复制按钮
- **GitHub 卡片：** `::github{repo="用户/仓库"}`
- **图片画廊：** 自动 PhotoSwipe 集成
- **可折叠部分：** 可展开的内容块
- **目录：** 从标题自动生成

## 🎯 配置指南

### 基础配置

编辑 `src/config.ts`：

```typescript
export const siteConfig: SiteConfig = {
  title: "你的博客名称",
  subtitle: "你的博客描述",
  lang: "zh-CN",
  themeColor: {
    hue: 210,       // 0-360，主题色调
    fixed: false,   // 隐藏主题色选择器
  },
  banner: {
    enable: true,
    src: ["assets/banner/1.webp"],
    carousel: {
      enable: true,
      interval: 0.8,
    },
  },
};
```

### 特色页面

- **追番页面：** `src/pages/anime.astro`
- **友链页面：** `src/content/spec/friends.md`
- **日记页面：** `src/pages/diary.astro`
- **关于页面：** `src/content/spec/about.md`

### 内容管理

- **创建文章：** `pnpm new-post <文件名>`
- **编辑文章：** `src/content/posts/`
- **自定义页面：** `src/content/spec/`
- **添加图片：** `src/assets/` 或 `public/`

### 代码内容分离（可选）

支持将代码和内容分成两个独立仓库管理。

| 使用场景 | 配置方式 | 适合人群 |
| --- | --- | --- |
| 本地模式（默认） | 不配置，直接使用 | 新手、个人博客 |
| 分离模式 | 设置 `ENABLE_CONTENT_SYNC=true` | 团队协作、私有内容 |

```bash
# 启用内容分离
cp .env.example .env
# 编辑 .env：
# ENABLE_CONTENT_SYNC=true
# CONTENT_REPO_URL=https://github.com/your-username/Content.git
pnpm run sync-content
```

📖 [内容分离完整指南](docs/CONTENT_SEPARATION.md) | 🔄 [迁移教程](docs/MIGRATION_GUIDE.md)

## 📄 许可证

Apache 2.0 — 基于 [Fuwari](https://github.com/saicaca/fuwari)（MIT）开发。原始版权声明见 [LICENSE.MIT](LICENSE.MIT)。

## 🙏 致谢

- 基于 [Mizuki](https://github.com/LyraVoid/Mizuki) / [Fuwari](https://github.com/saicaca/fuwari) by saicaca
- 设计灵感 [Yukina](https://github.com/WhitePaper233/yukina)、[Firefly](https://github.com/CuteLeaf/Firefly)、[Twilight](https://github.com/spr-aachen/Twilight)
- Live2D 看板娘 [Pio](https://github.com/Dreamer-Paul/Pio)
- 图标 [Iconify](https://iconify.design/)
