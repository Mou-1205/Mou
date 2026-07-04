/**
 * Liquid Glass Phase 4 — 高级特性脚本
 * 功能：3D 透视光感（鼠标追踪 + 陀螺仪）、背景延伸、折射纹理追踪
 * 依赖 Phase 1 的 CSS 变量系统
 *
 * 生命周期由 SwupManager 统一管理，本模块不自行初始化。
 */

/* ==========================================================================
   常量与配置
   ========================================================================== */

const ADVANCED_CONFIG = {
  /** 3D 旋转最大角度（度） */
  maxRotateDeg: 12,
  /** 鼠标追踪节流间隔（ms） */
  throttleMs: 16,
  /** 陀螺仪灵敏度系数 */
  gyroSensitivity: 0.5,
  /** 折射纹理位移范围（px） */
  refractShiftRange: 15,
  /** 重置动画时长（ms） */
  resetDuration: 300,
} as const;

/* ==========================================================================
   工具函数
   ========================================================================== */

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function prefersReducedTransparency(): boolean {
  return window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
}

/** 节流函数 */
function throttle<T extends (...args: never[]) => void>(
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

/** 角度转弧度 */
function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/* ==========================================================================
   3D 透视光感 — 鼠标追踪
   为 .glass-3d / .glass-3d-refraction 元素设置 3D 旋转和光照角度
   ========================================================================== */

function update3DTransform(el: HTMLElement, e: MouseEvent): void {
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  const rotateY = x * ADVANCED_CONFIG.maxRotateDeg * 2;
  const rotateX = -y * ADVANCED_CONFIG.maxRotateDeg * 2;
  const lightAngle = toDegrees(Math.atan2(y, x)) + 135;

  el.style.setProperty("--rotate-y", `${rotateY}deg`);
  el.style.setProperty("--rotate-x", `${rotateX}deg`);
  el.style.setProperty("--light-angle", `${lightAngle}deg`);
}

function reset3DTransform(el: HTMLElement): void {
  el.style.setProperty("--rotate-y", "0deg");
  el.style.setProperty("--rotate-x", "0deg");
  el.style.setProperty("--light-angle", "135deg");
}

function init3DTrackingForElement(el: HTMLElement): void {
  if (el.dataset.glass3dInit) return;
  el.dataset.glass3dInit = "true";

  const throttledUpdate = throttle((e: MouseEvent) => {
    update3DTransform(el, e);
  }, ADVANCED_CONFIG.throttleMs);

  el.addEventListener("mousemove", throttledUpdate, { passive: true });

  el.addEventListener("mouseleave", () => {
    reset3DTransform(el);
  }, { passive: true });
}

function init3DTracking(): void {
  const selectors = ".glass-3d, .glass-3d-refraction";
  const elements = document.querySelectorAll<HTMLElement>(selectors);
  elements.forEach(init3DTrackingForElement);
}

/* ==========================================================================
   陀螺仪支持 — 移动端 3D 效果
   ========================================================================== */

let gyroActive = false;

function handleDeviceOrientation(e: DeviceOrientationEvent): void {
  if (e.gamma === null || e.beta === null) return;

  const rotateY = e.gamma * ADVANCED_CONFIG.gyroSensitivity;
  const rotateX = (e.beta - 45) * ADVANCED_CONFIG.gyroSensitivity;

  document.documentElement.style.setProperty("--rotate-y", `${rotateY}deg`);
  document.documentElement.style.setProperty("--rotate-x", `${rotateX}deg`);
}

function initGyroscope(): void {
  if (!("DeviceOrientationEvent" in window)) return;

  // iOS 13+ 需要请求权限
  const requestPermission = async (): Promise<boolean> => {
    try {
      const DeviceOrientationEventCtor = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DeviceOrientationEventCtor.requestPermission === "function") {
        const result = await DeviceOrientationEventCtor.requestPermission();
        return result === "granted";
      }
      return true;
    } catch {
      return false;
    }
  };

  // 在用户交互后请求权限（iOS 要求）
  const initOnInteraction = async (): Promise<void> => {
    const granted = await requestPermission();
    if (granted) {
      window.addEventListener("deviceorientation", handleDeviceOrientation, {
        passive: true,
      });
      gyroActive = true;
    }
    // 只需要请求一次
    document.removeEventListener("touchstart", initOnInteraction);
    document.removeEventListener("click", initOnInteraction);
  };

  // 检测是否需要权限请求
  const DeviceOrientationEventCtor = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };
  if (typeof DeviceOrientationEventCtor.requestPermission === "function") {
    // iOS 13+ — 等待用户交互
    document.addEventListener("touchstart", initOnInteraction, { once: true, passive: true });
    document.addEventListener("click", initOnInteraction, { once: true, passive: true });
  } else {
    // 其他设备 — 直接监听
    window.addEventListener("deviceorientation", handleDeviceOrientation, {
      passive: true,
    });
    gyroActive = true;
  }
}

function destroyGyroscope(): void {
  window.removeEventListener("deviceorientation", handleDeviceOrientation);
  gyroActive = false;
  document.documentElement.style.removeProperty("--rotate-y");
  document.documentElement.style.removeProperty("--rotate-x");
}

/* ==========================================================================
   折射纹理追踪 — 鼠标移动驱动折射偏移
   ========================================================================== */

const refractHandler = throttle((e: MouseEvent) => {
  const x =
    (e.clientX / window.innerWidth - 0.5) *
    ADVANCED_CONFIG.refractShiftRange *
    2;
  const y =
    (e.clientY / window.innerHeight - 0.5) *
    ADVANCED_CONFIG.refractShiftRange *
    2;
  document.documentElement.style.setProperty("--refract-x", `${x}px`);
  document.documentElement.style.setProperty("--refract-y", `${y}px`);
}, ADVANCED_CONFIG.throttleMs);

function initRefractionTracking(): void {
  document.addEventListener("mousemove", refractHandler, { passive: true });
}

function destroyRefractionTracking(): void {
  document.removeEventListener("mousemove", refractHandler);
  document.documentElement.style.removeProperty("--refract-x");
  document.documentElement.style.removeProperty("--refract-y");
}

/* ==========================================================================
   侧栏宽度检测 — 驱动背景延伸效果
   ========================================================================== */

let sidebarResizeObserver: ResizeObserver | null = null;

function updateSidebarWidth(): void {
  // 检测左侧栏
  const leftSidebar = document.querySelector<HTMLElement>(
    ".sidebar-column-root",
  );
  // 检测右侧栏
  const rightSidebar = document.querySelector<HTMLElement>("#right-sidebar");

  let totalWidth = 0;
  if (leftSidebar) {
    totalWidth += leftSidebar.getBoundingClientRect().width;
  }
  if (rightSidebar) {
    totalWidth += rightSidebar.getBoundingClientRect().width;
  }

  document.documentElement.style.setProperty(
    "--sidebar-width",
    `${totalWidth}px`,
  );
}

function initSidebarWidthDetection(): void {
  updateSidebarWidth();

  sidebarResizeObserver = new ResizeObserver(() => {
    updateSidebarWidth();
  });

  const leftSidebar = document.querySelector(".sidebar-column-root");
  const rightSidebar = document.querySelector("#right-sidebar");

  if (leftSidebar) sidebarResizeObserver.observe(leftSidebar);
  if (rightSidebar) sidebarResizeObserver.observe(rightSidebar);

  // 也监听窗口大小变化
  window.addEventListener("resize", updateSidebarWidth, { passive: true });
}

function destroySidebarWidthDetection(): void {
  if (sidebarResizeObserver) {
    sidebarResizeObserver.disconnect();
    sidebarResizeObserver = null;
  }
  window.removeEventListener("resize", updateSidebarWidth);
  document.documentElement.style.removeProperty("--sidebar-width");
}

/* ==========================================================================
   折射纹理生成 — 运行时生成 fallback 纹理
   ========================================================================== */

function generateRefractionTexture(): string {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 生成折射光斑纹理
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // 多层叠加的正弦波模拟折射
      const v1 = Math.sin((x / size) * Math.PI * 4) * 0.3;
      const v2 = Math.sin((y / size) * Math.PI * 3) * 0.3;
      const v3 =
        Math.sin(((x + y) / size) * Math.PI * 2) * 0.2;
      const v4 =
        Math.sin(((x - y) / size) * Math.PI * 5) * 0.15;

      const value = Math.floor(((v1 + v2 + v3 + v4 + 1) / 2) * 255);

      data[idx] = value; // R
      data[idx + 1] = value; // G
      data[idx + 2] = value; // B
      data[idx + 3] = Math.floor(255 * 0.6); // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/webp", 0.8);
}

function applyFallbackRefraction(): void {
  // 检查 refraction.webp 是否存在，不存在则用生成的纹理
  const testImg = new Image();
  testImg.onload = () => {
    // 图片存在，不需要 fallback
  };
  testImg.onerror = () => {
    // 图片不存在，应用运行时生成的纹理
    const dataUrl = generateRefractionTexture();
    if (!dataUrl) return;

    const style = document.createElement("style");
    style.textContent = `
      .glass-refraction::after,
      .glass-3d-refraction::after {
        background-image: url("${dataUrl}") !important;
      }
    `;
    style.setAttribute("data-glass-refraction-fallback", "true");
    document.head.appendChild(style);
  };
  testImg.src = "/textures/refraction.svg";
}

/* ==========================================================================
   公共初始化入口（由 SwupManager 调用，不自行启动）
   ========================================================================== */

function initAllAdvancedEffects(): void {
  if (prefersReducedMotion() && prefersReducedTransparency()) return;

  // 3D 追踪需要鼠标交互，不受 reduced-motion 完全限制
  // 但会在 CSS 中通过 media query 禁用 transform
  if (!prefersReducedMotion()) {
    init3DTracking();
    initGyroscope();
    initRefractionTracking();
  }

  initSidebarWidthDetection();
  applyFallbackRefraction();
}

function destroyAllAdvancedEffects(): void {
  destroyGyroscope();
  destroyRefractionTracking();
  destroySidebarWidthDetection();

  // 清除所有 3D 元素的内联样式
  const elements = document.querySelectorAll<HTMLElement>(
    "[data-glass-3d-init]",
  );
  elements.forEach((el) => {
    el.style.removeProperty("--rotate-y");
    el.style.removeProperty("--rotate-x");
    el.style.removeProperty("--light-angle");
    delete el.dataset.glass3dInit;
  });

  // 移除 fallback 样式
  const fallbackStyle = document.querySelector(
    "[data-glass-refraction-fallback]",
  );
  if (fallbackStyle) fallbackStyle.remove();
}

export {
  initAllAdvancedEffects,
  destroyAllAdvancedEffects,
  init3DTracking,
  initGyroscope,
  initRefractionTracking,
  initSidebarWidthDetection,
};
