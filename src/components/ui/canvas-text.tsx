import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CanvasTextProps {
  text: string;
  className?: string;
  /** A background-colour class. Its colour fills the letters, underneath the lines. */
  backgroundClassName?: string;
  /** Line colours: plain colours or CSS variables such as "var(--color-gold)". */
  colors?: string[];
  /** Seconds for one full sway of the lines. */
  animationDuration?: number;
  lineWidth?: number;
  lineGap?: number;
  curveIntensity?: number;
  overlay?: boolean;
  /** true draws one still frame instead of animating. */
  paused?: boolean;
}

// The DYMUN palette. Kept outside the component so the default is the same array on
// every render (a fresh array each time would restart the drawing effect).
const DEFAULT_COLORS = [
  "var(--color-gold)",
  "var(--color-gold-light)",
  "var(--color-orange)",
  "var(--color-gold-dark)",
];

function resolveColor(color: string): string {
  if (color.startsWith("var(")) {
    const varName = color.slice(4, -1).trim();
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return resolved || color;
  }
  return color;
}

/**
 * Aceternity "Canvas Text": a word drawn on a canvas, filled with one colour and
 * crossed by swaying coloured lines.
 * Changed for DYMUN: palette colours, the heading's letter-spacing is honoured, it
 * pauses when off screen, and `paused` gives a still frame for reduced motion.
 */
export function CanvasText({
  text,
  className = "",
  backgroundClassName = "bg-ink",
  colors = DEFAULT_COLORS,
  animationDuration = 5,
  lineWidth = 1.5,
  lineGap = 10,
  curveIntensity = 60,
  overlay = false,
  paused = false,
}: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [font, setFont] = useState({ shorthand: "", letterSpacing: "0px" });
  const colorKey = colors.join("|");

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    const updateDimensions = () => {
      const rect = textEl.getBoundingClientRect();
      const computed = window.getComputedStyle(textEl);
      setDimensions({
        width: Math.ceil(rect.width) || 400,
        height: Math.ceil(rect.height) || 200,
      });
      setFont({
        shorthand: `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`,
        letterSpacing:
          computed.letterSpacing === "normal" ? "0px" : computed.letterSpacing,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(textEl);
    document.fonts?.ready.then(updateDimensions).catch(() => {});

    return () => resizeObserver.disconnect();
  }, [text, className]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const bg = bgRef.current;
    if (!canvas || !bg || dimensions.width === 0 || !font.shorthand) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const fillColor = window.getComputedStyle(bg).backgroundColor;
    const lineColors = colorKey.split("|").map(resolveColor);
    if (lineColors.length === 0) return;

    const { width, height } = dimensions;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const applyFont = () => {
      ctx.font = font.shorthand;
      if ("letterSpacing" in ctx) ctx.letterSpacing = font.letterSpacing;
    };

    applyFont();
    const metrics = ctx.measureText(text);
    const ascent = metrics.actualBoundingBoxAscent;
    const descent = metrics.actualBoundingBoxDescent;
    const baselineY = (height + ascent - descent) / 2;

    const numLines = Math.floor(height / lineGap) + 10;

    const draw = (elapsed: number) => {
      const phase = (elapsed / animationDuration) * Math.PI * 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.globalCompositeOperation = "source-over";
      applyFont();
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillStyle = "#000";
      ctx.fillText(text, 0, baselineY);

      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "source-atop";
      for (let i = 0; i < numLines; i++) {
        const y = i * lineGap;

        const curve1 = Math.sin(phase) * curveIntensity;
        const curve2 = Math.sin(phase + 0.5) * curveIntensity * 0.6;

        ctx.strokeStyle = lineColors[i % lineColors.length];
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          width * 0.33,
          y + curve1,
          width * 0.66,
          y + curve2,
          width,
          y,
        );
        ctx.stroke();
      }
    };

    if (paused) {
      draw(animationDuration * 0.2);
      return;
    }

    let frame = 0;
    let visible = true;
    const start = performance.now();

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      draw((now - start) / 1000);
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(canvas);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [
    text,
    font,
    colorKey,
    backgroundClassName,
    animationDuration,
    lineWidth,
    lineGap,
    curveIntensity,
    dimensions,
    paused,
  ]);

  return (
    <span
      className={cn(
        "relative inline-block",
        overlay && "absolute inset-0",
        className,
      )}
    >
      <span
        ref={bgRef}
        className={cn(
          "pointer-events-none absolute h-0 w-0 opacity-0",
          backgroundClassName,
        )}
        aria-hidden="true"
      />
      <span ref={textRef} className="invisible inline-block" aria-hidden="true">
        {text}
      </span>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute top-0 left-0"
        style={{
          width: dimensions.width || "auto",
          height: dimensions.height || "auto",
        }}
        aria-label={text}
        role="img"
      />
    </span>
  );
}
