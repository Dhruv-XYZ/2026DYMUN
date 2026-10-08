import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Aceternity "Loader One": three dots rising and falling in turn.
 * Recoloured to the DYMUN palette (gold-light to orange, gold rim).
 */
export const LoaderOne = ({ className }: { className?: string }) => {
  const transition = (x: number) => {
    return {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop" as const,
      delay: x * 0.2,
      ease: "easeInOut" as const,
    };
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={transition(dot)}
          className="h-4 w-4 rounded-full border border-gold bg-linear-to-b from-gold-light to-orange"
        />
      ))}
    </div>
  );
};
