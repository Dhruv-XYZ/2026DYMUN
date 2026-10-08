import { useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Aceternity "Magnetic Button": the child leans towards the cursor and springs back.
 * Changed for DYMUN: the dashed box that appeared around it on hover is removed, and
 * the pull can be switched off (touch screens, reduced motion).
 */
export const MagneticButton = ({
  children,
  strength = 0.8,
  maxDistance = 100,
  disabled = false,
  className,
}: {
  children: ReactNode;
  strength?: number;
  maxDistance?: number;
  disabled?: boolean;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const { clientX, clientY } = e;

    let x = (clientX - (left + width / 2)) * strength;
    let y = (clientY - (top + height / 2)) * strength;

    const distance = Math.hypot(x, y);
    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      x *= scale;
      y *= scale;
    }

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={disabled ? undefined : handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block", className)}
    >
      <motion.div
        ref={ref}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 25, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
