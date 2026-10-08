import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: ReactNode;
}

/**
 * Aceternity "Timeline": titles that stick on the left while their content scrolls,
 * and a beam that fills down the line as you go.
 * Changed for DYMUN: the built-in demo heading is gone (the section supplies its own),
 * colours follow the section tone, the beam runs gold to orange, and the line is
 * re-measured when the layout changes.
 */
export const Timeline = ({
  data,
  className,
  titleClassName,
}: {
  data: TimelineEntry[];
  className?: string;
  titleClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setHeight(element.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className={cn("w-full font-sans", className)} ref={containerRef}>
      <div ref={ref} className="relative pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:gap-10 md:pt-32"
          >
            <div className="sticky top-32 z-30 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-lg">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface md:left-3">
                <div className="h-4 w-4 rounded-full border border-tone bg-tone/30 p-2" />
              </div>
              <h3
                className={cn(
                  "hidden text-xl font-bold text-fg-muted md:block md:pl-20 md:text-5xl",
                  titleClassName,
                )}
              >
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <h3
                className={cn(
                  "mb-4 block text-left text-2xl font-bold text-fg-muted md:hidden",
                  titleClassName,
                )}
              >
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute top-0 left-8 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-line to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-orange from-[0%] via-gold via-[10%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
