import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

// The DYMUN palette: orange and golds. Kept outside the component so the default
// array is the same on every render.
const DEFAULT_COLORS = ["#ff7a1a", "#e6c877", "#c9a24b", "#ff7a1a", "#8a6d2b"];

interface WavyBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Classes for the content layer. */
  className?: string;
  /** Classes for the outer container. */
  containerClassName?: string;
  /** Wave colours, cycled across the waves. */
  colors?: string[];
  /** Stroke width of each wave in px. */
  waveWidth?: number;
  /** Colour the canvas fades back to each frame. Use the section's own background. */
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  /** Draw one still frame instead of animating (reduced motion, low power). */
  paused?: boolean;
}

/**
 * Aceternity "Wavy Background": soft blurred waves drifting across a canvas.
 *
 * Changed for DYMUN:
 * - Orange and gold waves by default.
 * - It fills its own container. The original sized itself to the whole browser
 *   window and took over `window.onresize`.
 * - The canvas is resized with a ResizeObserver, and the animation stops while the
 *   section is off screen or the tab is hidden.
 * - The noise field is created once (it was rebuilt on every render), and the
 *   animation is cleaned up properly.
 * - `paused` draws a single still frame.
 */
export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors = DEFAULT_COLORS,
  waveWidth = 50,
  backgroundFill = "#0a0a0a",
  blur = 10,
  speed = "slow",
  waveOpacity = 0.5,
  paused = false,
  ...props
}: WavyBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorKey = colors.join("|");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;

    const noise = createNoise3D();
    const waveColors = colorKey.split("|");
    const step = speed === "fast" ? 0.002 : 0.001;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let time = 0;
    let frame = 0;
    let visible = true;

    const draw = () => {
      ctx.globalAlpha = waveOpacity;
      ctx.fillStyle = backgroundFill;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < width; x += 6) {
          const y = noise(x / 800, 0.3 * i, time) * 100;
          ctx.lineTo(x, y + height * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.filter = `blur(${blur}px)`;
      if (paused) draw();
    };

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      time += step;
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    intersection.observe(container);

    if (paused) {
      time = 0.4; // a pleasant still frame
      draw();
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [blur, backgroundFill, colorKey, speed, waveOpacity, waveWidth, paused]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-col items-center justify-center", containerClassName)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full"
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
