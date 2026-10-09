import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, ReactNode, TouchEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const TOOLTIP_WIDTH = 256; // matches w-64 on the card below
const GAP = 14;

/**
 * Aceternity "Tooltip Card": a card that grows out of the thing you hover and follows
 * the cursor.
 *
 * Changed for DYMUN:
 * - Ink card with a gold hairline ring, in place of the white and neutral colours.
 * - Works from the keyboard: with `focusable` the wrapper can be tabbed to, and the card
 *   opens beside it, then closes on blur or Escape.
 * - Touch: tap to open, tap again or wait to close (the original behaviour, kept).
 * - The wrapper can be a full-width block (`containerClassName`), and the card is
 *   tied to it for screen readers with aria-describedby.
 * - Positioned against the viewport so it flips away from any edge.
 */
export const Tooltip = ({
  content,
  children,
  containerClassName,
  focusable = false,
}: {
  content: ReactNode;
  children: ReactNode;
  containerClassName?: string;
  /** Let keyboard users reach and open the card. */
  focusable?: boolean;
}) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [height, setHeight] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const calculatePosition = useCallback((mouseX: number, mouseY: number) => {
    const container = containerRef.current;
    const tooltip = contentRef.current;
    if (!container || !tooltip) return { x: mouseX + GAP, y: mouseY + GAP };

    const rect = container.getBoundingClientRect();
    const tooltipHeight = tooltip.scrollHeight;
    const absoluteX = rect.left + mouseX;
    const absoluteY = rect.top + mouseY;

    let x = mouseX + GAP;
    let y = mouseY + GAP;

    // Flip to the left of the cursor near the right edge, to above it near the bottom.
    if (absoluteX + GAP + TOOLTIP_WIDTH > window.innerWidth) x = mouseX - TOOLTIP_WIDTH - GAP;
    if (rect.left + x < 8) x = 8 - rect.left;
    if (absoluteY + GAP + tooltipHeight > window.innerHeight) y = mouseY - tooltipHeight - GAP;
    if (rect.top + y < 8) y = 8 - rect.top;

    return { x, y };
  }, []);

  const place = useCallback(
    (x: number, y: number) => {
      setMouse({ x, y });
      setPosition(calculatePosition(x, y));
    },
    [calculatePosition],
  );

  const hide = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    setIsVisible(false);
  }, []);

  // Measure the card once it is on screen, then place it again with the real height.
  useEffect(() => {
    if (!isVisible || !contentRef.current) return;
    setHeight(contentRef.current.scrollHeight);
    setPosition(calculatePosition(mouse.x, mouse.y));
  }, [isVisible, content, mouse.x, mouse.y, calculatePosition]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const local = (clientX: number, clientY: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    setIsVisible(true);
    const { x, y } = local(event.clientX, event.clientY, event.currentTarget);
    place(x, y);
  };

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isVisible) return;
    const { x, y } = local(event.clientX, event.clientY, event.currentTarget);
    place(x, y);
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    window.clearTimeout(hideTimer.current);
    const touch = event.touches[0];
    const { x, y } = local(touch.clientX, touch.clientY, event.currentTarget);
    place(x, y);
    setIsVisible(true);
  };

  // After a tap, leave the card up for a moment so it can be read.
  const onTouchEnd = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setIsVisible(false), 2500);
  };

  // With the keyboard there is no cursor, so open the card at the top right of the item.
  const onFocus = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setIsVisible(true);
    place(rect.width * 0.6, rect.height * 0.35);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={focusable ? 0 : undefined}
      aria-describedby={isVisible ? id : undefined}
      className={cn("relative inline-block", containerClassName)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hide}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onFocus={focusable ? onFocus : undefined}
      onBlur={focusable ? hide : undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape") hide();
      }}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id={id}
            role="tooltip"
            initial={{ height: 0, opacity: 1 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="pointer-events-none absolute z-50 w-64 overflow-hidden bg-ink-raised text-text shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-gold/50"
            style={{ top: position.y, left: position.x }}
          >
            <div ref={contentRef} className="p-4 text-sm">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
