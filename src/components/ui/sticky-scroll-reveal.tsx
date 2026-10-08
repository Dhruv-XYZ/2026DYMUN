import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface StickyScrollItem {
  id: string;
  title: ReactNode;
  description: ReactNode;
  /** Shown in the sticky panel while this item is the active one. */
  visual: ReactNode;
}

/**
 * Aceternity "Sticky Scroll Reveal": text scrolls on the left while a panel on the
 * right stays put and changes with the active item.
 *
 * Changed for DYMUN:
 * - It follows the page scroll. The original was a 30rem box with its own scrollbar.
 * - No rounded panel, padding or changing background colour around the text.
 * - The active item is the one crossing the middle of the screen, measured per item,
 *   so it stays right when the texts are different lengths.
 * - `stacked` gives the simple mobile layout: each visual above its own text.
 */
export const StickyScroll = ({
  content,
  stacked = false,
  titleAs = "h3",
  className,
  itemClassName,
  titleClassName,
  descriptionClassName,
  panelClassName,
  stackedVisualClassName,
}: {
  content: StickyScrollItem[];
  stacked?: boolean;
  /** Heading level of each item's title, to fit the page outline. */
  titleAs?: "h3" | "h4";
  className?: string;
  itemClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  /** Classes for the sticky panel on the right. */
  panelClassName?: string;
  /** Classes for each visual in the stacked layout. */
  stackedVisualClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const PlainTitle = titleAs;
  const MotionTitle = titleAs === "h4" ? motion.h4 : motion.h3;

  useEffect(() => {
    if (stacked) return;

    // A zero-height line across the middle of the viewport: whichever item crosses
    // it is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCard(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    for (const element of itemRefs.current) {
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [stacked, content.length]);

  if (stacked) {
    return (
      <div className={cn("flex flex-col gap-16", className)}>
        {content.map((item) => (
          <div key={item.id}>
            <div
              className={cn(
                "relative mb-6 aspect-[16/9] w-full overflow-hidden",
                stackedVisualClassName,
              )}
            >
              {item.visual}
            </div>
            <PlainTitle className={titleClassName}>{item.title}</PlainTitle>
            <p className={descriptionClassName}>{item.description}</p>
          </div>
        ))}
      </div>
    );
  }

  const active = content[activeCard];

  return (
    <div
      className={cn(
        "relative grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]",
        className,
      )}
    >
      <div>
        {content.map((item, index) => (
          <div
            key={item.id}
            data-index={index}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className={cn(
              "flex min-h-[62vh] flex-col justify-center py-10",
              itemClassName,
            )}
          >
            <MotionTitle
              initial={false}
              animate={{
                opacity: activeCard === index ? 1 : 0.35,
              }}
              className={titleClassName}
            >
              {item.title}
            </MotionTitle>
            <motion.p
              initial={false}
              animate={{
                opacity: activeCard === index ? 1 : 0.35,
              }}
              className={descriptionClassName}
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>

      <div className="relative hidden lg:block">
        <div
          className={cn(
            "sticky top-[14vh] h-[72vh] overflow-hidden",
            panelClassName,
          )}
        >
          <AnimatePresence initial={false}>
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55 }}
                className="absolute inset-0"
              >
                {active.visual}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
