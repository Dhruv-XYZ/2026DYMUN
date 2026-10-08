import { useEffect, useRef } from "react";

type DottedGlowBackgroundProps = {
  className?: string;
  /** distance between dot centers in pixels */
  gap?: number;
  /** base radius of each dot in CSS px */
  radius?: number;
  /** dot color (pulses by alpha) */
  color?: string;
  /** glow color for the brightest dots */
  glowColor?: string;
  /** global opacity for the whole layer */
  opacity?: number;
  /** minimum per-dot speed in rad/s */
  speedMin?: number;
  /** maximum per-dot speed in rad/s */
  speedMax?: number;
  /** global speed multiplier for all dots */
  speedScale?: number;
  /** frames per second ceiling */
  maxFps?: number;
  /** false draws one still frame instead of animating */
  animated?: boolean;
};

/**
 * Aceternity "Dotted Glow Background": a canvas grid of dots that glow and dim.
 * - Each dot gets its own phase and speed, which gives an organic shimmer.
 * - Dots are stamped from two pre-rendered sprites instead of using a canvas shadow
 *   per dot, so a full-screen grid stays cheap.
 * - Pauses when off screen or when the tab is hidden.
 * Defaults are the DYMUN palette: gold dots with an orange glow.
 */
export const DottedGlowBackground = ({
  className,
  gap = 14,
  radius = 1.4,
  color = "rgba(201, 162, 75, 0.9)",
  glowColor = "rgba(255, 122, 26, 0.95)",
  opacity = 0.7,
  speedMin = 0.4,
  speedMax = 1.3,
  speedScale = 1,
  maxFps = 30,
  animated = true,
}: DottedGlowBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stopped = false;
    let isVisible = true;

    const dpr = Math.min(Math.max(1, window.devicePixelRatio || 1), 1.5);

    // One plain dot and one glowing dot, drawn once and stamped many times.
    const spriteSize = Math.ceil((radius + 8) * 2 * dpr);
    const half = spriteSize / 2;
    const makeSprite = (glow: boolean) => {
      const sprite = document.createElement("canvas");
      sprite.width = spriteSize;
      sprite.height = spriteSize;
      const g = sprite.getContext("2d");
      if (!g) return sprite;
      if (glow) {
        g.shadowColor = glowColor;
        g.shadowBlur = 7 * dpr;
        g.fillStyle = glowColor;
      } else {
        g.fillStyle = color;
      }
      g.beginPath();
      g.arc(half, half, radius * dpr, 0, Math.PI * 2);
      g.fill();
      return sprite;
    };
    const dotSprite = makeSprite(false);
    const glowSprite = makeSprite(true);

    let dots: { x: number; y: number; phase: number; speed: number }[] = [];

    const layout = () => {
      const { width, height } = container.getBoundingClientRect();
      el.width = Math.max(1, Math.floor(width * dpr));
      el.height = Math.max(1, Math.floor(height * dpr));
      el.style.width = `${Math.floor(width)}px`;
      el.style.height = `${Math.floor(height)}px`;

      dots = [];
      const cols = Math.ceil(width / gap) + 2;
      const rows = Math.ceil(height / gap) + 2;
      const min = Math.min(speedMin, speedMax);
      const span = Math.abs(speedMax - speedMin);
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          dots.push({
            x: i * gap + (j % 2 === 0 ? 0 : gap * 0.5), // offset every other row
            y: j * gap,
            phase: Math.random() * Math.PI * 2,
            speed: min + Math.random() * span,
          });
        }
      }
    };

    const paint = (now: number) => {
      ctx.clearRect(0, 0, el.width, el.height);
      const time = (now / 1000) * Math.max(speedScale, 0);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        // Linear triangle wave 0..1..0 for a linear glow and dim
        const mod = (time * d.speed + d.phase) % 2;
        const lin = mod < 1 ? mod : 2 - mod;
        const a = 0.25 + 0.55 * lin; // 0.25..0.8
        const x = d.x * dpr - half;
        const y = d.y * dpr - half;

        ctx.globalAlpha = a * opacity;
        ctx.drawImage(dotSprite, x, y);

        if (a > 0.6) {
          ctx.globalAlpha = ((a - 0.6) / 0.2) * opacity;
          ctx.drawImage(glowSprite, x, y);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frameGap = 1000 / Math.max(1, maxFps);
    let last = 0;

    const draw = (now: number) => {
      if (stopped) return;
      raf = requestAnimationFrame(draw);
      if (!isVisible || document.hidden || now - last < frameGap) return;
      last = now;
      paint(now);
    };

    const handleResize = () => {
      layout();
      if (!animated) paint(performance.now());
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    layout();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    if (animated) {
      raf = requestAnimationFrame(draw);
    } else {
      paint(performance.now());
    }

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
    };
  }, [
    gap,
    radius,
    color,
    glowColor,
    opacity,
    speedMin,
    speedMax,
    speedScale,
    maxFps,
    animated,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "absolute", inset: 0 }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
};
