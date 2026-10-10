import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

// Orange and gold with a teal wave between them. Kept outside the component so the
// default array is the same on every render. (Dark gold and brown turned muddy olive
// once blurred and faded, so neither is used.)
const DEFAULT_COLORS = ["#ff7a1a", "#e6c877", "#1aa6a6", "#ff7a1a", "#e6c877"];

/**
 * The waves are drawn small and sharp, then softened by the browser's CSS blur. That
 * is what keeps it light: the blur runs on the graphics card, where the old canvas
 * blur ran on the processor for every stroke of every frame, and it works in Safari,
 * which has no canvas blur at all. The canvas is a little bigger than its box so the
 * blur has no soft edge showing.
 */
const SCALE = 0.3;

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
 * - The blur is a CSS filter on a small canvas, not a canvas filter (see SCALE).
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
  // Room for the blur to spread past the box, so its edges stay hard.
  const pad = Math.ceil(blur * 2);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;

    const noise = createNoise3D();
    const waveColors = colorKey.split("|");
    const step = speed === "fast" ? 0.002 : 0.001;
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
      width = Math.max(1, Math.floor(rect.width)) + pad * 2;
      height = Math.max(1, Math.floor(rect.height)) + pad * 2;
      canvas.width = Math.max(1, Math.floor(width * SCALE));
      canvas.height = Math.max(1, Math.floor(height * SCALE));
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
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
  }, [pad, backgroundFill, colorKey, speed, waveOpacity, waveWidth, paused]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden",
        containerClassName,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute z-0"
        style={{
          top: -pad,
          left: -pad,
          width: `calc(100% + ${pad * 2}px)`,
          height: `calc(100% + ${pad * 2}px)`,
          filter: `blur(${blur}px)`,
          WebkitFilter: `blur(${blur}px)`,
        }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
