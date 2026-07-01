# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mizuki 是一个基于 Astro 7 + Svelte + Tailwind CSS 的静态博客模板。当前已中文化，部署于 mouy.site。

**运行要求：** Node.js >= 22, pnpm >= 9 (packageManager: pnpm@11.5.3)

## Development Commands

```bash
# 开发（Windows 必须加这个环境变量，否则 spawn 报错）
ASTRO_DEV_BACKGROUND=1 pnpm astro dev --host

# 停止开发服务器
pnpm astro dev stop

# 构建（完整流水线：更新追番数据 → astro build → pagefind 索引 → 字体压缩）
pnpm build

# 预览构建结果
pnpm preview

# 单步构建
pnpm astro build                    # 仅 astro 构建
node scripts/compress-fonts/index.js # 仅字体压缩

# 格式化（Biome，tab 缩进，双引号，分号）
pnpm format

# Lint + 自动修复
pnpm lint

# 类型检查
pnpm type-check

# Astro 诊断检查
pnpm check

# 测试
node --test tests/*.test.mjs        # 运行测试（Node.js 内置 test runner）

# 新建文章
pnpm new-post <文件名>

# 提交 URL 到 IndexNow（SEO）
pnpm submit

# 更新追番数据
pnpm update-anime       # MyAnimeList
pnpm update-bangumi     # Bangumi
pnpm update-bilibili    # B站（需要 BILI_SESSDATA 环境变量）

# 内容仓库同步（代码/内容分离模式）
pnpm sync-content
```

**Windows 踩坑：** 开发服务器必须设置 `ASTRO_DEV_BACKGROUND=1` 环境变量，否则会报 "Failed to spawn background dev server process" 错误。

## Path Aliases

tsconfig.json 定义了以下别名，import 时优先使用：

| 别名 | 指向 |
|------|------|
| `@components/*` | `src/components/*` |
| `@assets/*` | `src/assets/*` |
| `@constants/*` | `src/constants/*` |
| `@utils/*` | `src/utils/*` |
| `@i18n/*` | `src/i18n/*` |
| `@layouts/*` | `src/layouts/*` |
| `@/*` | `src/*` |

## Code Style

项目使用 **Biome**（非 Prettier/ESLint）：
- **缩进**: tab
- **引号**: 双引号 `"`
- **分号**: 始终加
- **尾逗号**: 始终加
- **箭头函数括号**: 始终加
- `.svelte` / `.astro` 文件放宽 lint 规则（允许未使用变量、禁用 `useConst` / `useImportType`）
- Biome 排除 CSS、dist、node_modules、public、scripts 目录

## Architecture

### Tech Stack
- **Framework:** Astro 7.0.0
- **UI Components:** Svelte 5.x（音乐播放器、设置面板、搜索等交互组件）
- **Styling:** Tailwind CSS 4 + Stylus（`variables.styl` 定义 oklch 色彩空间 CSS 变量）
- **Icons:** Iconify（`astro-icon`，支持 fa7-brands、fa7-regular、fa7-solid、material-symbols、mdi、simple-icons）
- **Content:** Markdown/MDX, Astro Content Collections
- **Search:** Pagefind（构建后索引）
- **Page Transitions:** Swup（`@swup/astro`）
- **Code Blocks:** `astro-expressive-code`（语法高亮、行号、折叠、自定义复制按钮）
- **Deployment:** Vercel（`vercel.json` 配置安全头 + `/_astro/` 长缓存 + cleanUrls）

### Component Architecture

```
src/components/
├── atoms/           # 原子 UI 元素（按钮、徽章等）
├── comment/         # 评论系统组件
├── common/          # 共享通用组件
├── control/         # 控制组件（ThemeSwitch 等）
├── features/        # 功能页面组件（anime, friends, devices）
├── layout/          # 布局组件（Banner, RightSideBar）
├── misc/            # 杂项组件
├── organisms/       # 有机体级组件（Navbar, Footer）
└── widgets/         # 侧边栏组件（profile, music, stats 等）
```

### Key Directories

```
src/
├── config/           # 所有配置文件（核心定制区域）→ 通过 index.ts 统一导出
├── components/       # UI 组件（见上方架构）
├── content/
│   ├── posts/        # 博客文章（.md/.mdx）
│   └── spec/         # 特殊页面（about.md, friends.md 等）
├── data/             # 静态数据（anime.ts, friends.ts, devices.ts, projects.ts）
├── pages/
│   ├── [...permalink].astro  # 文章路由（catch-all，支持自定义 permalink/alias）
│   ├── [...page].astro       # 分页路由
│   └── api/                  # API 端点
├── plugins/          # remark/rehype 插件（admonition, github-card, mermaid 等）
├── styles/           # 全局样式
│   ├── variables.styl   # CSS 变量定义（oklch 色彩空间，主题色）
│   ├── main.css         # 主样式入口
│   └── banner.css       # Banner 相关样式
├── i18n/             # 国际化（zh_CN.ts, en.ts, ja.ts, zh_TW.ts）
├── utils/            # 工具函数（含 widget-manager.ts 组件注册）
├── stores/           # Svelte stores（musicPlayerStore.ts）
├── layouts/          # 布局模板（Layout.astro, MainGridLayout.astro）
├── types/            # TypeScript 类型定义（config.ts 定义所有配置接口）
└── constants/        # 常量（PAGE_WIDTH, BANNER_HEIGHT 等）
```

### Content Collections

文章 schema（`src/content.config.ts`）关键字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 必需 |
| `published` | date | 必需 |
| `updated` | date | 更新日期 |
| `tags` | string[] | 标签数组 |
| `category` | string | 分类 |
| `pinned` | boolean | 置顶文章 |
| `comment` | boolean | 是否启用评论（默认 true） |
| `encrypted` | boolean | 页面加密 |
| `password` | string | 加密密码 |
| `passwordHint` | string | 加密密码提示 |
| `permalink` | string | 自定义固定链接（优先级高于 alias） |
| `alias` | string | 文章别名 |
| `draft` | boolean | 草稿（生产环境隐藏） |
| `lang` | string | 文章语言（与站点语言不同时设置） |
| `priority` | number | 排序优先级 |
| `author` | string | 作者 |
| `sourceLink` | string | 原文链接 |
| `licenseName` / `licenseUrl` | string | 许可证 |

`spec` 集合用于特殊页面（about, friends 等），无 schema 约束。

### Environment Variables

参考 `.env.example`，关键变量：

| 变量 | 用途 |
|------|------|
| `ENABLE_CONTENT_SYNC` | 代码/内容分离模式开关 |
| `CONTENT_REPO_URL` | 内容仓库 Git URL |
| `CONTENT_DIR` | 内容目录路径（默认 `./content`） |
| `BILI_SESSDATA` | B站 cookie，用于追番数据更新 |
| `INDEXNOW_KEY` | IndexNow SEO 提交密钥 |
| `INDEXNOW_HOST` | IndexNow 网站主机地址 |

### Configuration System

所有定制通过 `src/config/` 下的文件完成：

| 文件 | 作用 |
|------|------|
| `siteConfig.ts` | 站点标题、URL、主题色 hue、特色页面开关、Banner 配置 |
| `profileConfig.ts` | 头像、名字、简介、社交链接 |
| `navBarConfig.ts` | 导航栏链接（支持多级下拉） |
| `sidebarConfig.ts` | 侧边栏组件顺序和位置 |
| `sidebarNavConfig.ts` | 侧栏导航配置 |
| `commentConfig.ts` | 评论系统（Twikoo/Giscus） |
| `musicConfig.ts` | 音乐播放器（local/meting 模式） |
| `announcementConfig.ts` | 公告内容 |
| `footerConfig.ts` | 页脚配置 |
| `effectsConfig.ts` | 视觉效果配置 |
| `backgroundWallpaper.ts` | 背景壁纸 |
| `permalinkConfig.ts` | 固定链接格式 |
| `shareConfig.ts` | 分享功能 |
| `randomPostsConfig.ts` | 随机文章推荐 |
| `relatedPostsConfig.ts` | 相关文章推荐 |
| `expressiveCodeConfig.ts` | 代码块样式 |
| `licenseConfig.ts` | 许可证配置 |
| `pioConfig.ts` | 看板娘配置 |

### Sidebar Widget System

侧边栏组件通过 `sidebarConfig.ts` 配置：
- `properties`: 定义每个组件的类型、位置、动画
- `components.left/right/drawer`: 指定各位置的组件列表
- 组件注册在 `utils/widget-manager.ts` 的 `WIDGET_COMPONENT_MAP`

### CSS Variables

主题色在 `src/styles/variables.styl` 中定义，使用 oklch 色彩空间：
- `--primary`: 主题色（含 light/dark 两个值）
- `--page-bg`: 页面背景
- `--card-bg`: 卡片背景
- `--hue`: 色相值（在 siteConfig.ts 中设置，影响所有颜色）

### Music Player

本地模式歌曲定义在 `src/components/widgets/music-player/constants.ts`：
- 音频文件: `public/assets/music/url/`
- 封面图片: `public/assets/music/cover/`
- 使用 `getAssetPath()` 函数自动添加 `/` 前缀

### i18n System

翻译文件在 `src/i18n/languages/`：
- `zh_CN.ts`, `en.ts`, `ja.ts`, `zh_TW.ts`
- 添加新语言：创建翻译文件 → 在 `src/i18n/translation.ts` 中注册
- 翻译 key 定义在 `src/i18n/i18nKey.ts`

## Markdown Plugin Chain

文章渲染管线（`astro.config.mjs`）：

**remark**: math → content → fix-github-admonitions → directive → sectionize → directive-rehype → mermaid
**rehype**: katex → external-links → slug → wrap-table → mermaid → components(admonition/github-card) → autolink-headings → image-width

自定义组件通过 `::github{repo="user/repo"}` 和 `> [!NOTE]` 等指令语法注入。

## Build Pipeline

`pnpm build` 执行完整流水线：
1. `scripts/update-anime.mjs` — 更新追番数据
2. `astro build` — 静态站点生成
3. `pagefind --site dist` — 生成搜索索引
4. `scripts/compress-fonts/index.js` — 字体子集压缩

Vite 优化配置（开发环境）：
- `optimizeDeps.include` 预编译常用依赖（iconify, svelte, overlayscrollbars 等）
- `server.warmup.clientFiles` 预热关键入口文件
- 生产环境通过 esbuild 移除 `console.log` 和 `debugger`
- `assetsInlineLimit: 4096` 防止小图片转 base64 导致 HTML 体积过大

## CI/CD

- `.github/workflows/deploy.yml` — 自动部署
- `.github/workflows/lint.yml` — PR lint 检查
- 部署平台：Vercel（`vercel.json` 配置安全头 + `/_astro/` 长缓存 + cleanUrls）

## Content Sync（代码/内容分离）

通过 `ENABLE_CONTENT_SYNC=true` 启用，从独立 Git 仓库同步内容到 `CONTENT_DIR`：
- `pnpm sync-content` — 手动同步
- `predev` / `prebuild` 自动执行同步（失败不阻断）
- `pnpm init-content` — 初始化内容仓库

## Common Issues

1. **Windows spawn 错误**: 设置 `ASTRO_DEV_BACKGROUND=1`
2. **中文引号导致解析错误**: 使用「」代替""
3. **图片路径**: `src/assets/` 下的图片用 Mizuki 的 `<Image>` 组件；`public/` 下的直接用 `<img src="/...">`
4. **导航栏链接位置**: 修改 `src/components/organisms/navigation/Navbar.astro` 中的 CSS 类
5. **侧边栏显示断点**: 修改 `src/utils/grid-layout-utils.ts` 中的 Tailwind 断点前缀（lg/md/sm）
6. **页面宽度**: 修改 `src/constants/constants.ts` 中的 `PAGE_WIDTH`
7. **pnpm 强制要求**: 项目 `preinstall` 脚本会检查是否使用 pnpm，npm/yarn 会被拒绝

## Project-specific Notes

### `.文档/` 目录
项目根目录下的 `.文档/` 文件夹用于存放：
- 原始数据备份（projects.ts, skills.ts, timeline.ts）
- 更新日志（如 `2026-07-02-更新记录.md`）
- 待办事项（`待办.md`）
- 参考图片等资源

### 导航栏滚动行为
顶栏（navbar）的滚动收起逻辑分布在两个文件：
- `src/components/organisms/navigation/Navbar.astro`：`initSemifullScrollDetection()` 管理 `scrolled` class（毛玻璃效果，50px 阈值）
- `src/scripts/handlers/back-to-top-handler.ts`：`updateNavbarVisibility()` 管理 `navbar-hidden` class（完全隐藏，20% 视口高度阈值）

CSS 变量驱动：`wallpaper-navbar-transparent.css` 中 `#navbar > div` 的 `background` 等属性由 `--nav-bg` 等 CSS 变量控制，修改变量即可切换透明/毛玻璃状态。
