import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

// The DYMUN palette. Kept outside the component so the default never changes identity.
const DEFAULT_GRADIENT = [
  "var(--color-gold-light)",
  "var(--color-orange)",
  "var(--color-gold)",
];

// Helper component for gradient layers
function GradientLayer({
  springX,
  springY,
  gradientColor,
  opacity,
  multiplier,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  gradientColor: string;
  opacity: number;
  multiplier: number;
}) {
  const x = useTransform(springX, (val) => val * multiplier);
  const y = useTransform(springY, (val) => val * multiplier);
  const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${gradientColor} 0%, transparent 50%)`;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        opacity,
        background,
      }}
    />
  );
}

interface NoiseBackgroundProps {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
  /** Opacity of the grain. Defaults to the section's own grain strength. */
  noiseIntensity?: number;
  /** How strong the colour glow is: 1 is the original, lower is fainter. */
  strength?: number;
  speed?: number;
  animating?: boolean;
}

/**
 * Aceternity "Noise Background": soft colour glows that wander under a layer of grain.
 *
 * Changed for DYMUN:
 * - It is a plain full-bleed layer. The rounded, padded, shadowed frame is gone.
 * - Gold and orange glows, with `strength` to keep them faint on cream.
 * - The grain is the site's own inline SVG, not an image fetched from another server.
 * - overflow: clip instead of hidden, so sticky elements inside a section still stick.
 */
export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = DEFAULT_GRADIENT,
  noiseIntensity,
  strength = 1,
  speed = 0.1,
  animating = true,
}: NoiseBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Use spring animation for smooth movement
  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // Transform for top gradient strip
  const topGradientX = useTransform(springX, (val) => val * 0.1 - 50);

  const velocityRef = useRef({ x: 0, y: 0 });
  const lastDirectionChangeRef = useRef(0);

  // Initialize position to center
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    x.set(centerX);
    y.set(centerY);
  }, [x, y]);

  // A fresh random direction at the current speed
  const randomVelocity = () => {
    const angle = Math.random() * Math.PI * 2;
    const magnitude = speed * (0.5 + Math.random() * 0.5); // between 0.5x and 1x
    return {
      x: Math.cos(angle) * magnitude,
      y: Math.sin(angle) * magnitude,
    };
  };

  // Animate using motion/react's useAnimationFrame
  useAnimationFrame((time) => {
    if (!animating || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const maxX = rect.width;
    const maxY = rect.height;

    // Change direction randomly every 1.5-3 seconds
    if (
      (velocityRef.current.x === 0 && velocityRef.current.y === 0) ||
      time - lastDirectionChangeRef.current > 1500 + Math.random() * 1500
    ) {
      velocityRef.current = randomVelocity();
      lastDirectionChangeRef.current = time;
    }

    // Update position based on velocity (deltaTime is ~16ms per frame at 60fps)
    const deltaTime = 16; // Approximate frame time
    const currentX = x.get();
    const currentY = y.get();

    let newX = currentX + velocityRef.current.x * deltaTime;
    let newY = currentY + velocityRef.current.y * deltaTime;

    // When hitting edges, generate a completely new random direction
    const padding = 20; // Keep some distance from edges

    if (
      newX < padding ||
      newX > maxX - padding ||
      newY < padding ||
      newY > maxY - padding
    ) {
      velocityRef.current = randomVelocity();
      // Reset timer to allow immediate new direction
      lastDirectionChangeRef.current = time;
      // Clamp position to stay within bounds
      newX = Math.max(padding, Math.min(maxX - padding, newX));
      newY = Math.max(padding, Math.min(maxY - padding, newY));
    }

    x.set(newX);
    y.set(newY);
  });

  return (
    <div
      ref={containerRef}
      className={cn("group relative overflow-clip", containerClassName)}
    >
      {/* Moving gradient layers */}
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[0]}
        opacity={0.4 * strength}
        multiplier={1}
      />
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[1] || gradientColors[0]}
        opacity={0.3 * strength}
        multiplier={0.7}
      />
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[2] || gradientColors[0]}
        opacity={0.25 * strength}
        multiplier={1.2}
      />

      {/* Top gradient strip */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1 opacity-70 blur-sm"
        style={{
          background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
          x: animating ? topGradientX : 0,
        }}
      />

      {/* Static noise pattern: the site's inline SVG grain */}
      <div
        className="pointer-events-none absolute inset-0 [background-image:var(--grain-image)] [background-size:240px_240px]"
        style={
          {
            opacity: noiseIntensity ?? "var(--grain-opacity)",
          } as CSSProperties
        }
      />

      {/* Content */}
      {children !== undefined && (
        <div className={cn("relative z-10", className)}>{children}</div>
      )}
    </div>
  );
};
