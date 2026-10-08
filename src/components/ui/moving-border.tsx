import { useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

interface MovingBorderButtonProps extends HTMLAttributes<HTMLElement> {
  borderRadius?: string;
  children: ReactNode;
  /** Element to render: "button" (default) or "a". */
  as?: "button" | "a";
  href?: string;
  type?: "button" | "submit";
  containerClassName?: string;
  borderClassName?: string;
  /** Milliseconds for one lap of the glint. */
  duration?: number;
  /** Corner radii of the path the glint follows. */
  rx?: string;
  ry?: string;
  /** true freezes the glint (reduced motion). */
  paused?: boolean;
  className?: string;
}

/**
 * Aceternity "Moving Border" button: a glint travelling round the edge.
 * Recoloured for DYMUN: solid orange face with ink text, and a gold-light glint
 * running on an ink track. Exported as MovingBorderButton, since "Button" clashed
 * with other components.
 */
export function MovingBorderButton({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  rx = "30%",
  ry = "30%",
  paused = false,
  className,
  ...otherProps
}: MovingBorderButtonProps) {
  // Typed as a button for JSX; at runtime it is whichever tag `as` asked for.
  const Tag = Component as "button";

  return (
    <Tag
      className={cn(
        "relative inline-flex h-14 overflow-hidden bg-ink p-[2px] text-base",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx={rx} ry={ry} paused={paused}>
          <div
            className={cn(
              "h-24 w-24 bg-[radial-gradient(var(--color-gold-light)_40%,transparent_60%)] opacity-95",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center bg-orange px-8 text-sm font-semibold text-ink antialiased",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Tag>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  paused = false,
}: {
  children: ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  paused?: boolean;
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    if (paused) return;
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x ?? 0,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y ?? 0,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
