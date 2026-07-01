# 顶栏毛玻璃与侧栏点击失效修复记录

## 背景

这次处理了两个相关问题：

1. 页面在左右侧栏同时出现时，左侧栏按钮刷新后短时间可点击，约 1 秒后全部无法点击。
2. 右上角顶栏需要恢复并加强毛玻璃效果，同时让左侧 `Mouy` 图标独立靠左并放大。

## 点击失效的根因

左侧栏失效不是由毛玻璃 CSS 本身直接导致，而是由 Pio/Live2D 看板娘 iframe 造成的。

相关组件：

- `src/components/features/pio/Pio.astro`

该组件会渲染一个固定定位的 iframe：

- `#l2d-iframe`
- `src="/pio/live2d-host.html"`

它初始化时使用 `pointer-events: none`，所以页面刚刷新时左侧栏还能点击。模型加载完成后，组件逻辑会把 iframe 的 `pointer-events` 改成 `auto`，iframe 的覆盖区域开始接管鼠标事件，因此左侧栏按钮表现为“过了一秒以后全部无法点击”。

这个时间特征和实际现象一致。

## 点击失效修复

按要求“直接去除这个吧”，当前处理方式是通过配置禁用 Pio：

- `src/config/pioConfig.ts`

关键改动：

```ts
export const pioConfig: PioConfig = {
  enable: false,
}
```

说明：

- Pio 组件源码仍保留，方便以后需要时再恢复。
- 当前构建产物不会再渲染 `#l2d-iframe`。
- 这能避免 iframe 在模型加载完成后重新抢占点击事件。

## 顶栏结构调整

为了实现“右上角毛玻璃顶栏 + 左侧 Mouy 单独靠左放大”，导航结构做了拆分。

相关文件：

- `src/components/organisms/navigation/Navbar.astro`
- `src/layouts/MainGridLayout.astro`
- `src/styles/wallpaper-navbar-transparent.css`

### 结构变化

`Navbar.astro` 中新增右侧容器：

```html
<div id="navbar-action-bar" class="flex items-center gap-1">
  ...
</div>
```

现在导航被分成两块：

- 左侧：`.navbar-title-link`，只负责 `Mouy` 品牌入口。
- 右侧：`#navbar-action-bar`，负责导航链接、搜索、移动端菜单按钮、主题切换等操作按钮。

这样毛玻璃效果只作用在右侧按钮组，不会把整条顶栏变成一个大面积可点击覆盖层。

## 毛玻璃样式实现

毛玻璃样式集中放在：

- `src/styles/wallpaper-navbar-transparent.css`

桌面端核心策略：

```css
@media (min-width: 768px) {
  #top-row,
  #navbar-wrapper,
  #navbar-wrapper #navbar {
    pointer-events: none;
  }

  #navbar-wrapper #navbar .navbar-title-link,
  #navbar-wrapper #navbar-action-bar {
    pointer-events: auto;
  }
}
```

这样做的目的：

- 顶层导航布局容器不拦截页面点击。
- 只有 `Mouy` 品牌按钮和右上角玻璃按钮组可以接收点击。
- 左侧栏、正文、右侧栏不会被透明的顶栏区域挡住。

右侧毛玻璃容器使用了更明显的效果：

```css
#navbar-wrapper #navbar-action-bar {
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 1rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.34)),
    rgba(255, 255, 255, 0.32);
  -webkit-backdrop-filter: blur(28px) saturate(1.75) contrast(1.05);
  backdrop-filter: blur(28px) saturate(1.75) contrast(1.05);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    inset 0 -1px 0 rgba(255, 255, 255, 0.18);
}
```

同时提供了深色模式适配：

```css
:root.dark #navbar-wrapper #navbar-action-bar {
  border-color: rgba(255, 255, 255, 0.16);
  background:
    linear-gradient(135deg, rgba(42, 44, 52, 0.78), rgba(16, 18, 24, 0.48)),
    rgba(20, 22, 28, 0.42);
}
```

## Mouy 品牌区调整

`Mouy` 品牌入口不再放进右侧玻璃条里，而是单独靠左显示。

桌面端样式：

```css
#navbar-wrapper #navbar .navbar-title-link {
  height: 3.75rem;
  padding-left: 0.75rem;
  padding-right: 1rem;
  border-radius: 1rem;
  pointer-events: auto;
}

#navbar-wrapper #navbar .navbar-title-link img {
  width: 2.6rem;
  height: 2.6rem;
}

#navbar-wrapper #navbar .navbar-title-link span {
  font-size: 1.35rem;
  line-height: 1;
}
```

效果：

- `Mouy` 靠左。
- 图标单独放大。
- 文本同步放大。
- 点击区域仍然只限品牌按钮自身，不会覆盖左侧栏。

## 相关文件清单

本次相关改动主要涉及：

- `src/config/pioConfig.ts`
  - 禁用 Pio，避免 Live2D iframe 抢占点击事件。
- `src/components/organisms/navigation/Navbar.astro`
  - 新增 `#navbar-action-bar`，拆分品牌区和右侧操作区。
- `src/layouts/MainGridLayout.astro`
  - 使用 `compactSearch={true}`。
  - 调整主内容点击事件承接位置。
- `src/styles/wallpaper-navbar-transparent.css`
  - 右侧毛玻璃样式。
  - 左侧品牌放大样式。
  - 顶栏容器点击穿透策略。

## 验证记录

已执行：

```bash
pnpm build
```

结果：

- Astro 构建通过。
- Pagefind 构建完成。
- 字体压缩流程完成。

已检查构建产物：

```bash
rg -n "navbar-action-bar|l2d-iframe|live2d-host" dist -S
```

结果：

- `navbar-action-bar` 已出现在构建后的页面中。
- 构建产物中未找到 `l2d-iframe`。
- 构建产物中未找到 `live2d-host`。

补充说明：

- 曾启动静态预览服务 `http://127.0.0.1:8088/` 用于页面检查。
- 浏览器命中测试在中途被打断，未形成完整自动化报告。
- 已完成的构建与产物搜索能确认 Pio iframe 不再进入页面，右侧玻璃顶栏结构已进入产物。

## 后续注意事项

如果以后重新启用 Pio，需要重点检查：

1. iframe 的尺寸和定位是否覆盖侧栏。
2. `pointer-events` 是否会在模型加载后从 `none` 改回 `auto`。
3. 是否只允许模型可见区域接收点击，而不是整个 iframe 接收点击。

如果以后继续改顶栏，需要保持这个原则：

1. 大范围定位容器使用 `pointer-events: none`。
2. 只有真实按钮、链接、菜单面板使用 `pointer-events: auto`。
3. 毛玻璃背景尽量挂在小范围视觉容器上，例如 `#navbar-action-bar`，不要挂在全宽顶栏容器上。

这样能保留毛玻璃效果，同时避免透明层挡住侧栏和正文内容。

---

## 更新记录

### 2026-07-01：桌面背景图替换 + Banner 文字自动适配

#### 背景

将桌面端 Banner 背景图从 4 张 webp 轮播替换为单张 `背景.png`（来源：Mou-Two/assets），并解决浅色背景导致白色文字不可见的问题。

#### 改动

**1. 桌面背景图替换**

涉及文件：

- `src/config/siteConfig.ts`
  - `banner.src.desktop` 从 4 张 webp 改为单张 `/assets/desktop-banner/背景.png`。
  - `banner.carousel.enable` 设为 `false`。
- `src/config/backgroundWallpaper.ts`
  - `src.desktop` 同步改为单张 `背景.png`。
  - `carousel.enable` 设为 `false`。
- `public/assets/desktop-banner/`
  - 删除旧的 `1.webp` ~ `4.webp`。
  - 新增 `背景.png`（1440×592 PNG RGBA）。

移动端 4 张 mobile-banner 保持不变。

**2. Banner 文字自动亮度检测**

问题：Banner 文字硬编码为 `text-white`，浅色背景图下文字不可见。

解决方案：在 `Banner.astro` 中新增 Canvas 亮度检测脚本，自动根据图片明暗切换文字颜色。

涉及文件：

- `src/components/layout/Banner.astro`

新增逻辑：

```js
// 图片加载后用 Canvas 采样像素，计算平均亮度
function getBrightness(img) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  // 缩小到 100×100 采样，避免性能问题
  var w = (canvas.width = Math.min(img.naturalWidth, 100));
  var h = (canvas.height = Math.min(img.naturalHeight, 100));
  ctx.drawImage(img, 0, 0, w, h);
  var data = ctx.getImageData(0, 0, w, h).data;
  var sum = 0;
  for (var i = 0; i < data.length; i += 4) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return sum / (data.length / 4) / 255;
}
```

亮度判断：

- \> 0.55 → `banner-light` class → 深色文字（`#1f2937`）+ 白色阴影
- ≤ 0.55 → `banner-dark` class → 白色文字 + 黑色阴影

CSS 规则：

```css
/* 浅色背景 → 深字 */
.banner-light .banner-title { color: #1f2937; text-shadow: 1px 1px 3px rgba(255,255,255,0.8); }
.banner-light .banner-subtitle { color: rgba(31,41,55,0.9); }
.banner-light #page-overlay-title { color: #1f2937; }
.banner-light #page-overlay-meta { color: rgba(55,65,81,0.8); }
.banner-light #banner-credit { color: rgba(55,65,81,0.75); }

/* 深色背景 → 白字 */
.banner-dark .banner-title,
.banner-dark .banner-subtitle,
.banner-dark #page-overlay-title { color: white; }
```

触发时机：

- 图片 `load` 事件完成后检测
- Swup 页面切换后 100ms 重新检测
- 窗口缩放 200ms 防抖后重新检测（适配桌面/移动端图片切换）

### 2026-07-01：底部备案信息垂直对齐修复

#### 问题

页脚备案信息中，「粤ICP备2026081944号」和「粤公网安备44011402001354号」垂直对齐不一致，公安备案链接因包含 `<img>` 标签导致行高偏移。

#### 改动

涉及文件：

- `src/config/footerConfig.ts`
  - 用 `<span class="inline-flex items-center gap-2">` 包裹两个备案链接，强制垂直居中对齐。

修改前：

```html
<a>粤ICP备2026081944号</a> | <a class="inline-flex items-center gap-1"><img ...>粤公网安备44011402001354号</a>
```

修改后：

```html
<span class="inline-flex items-center gap-2">
  <a>粤ICP备2026081944号</a> |
  <a class="inline-flex items-center gap-1"><img ...>粤公网安备44011402001354号</a>
</span>
```

原理：外层 `inline-flex items-center` 确保两个链接作为 flex 子项在同一行内垂直居中，无论是否包含图片都能保持高度一致。
