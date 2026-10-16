import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * A placeholder block with a slow gold shimmer, shown where a detail has not been
 * filled in yet. Under reduced motion the shimmer stops (see index.css) and it
 * stays a soft gold block.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-gold)_14%,transparent),color-mix(in_srgb,var(--color-gold-light)_36%,transparent),color-mix(in_srgb,var(--color-gold)_14%,transparent))]",
        className,
      )}
      {...props}
    />
  );
}
