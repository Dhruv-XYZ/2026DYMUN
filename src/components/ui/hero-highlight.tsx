"use client";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Aceternity "Hero Highlight": a marker highlight that sweeps in behind a word.
 * Changed for DYMUN: the dotted background wrapper is dropped (the page already has
 * its own backdrop), the highlight is orange instead of indigo and purple, it sweeps
 * in when the word scrolls into view rather than on page load, and it is simply
 * there, with no sweep, for reduced motion.
 */
export const Highlight = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const reduced = useReducedMotion();

  return (
    <motion.span
      initial={{ backgroundSize: reduced ? "100% 100%" : "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
      className={cn(
        "relative inline-block rounded-lg bg-linear-to-r from-orange to-orange px-3 pb-1",
        className,
      )}
    >
      {children}
    </motion.span>
  );
};
