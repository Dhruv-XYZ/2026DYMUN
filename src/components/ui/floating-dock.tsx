/**
 * Aceternity "Floating Dock": icons that swell as the cursor passes over them.
 *
 * Changed for DYMUN:
 * - Sits at the top on desktop, so the icons grow downward instead of upward.
 * - The hover tooltip is replaced by a label slot inside the bar. It shows the item
 *   under the cursor or keyboard focus, and otherwise the current section.
 * - On phones it is a single compact row instead of a button that opens a stack.
 * - Palette colours, lucide icons supplied by the caller, aria-current and focus rings.
 **/

import { useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export interface DockItem {
  title: string;
  icon: ReactNode;
  href: string;
  /** Marks the item for the section or page the visitor is on. */
  active?: boolean;
}

type Navigate = (href: string, event: MouseEvent<HTMLAnchorElement>) => void;

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  onNavigate,
  label = "Main",
  magnify = true,
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  /** Called on click, before the browser follows the link. */
  onNavigate?: Navigate;
  /** Accessible name of the navigation landmark. */
  label?: string;
  /** false keeps the icons at their resting size (reduced motion). */
  magnify?: boolean;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        onNavigate={onNavigate}
        label={label}
        magnify={magnify}
      />
      <FloatingDockMobile
        items={items}
        className={mobileClassName}
        onNavigate={onNavigate}
        label={label}
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  onNavigate,
  label,
}: {
  items: DockItem[];
  className?: string;
  onNavigate?: Navigate;
  label: string;
}) => {
  return (
    <nav aria-label={label} className={cn("block md:hidden", className)}>
      <div className="flex items-center gap-1 rounded-full bg-ink-raised p-1.5 ring-1 ring-gold/40">
        {items.map((item) => (
          <a
            href={item.href}
            key={item.title}
            aria-label={item.title}
            aria-current={item.active ? "true" : undefined}
            onClick={(event) => onNavigate?.(item.href, event)}
            className={cn(
              "flex h-11 w-10 items-center justify-center rounded-full transition-colors duration-200",
              item.active ? "bg-orange text-ink" : "text-text-muted",
            )}
          >
            <span className="flex h-5 w-5 items-center justify-center">
              {item.icon}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  onNavigate,
  label,
  magnify,
}: {
  items: DockItem[];
  className?: string;
  onNavigate?: Navigate;
  label: string;
  magnify: boolean;
}) => {
  const mouseX = useMotionValue(Infinity);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const shownTitle =
    hoveredTitle ?? items.find((item) => item.active)?.title ?? "";

  return (
    <motion.nav
      aria-label={label}
      onMouseMove={(e) => {
        if (magnify) mouseX.set(e.pageX);
      }}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-14 items-start gap-3 rounded-full bg-ink-raised pt-2 pr-6 pl-2 ring-1 ring-gold/40 md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer
          mouseX={mouseX}
          key={item.title}
          onNavigate={onNavigate}
          onHoverChange={setHoveredTitle}
          {...item}
        />
      ))}

      {/* Label slot: the item under the cursor or focus, otherwise the current section. */}
      <span
        aria-hidden="true"
        className="relative ml-1 flex h-10 w-32 items-center overflow-hidden border-l border-gold/30 pl-4"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={shownTitle}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="block text-[0.65rem] font-medium tracking-[0.3em] whitespace-nowrap text-text uppercase"
          >
            {shownTitle}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.nav>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  active,
  onNavigate,
  onHoverChange,
}: {
  mouseX: MotionValue<number>;
  title: string;
  icon: ReactNode;
  href: string;
  active?: boolean;
  onNavigate?: Navigate;
  onHoverChange: (title: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 66, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 66, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [18, 30, 18]);
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [18, 30, 18],
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <a
      href={href}
      aria-label={title}
      aria-current={active ? "true" : undefined}
      onClick={(event) => onNavigate?.(href, event)}
      onFocus={() => onHoverChange(title)}
      onBlur={() => onHoverChange(null)}
      className="rounded-full"
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => onHoverChange(title)}
        onMouseLeave={() => onHoverChange(null)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full ring-1 transition-colors duration-200",
          active
            ? "bg-orange text-ink ring-orange"
            : "bg-ink text-text-muted ring-gold/25 hover:text-gold-light",
        )}
      >
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
