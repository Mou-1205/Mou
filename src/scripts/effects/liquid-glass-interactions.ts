/**
 * Liquid Glass Phase 2 — 交互增强脚本
 * 功能：鼠标追踪高光、滚动边缘效果
 * 依赖 Phase 1 的 CSS 变量系统
 */

/** 节流函数：限制调用频率到每 limit 毫秒最多一次 */
function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let waiting = false;
  return (...args: Parameters<T>) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, limit);
  };
}

/** 检查是否启用了减少动画偏好 */
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ==========================================================================
   鼠标追踪高光
   为 .glass-morph-button 元素设置 --mouse-x / --mouse-y CSS 变量
   ========================================================================== */

function updateMousePosition(el: HTMLElement, e: MouseEvent): void {
  const rect = el.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mouse-x", `${x}%`);
  el.style.setProperty("--mouse-y", `${y}%`);
}

function initMouseTrackingForElement(el: HTMLElement): void {
  if (el.dataset.glassMouseInit) return;
  el.dataset.glassMouseInit = "true";

  const handler = throttle((e: MouseEvent) => {
    updateMousePosition(el, e);
  }, 16);

  el.addEventListener("mousemove", handler, { passive: true });

  el.addEventListener("mouseenter", (e) => {
    updateMousePosition(el, e);
  }, { passive: true });
}

function initMouseTracking(): void {
  const buttons = document.querySelectorAll<HTMLElement>(".glass-morph-button");
  buttons.forEach(initMouseTrackingForElement);
}

/* ==========================================================================
   滚动边缘效果
   为 .scroll-container 元素设置 --scroll-top-fade / --scroll-bottom-fade
   ========================================================================== */

function updateScrollFades(el: HTMLElement): void {
  const { scrollTop, scrollHeight, clientHeight } = el;
  const fadeZone = 40;

  const topFade = Math.min(scrollTop / fadeZone, 1);
  const distanceFromBottom = scrollHeight - clientHeight - scrollTop;
  const bottomFade =
    scrollHeight <= clientHeight ? 0 : Math.min(distanceFromBottom / fadeZone, 1);

  el.style.setProperty("--scroll-top-fade", String(topFade));
  el.style.setProperty("--scroll-bottom-fade", String(bottomFade));
}

function initScrollEdgeForElement(el: HTMLElement): void {
  if (el.dataset.glassScrollInit) return;
  el.dataset.glassScrollInit = "true";

  const handler = throttle(() => {
    updateScrollFades(el);
  }, 16);

  el.addEventListener("scroll", handler, { passive: true });

  requestAnimationFrame(() => updateScrollFades(el));
}

function initScrollEdgeEffects(): void {
  const containers = document.querySelectorAll<HTMLElement>(".scroll-container");
  containers.forEach(initScrollEdgeForElement);
}

/* ==========================================================================
   公共初始化入口
   ========================================================================== */

function initAllInteractions(): void {
  if (prefersReducedMotion()) return;
  initMouseTracking();
  initScrollEdgeEffects();
}

/* ---- 生命周期由 SwupManager 统一管理，本模块不自行初始化 ---- */

export { initAllInteractions, initMouseTracking, initScrollEdgeEffects };
