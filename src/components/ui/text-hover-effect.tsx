import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const FONT_SIZE = 150; // SVG user units
const BOX_HEIGHT = 116;
const BASELINE = 112;
const DASH = 6000;

interface TextHoverEffectProps {
  text: string;
  /** Seconds the highlight takes to catch up with the cursor. 0 follows it exactly. */
  duration?: number;
  /**
   * Cursor position in viewport pixels, or null when the cursor is away. When this prop
   * is given, the effect follows it instead of listening for its own mouse events, so a
   * parent can make the whole section react.
   */
  pointer?: { x: number; y: number } | null;
  /** false keeps the outline but switches off the cursor highlight and the draw-on. */
  interactive?: boolean;
  /** The outline draws itself once this is true. */
  active?: boolean;
  /** Colour inside the letters. Use the colour of whatever is behind the text. */
  fill?: string;
  className?: string;
}

/**
 * Aceternity "Text Hover Effect": outlined text whose stroke lights up under the cursor.
 * Changes for DYMUN: gold outline that is always visible, a gold-light to orange
 * highlight, Inter 900, a 1px stroke at any size, a viewBox measured to the text so it
 * spans its container, and unique SVG ids so it can appear more than once on a page.
 */
export const TextHoverEffect = ({
  text,
  duration,
  pointer,
  interactive = true,
  active = true,
  fill = "var(--tone-bg)",
  className,
}: TextHoverEffectProps) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientId = `the-gradient-${uid}`;
  const revealId = `the-reveal-${uid}`;
  const maskId = `the-mask-${uid}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const [boxWidth, setBoxWidth] = useState(text.length * 112);
  const [local, setLocal] = useState<{ x: number; y: number } | null>(null);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  const controlled = pointer !== undefined;
  const cursor = controlled ? pointer : local;
  const hovered = interactive && cursor !== null;

  // Fit the viewBox to the text, again once the web font has loaded.
  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled || !measureRef.current) return;
      const length = measureRef.current.getComputedTextLength();
      if (length > 0) setBoxWidth(Math.ceil(length) + 8);
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [text]);

  useEffect(() => {
    if (!svgRef.current || !cursor) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    setMaskPosition({
      cx: `${((cursor.x - rect.left) / rect.width) * 100}%`,
      cy: `${((cursor.y - rect.top) / rect.height) * 100}%`,
    });
  }, [cursor]);

  // Inter's letter shapes overlap inside, and a plain stroke would draw those seams.
  // So the stroke is doubled and painted first, then the fill covers its inner half
  // and the seams, which leaves a clean outline of the stated width.
  const textProps = {
    x: "50%",
    y: BASELINE,
    textAnchor: "middle" as const,
    strokeWidth: 2,
    vectorEffect: "non-scaling-stroke" as const,
    className: "font-sans font-black",
  };
  const textStyle = {
    fontSize: FONT_SIZE,
    letterSpacing: "-0.04em",
    fill,
    paintOrder: "stroke" as const,
  };
  const listens = interactive && !controlled;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${boxWidth} ${BOX_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      onMouseLeave={listens ? () => setLocal(null) : undefined}
      onMouseMove={
        listens ? (e) => setLocal({ x: e.clientX, y: e.clientY }) : undefined
      }
      className={cn("block select-none overflow-visible", className)}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={boxWidth}
          y2="0"
        >
          <stop offset="0%" style={{ stopColor: "var(--color-gold-light)" }} />
          <stop offset="35%" style={{ stopColor: "var(--color-orange)" }} />
          <stop offset="70%" style={{ stopColor: "var(--color-gold)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-gold-light)" }} />
        </linearGradient>

        <motion.radialGradient
          id={revealId}
          gradientUnits="userSpaceOnUse"
          r="24%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={maskId}>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${revealId})`}
          />
        </mask>
      </defs>

      {/* Faint outline, always there. Also used to measure the text. */}
      <text
        ref={measureRef}
        {...textProps}
        style={{ ...textStyle, stroke: "var(--color-gold)", opacity: 0.3 }}
      >
        {text}
      </text>

      {/* The outline drawing itself on. */}
      <motion.text
        {...textProps}
        style={{ ...textStyle, stroke: "var(--color-gold)", opacity: 0.85 }}
        initial={
          interactive
            ? { strokeDashoffset: DASH, strokeDasharray: DASH }
            : { strokeDashoffset: 0, strokeDasharray: DASH }
        }
        animate={
          active ? { strokeDashoffset: 0, strokeDasharray: DASH } : undefined
        }
        transition={{ duration: 3.4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* Gradient stroke, shown only in a soft circle around the cursor. */}
      {interactive && (
        <text
          {...textProps}
          strokeWidth={4}
          stroke={`url(#${gradientId})`}
          mask={`url(#${maskId})`}
          style={{
            ...textStyle,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease-out",
          }}
        >
          {text}
        </text>
      )}
    </svg>
  );
};
