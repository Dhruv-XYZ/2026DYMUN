import { useEffect, useId, useRef } from "react";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { motion, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export type StatefulButtonState = "idle" | "loading" | "success";

interface StatefulButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
  > {
  className?: string;
  children: ReactNode;
  /**
   * Drive the button from outside, for example from a form: "loading" shows the
   * spinner, "success" swaps it for the tick, "idle" clears both.
   * Leave it unset and a click runs spinner, then onClick, then tick, as the
   * original component does.
   */
  state?: StatefulButtonState;
}

/**
 * Aceternity "Stateful Button": a button that grows a spinner while it works and a
 * tick when it is done.
 * Changed for DYMUN: orange with ink text, exported as StatefulButton, and it can be
 * controlled with `state` so a failed submit does not end in a tick.
 */
export const StatefulButton = ({
  className,
  children,
  state,
  onClick,
  ...buttonProps
}: StatefulButtonProps) => {
  const [scope, animate] = useAnimate();
  const layoutId = useId();
  const previousState = useRef<StatefulButtonState>("idle");

  const show = (selector: string) =>
    animate(
      selector,
      {
        width: "20px",
        scale: 1,
        display: "block",
      },
      {
        duration: 0.2,
      },
    );

  const hide = (selector: string, delay = 0) =>
    animate(
      selector,
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        delay,
        duration: 0.2,
      },
    );

  const animateLoading = async () => {
    await show(".loader");
  };

  const animateSuccess = async () => {
    await hide(".loader");
    await show(".check");
    await hide(".check", 2);
  };

  useEffect(() => {
    if (state === undefined || state === previousState.current) return;
    previousState.current = state;

    if (state === "loading") {
      void animateLoading();
    } else if (state === "success") {
      void animateSuccess();
    } else {
      void hide(".loader");
      void hide(".check");
    }
    // The animation helpers are recreated every render; only `state` matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (state !== undefined) {
      onClick?.(event);
      return;
    }
    await animateLoading();
    await onClick?.(event);
    await animateSuccess();
  };

  return (
    <motion.button
      layout
      layoutId={`stateful-button-${layoutId}`}
      ref={scope}
      className={cn(
        "flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-full bg-orange px-4 py-2 font-medium text-ink ring-offset-2 ring-offset-cream transition duration-200 hover:ring-2 hover:ring-orange disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...buttonProps}
      onClick={handleClick}
    >
      <motion.div layout className="flex items-center gap-2">
        <Loader />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  );
};

const Loader = () => {
  return (
    <motion.svg
      animate={{
        rotate: [0, 360],
      }}
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        ease: "linear",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="loader text-ink"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  );
};

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="check text-ink"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  );
};
