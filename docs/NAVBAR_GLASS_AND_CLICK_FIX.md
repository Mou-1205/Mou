# 顶栏 Liquid Glass 与侧栏点击失效修复记录

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

## 当前 Liquid Glass 结构

本轮在已有品牌区与操作区拆分的基础上，加入统一的响应式玻璃结构：

```html
<div class="navbar-shell navbar-glass-surface">
  <a class="navbar-title-link navbar-glass-surface">...</a>
  <div id="navbar-action-bar" class="navbar-glass-surface">...</div>
</div>
```

- `.navbar-shell`：控制顶栏宽度、留白、响应式布局和移动端统一材质。
- `.navbar-title-link`：桌面端独立的 `Mouy` 品牌胶囊。
- `#navbar-action-bar`：桌面端独立的导航与工具胶囊。
- `.navbar-glass-surface`：共享 Liquid Glass 材质、边缘高光和指针高光能力。

桌面端外层 `.navbar-shell` 只负责布局，不绘制材质；品牌区和操作区分别形成两个小面积玻璃胶囊。移动端则只让 `.navbar-shell` 绘制统一玻璃，内部两个区域移除重复模糊、边框与阴影，避免层层叠加导致浑浊和空间拥挤。

## Liquid Glass 视觉实现

当前样式统一位于：

- `src/styles/navbar-liquid-glass.css`

旧样式文件已经移除：

- `src/styles/mobile-navbar.css`
- `src/styles/wallpaper-navbar-transparent.css`

`src/layouts/Layout.astro` 只全局引入 `navbar-liquid-glass.css`。后续不要恢复旧文件，否则移动端和桌面端容易出现重复边框、透明度冲突与选择器覆盖。

### 材质层级

- `--nav-glass-fill-*`：控制玻璃底色渐变，浅色和深色主题分别定义。
- `backdrop-filter`：使用模糊、饱和度和轻微对比度让底层内容自然透出。
- `--nav-glass-border`、`--nav-glass-edge`：表现玻璃边缘和顶部受光面。
- `--nav-glass-shadow`：外部投影与内部高光共同建立厚度，避免只靠高模糊制造“白雾”。
- `--nav-panel-*`：让搜索、菜单、目录和设置面板保持同一材质体系，但使用更强的分层阴影。
- `.scrolled`：页面滚过 50px 后提高玻璃不透明度和阴影，使顶栏在正文上方仍保持可读性。

透明模式通过 `#navbar[data-transparent-mode]` 参与变量覆盖，不再依赖旧的 `--nav-bg`、`--nav-blur` 变量。

### 指针与聚焦高光

`Navbar.astro` 会监听 `.navbar-glass-surface` 的 `pointermove`、`pointerdown`、`pointerleave` 与 `focusin`：

- 将交互坐标换算为 `--nav-glass-x` / `--nav-glass-y`。
- 使用 `requestAnimationFrame` 合并连续移动事件，避免每个事件都直接触发布局与绘制。
- 鼠标离开后把高光恢复到顶部中央。
- 键盘聚焦时把高光放到材质中央，让非指针用户也能得到明确反馈。
- 使用 `AbortController` 清理旧监听器，并在 `astro:page-load` 与 `swup:page:view` 后重新初始化，兼容 HMR 与页面切换而不重复绑定。

### Apple 风格交互原则

实现依据 `apple-design` Skill 的核心原则：

1. **即时反馈**：按钮在按下阶段直接缩放到 `0.96`，不等待点击结束。
2. **克制动效**：只过渡颜色、透明度、阴影和变换，避免 `transition-all` 带来不可控动画。
3. **空间一致**：桌面端保留清晰的品牌/操作分组，移动端合并为单一容器，避免同一视觉层级使用两套结构。
4. **材质服务内容**：透明度和模糊用于建立上下层关系，不牺牲文字与图标可读性。
5. **完整回退**：减少动效、减少透明度、高对比度、强制颜色以及浏览器不支持 `backdrop-filter` 时，都有明确的非透明或低动效方案。

## 点击区域与事件穿透

桌面端继续使用小范围事件承接：

```css
#top-row,
#navbar-wrapper,
#navbar,
.navbar-shell {
  pointer-events: none;
}

.navbar-title-link,
#navbar-action-bar,
#navbar :is(.dropdown-content, .float-panel) {
  pointer-events: auto;
}
```

移动端 `.navbar-shell` 本身恢复 `pointer-events: auto`，因为它就是完整的可见导航容器。该策略保证透明定位层不会挡住侧栏和正文，同时菜单与浮层仍能正常操作。

## 相关文件清单

- `src/config/pioConfig.ts`
  - 保持 Pio 禁用，避免 Live2D iframe 抢占点击事件。
- `src/components/organisms/navigation/Navbar.astro`
  - 增加 `.navbar-shell` / `.navbar-glass-surface` 结构、指针高光和 HMR/Swup 生命周期管理。
  - 保留 `#navbar-action-bar`，桌面端拆分品牌区与操作区。
- `src/components/control/ThemeSwitch.svelte`
  - 按压缩放统一为 `0.96`，并将 `transition-all` 收敛到 `opacity` 与 `transform`。
- `src/layouts/Layout.astro`
  - 引入 `src/styles/navbar-liquid-glass.css`，移除旧导航样式入口。
- `src/styles/navbar-liquid-glass.css`
  - 统一桌面端、移动端、深浅主题、滚动态、菜单面板和无障碍回退的 Liquid Glass 样式。
- `src/styles/mobile-navbar.css`
  - 已删除，被统一样式替代。
- `src/styles/wallpaper-navbar-transparent.css`
  - 已删除，被统一样式替代。

## 验证记录

当前开发服务：

- 热更新地址：`http://127.0.0.1:4321/`
- HTTP 状态：`200`

已完成浏览器检查：

- 桌面端 `1280 × 720` 与移动端 `390 × 844`。
- 浅色和深色主题。
- 导航下拉、搜索/设置浮层定位与移动菜单。
- 滚动后的 `.scrolled` 材质增强和 `navbar-hidden` 显隐。
- 指针跟随高光、按下反馈和键盘焦点。
- `prefers-reduced-motion` 与 `prefers-reduced-transparency`。

已完成代码检查：

- 本次修改涉及的 Astro/Svelte 文件通过 Biome 检查。
- `pnpm astro check` 当前仍报告 17 个项目原有错误，主要位于 `SidebarNav.astro`、`sidebarConfig.ts`、`liquid-glass-interactions.ts` 与 `anime-data.ts`；本次 Navbar 相关类型问题已处理，不在本轮修复无关错误。

## 后续注意事项

如果以后重新启用 Pio，需要重点检查：

1. iframe 的尺寸和定位是否覆盖侧栏。
2. `pointer-events` 是否会在模型加载后从 `none` 改回 `auto`。
3. 是否只允许模型可见区域接收点击，而不是整个 iframe 接收点击。

如果以后继续修改顶栏，需要保持以下原则：

1. 样式只维护在 `navbar-liquid-glass.css`，不要恢复两个已删除的旧导航样式文件。
2. 桌面端全宽定位与布局容器不接收点击，只让真实按钮、链接和菜单面板接收事件。
3. 移动端只使用一层主要玻璃材质，避免子容器重复模糊和阴影。
4. 交互反馈从按下阶段开始，保持短促、可打断，并避免宽泛的 `transition-all`。
5. 修改玻璃变量或动画时，同步验证深色模式、滚动态、键盘焦点与辅助功能媒体查询。

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
