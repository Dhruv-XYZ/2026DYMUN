import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
  /** true stops the cycle and shows the current word without animating it */
  paused?: boolean;
}

/**
 * Aceternity "Container Text Flip": a word that swaps on a timer, its container
 * resizing to fit and the new letters blurring in one by one.
 * Changed for DYMUN: the grey gradient panel and its shadow are gone, so the word sits
 * free on the page, and the cycle can be paused.
 */
export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
  paused = false,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState<number | "auto">("auto");
  const textRef = useRef<HTMLSpanElement>(null);

  // Keep the container as wide as the current word, including after the web font
  // loads or the fluid type size changes.
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    const update = () => setWidth(element.scrollWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [currentWordIndex]);

  useEffect(() => {
    if (paused || words.length < 2) return;
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);
    return () => clearInterval(intervalId);
  }, [words, interval, paused]);

  const word = words[currentWordIndex] ?? "";

  return (
    <motion.span
      layout={!paused}
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={cn("relative inline-block whitespace-nowrap", className)}
      key={word}
    >
      <motion.span
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
        className={cn("inline-block", textClassName)}
        ref={textRef}
        layoutId={`word-div-${word}-${id}`}
      >
        <motion.span className="inline-block">
          {word.split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={
                paused
                  ? false
                  : {
                      opacity: 0,
                      filter: "blur(10px)",
                    }
              }
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                delay: index * 0.02,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </motion.span>
    </motion.span>
  );
}
