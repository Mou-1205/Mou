/**
 * Liquid Glass Phase 3 — 流体效果脚本
 * 功能：SVG feTurbulence 动态控制、Canvas 粒子流体系统
 * 依赖 Phase 1 的 CSS 变量系统
 *
 * 生命周期由 SwupManager 统一管理，本模块不自行初始化。
 */

/* ==========================================================================
   常量与配置
   ========================================================================== */

const PARTICLE_CONFIG = {
  count: 80,
  maxSpeed: 2,
  mouseForce: 0.008,
  damping: 0.96,
  connectionDistance: 120,
  particleRadius: 2,
  lineWidth: 0.6,
  colorLight: "rgba(120, 100, 80, 0.4)",
  colorDark: "rgba(200, 180, 160, 0.3)",
  lineColorLight: "rgba(120, 100, 80, 0.12)",
  lineColorDark: "rgba(200, 180, 160, 0.08)",
} as const;

const SVG_FILTER_ID = "fluid-distortion";
const SVG_FILTER_HOVER_ID = "fluid-distortion-hover";

/* ==========================================================================
   工具函数
   ========================================================================== */

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark");
}

/** 从 CSS 变量读取流体效果配置 */
function readFluidCSSConfig(): { duration: string; scale: string } {
  const styles = getComputedStyle(document.documentElement);
  return {
    duration: styles.getPropertyValue("--fluid-caustics-duration").trim() || "8s",
    scale: styles.getPropertyValue("--fluid-distortion-scale").trim() || "20",
  };
}

/* ==========================================================================
   SVG feTurbulence 滤镜管理
   ========================================================================== */

/** 构建基础流体扭曲滤镜 */
function buildBaseFilter(svgNS: string, defs: SVGElement, config: { duration: string; scale: string }): void {
  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", SVG_FILTER_ID);
  filter.setAttribute("x", "-20%");
  filter.setAttribute("y", "-20%");
  filter.setAttribute("width", "140%");
  filter.setAttribute("height", "140%");

  const turbulence = document.createElementNS(svgNS, "feTurbulence");
  turbulence.setAttribute("type", "fractalNoise");
  turbulence.setAttribute("baseFrequency", "0.015");
  turbulence.setAttribute("numOctaves", "3");
  turbulence.setAttribute("result", "noise");
  turbulence.setAttribute("seed", "1");

  const animate = document.createElementNS(svgNS, "animate");
  animate.setAttribute("attributeName", "baseFrequency");
  animate.setAttribute("dur", config.duration);
  animate.setAttribute("values", "0.015;0.025;0.015");
  animate.setAttribute("repeatCount", "indefinite");
  turbulence.appendChild(animate);

  const displacement = document.createElementNS(svgNS, "feDisplacementMap");
  displacement.setAttribute("in", "SourceGraphic");
  displacement.setAttribute("in2", "noise");
  displacement.setAttribute("scale", config.scale);
  displacement.setAttribute("xChannelSelector", "R");
  displacement.setAttribute("yChannelSelector", "G");

  filter.appendChild(turbulence);
  filter.appendChild(displacement);
  defs.appendChild(filter);
}

/** 构建 Hover 增强滤镜 */
function buildHoverFilter(svgNS: string, defs: SVGElement, config: { duration: string; scale: string }): void {
  const filterHover = document.createElementNS(svgNS, "filter");
  filterHover.setAttribute("id", SVG_FILTER_HOVER_ID);
  filterHover.setAttribute("x", "-20%");
  filterHover.setAttribute("y", "-20%");
  filterHover.setAttribute("width", "140%");
  filterHover.setAttribute("height", "140%");

  const turbulenceHover = document.createElementNS(svgNS, "feTurbulence");
  turbulenceHover.setAttribute("type", "fractalNoise");
  turbulenceHover.setAttribute("baseFrequency", "0.02");
  turbulenceHover.setAttribute("numOctaves", "3");
  turbulenceHover.setAttribute("result", "noise");
  turbulenceHover.setAttribute("seed", "2");

  const animateHover = document.createElementNS(svgNS, "animate");
  animateHover.setAttribute("attributeName", "baseFrequency");
  animateHover.setAttribute("dur", config.duration);
  animateHover.setAttribute("values", "0.02;0.03;0.02");
  animateHover.setAttribute("repeatCount", "indefinite");
  turbulenceHover.appendChild(animateHover);

  const displacementHover = document.createElementNS(svgNS, "feDisplacementMap");
  displacementHover.setAttribute("in", "SourceGraphic");
  displacementHover.setAttribute("in2", "noise");
  displacementHover.setAttribute("scale", String(Number(config.scale) * 1.5));
  displacementHover.setAttribute("xChannelSelector", "R");
  displacementHover.setAttribute("yChannelSelector", "G");

  filterHover.appendChild(turbulenceHover);
  filterHover.appendChild(displacementHover);
  defs.appendChild(filterHover);
}

/** 创建 SVG 滤镜元素并注入到 DOM */
function createSVGFilters(): void {
  if (document.getElementById(`svg-filter-${SVG_FILTER_ID}`)) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("id", `svg-filter-${SVG_FILTER_ID}`);
  svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
  svg.setAttribute("aria-hidden", "true");

  const defs = document.createElementNS(svgNS, "defs");
  const config = readFluidCSSConfig();

  buildBaseFilter(svgNS, defs, config);
  buildHoverFilter(svgNS, defs, config);

  svg.appendChild(defs);
  document.body.appendChild(svg);
}

/** 移除 SVG 滤镜 */
function removeSVGFilters(): void {
  const svg = document.getElementById(`svg-filter-${SVG_FILTER_ID}`);
  if (svg) {
    svg.remove();
  }
}

/* ==========================================================================
   Canvas 粒子系统
   ========================================================================== */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

class FluidParticles {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: -1000, y: -1000 }; // 初始化在画布外，避免粒子聚集
  private mouseActive = false; // 标记鼠标是否移动过
  private animationId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private isActive = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context not available");
    }
    this.ctx = ctx;
  }

  /** 初始化粒子系统 */
  init(): void {
    if (prefersReducedMotion()) return;

    this.resize();
    this.createParticles();
    this.bindEvents();
    this.isActive = true;
    this.animate();
  }

  /** 调整 canvas 尺寸 */
  private resize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.scale(dpr, dpr);

    // 不重置鼠标位置，避免粒子聚集
  }

  /** 创建粒子 */
  private createParticles(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    this.particles = [];
    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
      this.particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * PARTICLE_CONFIG.maxSpeed,
        vy: (Math.random() - 0.5) * PARTICLE_CONFIG.maxSpeed,
        radius: PARTICLE_CONFIG.particleRadius + Math.random() * 1.5,
      });
    }
  }

  /** 绑定事件 */
  private bindEvents(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    this.mouseMoveHandler = (e: MouseEvent) => {
      const rect = this.canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouseActive = true;
    };
    container.addEventListener("mousemove", this.mouseMoveHandler, { passive: true });

    // 鼠标离开时停用力
    container.addEventListener("mouseleave", () => {
      this.mouseActive = false;
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    }, { passive: true });

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.createParticles();
    });
    this.resizeObserver.observe(container);
  }

  /** 更新所有粒子的物理状态 */
  private updateParticles(width: number, height: number): void {
    for (const p of this.particles) {
      // 只在鼠标激活时应用鼠标力
      if (this.mouseActive) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        p.vx += dx * PARTICLE_CONFIG.mouseForce;
        p.vy += dy * PARTICLE_CONFIG.mouseForce;
      }

      p.vx *= PARTICLE_CONFIG.damping;
      p.vy *= PARTICLE_CONFIG.damping;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > PARTICLE_CONFIG.maxSpeed) {
        p.vx = (p.vx / speed) * PARTICLE_CONFIG.maxSpeed;
        p.vy = (p.vy / speed) * PARTICLE_CONFIG.maxSpeed;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) { p.x = 0; p.vx *= -0.8; }
      if (p.x > width) { p.x = width; p.vx *= -0.8; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.8; }
      if (p.y > height) { p.y = height; p.vy *= -0.8; }
    }
  }

  /** 绘制粒子之间的连线 */
  private drawConnections(dark: boolean): void {
    const lineColor = dark ? PARTICLE_CONFIG.lineColorDark : PARTICLE_CONFIG.lineColorLight;
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = PARTICLE_CONFIG.lineWidth;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < PARTICLE_CONFIG.connectionDistance) {
          this.ctx.globalAlpha = 1 - dist / PARTICLE_CONFIG.connectionDistance;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }

  /** 绘制粒子本体 */
  private drawParticles(dark: boolean): void {
    this.ctx.fillStyle = dark ? PARTICLE_CONFIG.colorDark : PARTICLE_CONFIG.colorLight;

    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /** 动画循环 */
  private animate(): void {
    if (!this.isActive) return;

    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (!rect) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }

    const dark = isDarkMode();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
    this.updateParticles(rect.width, rect.height);
    this.drawConnections(dark);
    this.drawParticles(dark);

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /** 销毁粒子系统 */
  destroy(): void {
    this.isActive = false;

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    const container = this.canvas.parentElement;
    if (container && this.mouseMoveHandler) {
      container.removeEventListener("mousemove", this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }

    this.particles = [];
  }
}

/* ==========================================================================
   公共初始化入口（由 SwupManager 调用，不自行启动）
   ========================================================================== */

const fluidInstances: FluidParticles[] = [];

/** 为所有 .fluid-canvas-container 元素初始化粒子系统 */
function initFluidParticles(): void {
  if (prefersReducedMotion()) return;

  const containers = document.querySelectorAll<HTMLElement>(".fluid-canvas-container");

  containers.forEach((container) => {
    if (container.dataset.fluidInit) return;
    container.dataset.fluidInit = "true";

    const canvas = document.createElement("canvas");
    container.prepend(canvas);

    const particles = new FluidParticles(canvas);
    particles.init();
    fluidInstances.push(particles);
  });
}

/** 初始化 SVG 滤镜 */
function initSVGFilters(): void {
  if (prefersReducedMotion()) return;
  createSVGFilters();
}

/** 初始化所有流体效果 */
function initAllFluidEffects(): void {
  initSVGFilters();
  initFluidParticles();
}

/** 销毁所有流体效果 */
function destroyAllFluidEffects(): void {
  removeSVGFilters();
  for (const instance of fluidInstances) {
    instance.destroy();
  }
  fluidInstances.length = 0;
}

export {
  initAllFluidEffects,
  destroyAllFluidEffects,
  initFluidParticles,
  initSVGFilters,
  FluidParticles,
};
