import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/** cubic-bezier(.22, 1, .36, 1) */
const EASE = [0.22, 1, 0.36, 1] as const

/** Fades its content up into place the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Masked line reveal: each line slides up out of a clipped strip.
 * By default it plays when scrolled into view. Pass `show` to drive it yourself,
 * for example to wait for the preloader.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  show,
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  show?: boolean
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const visible = show ?? inView

  return (
    <span ref={ref} className={cn('block', className)}>
      {lines.map((line, index) => (
        // The padding gives descenders room inside the clip; the margin cancels it out.
        <span key={index} className="-my-[0.2em] block overflow-hidden py-[0.2em]">
          <motion.span
            className={cn('block', lineClassName)}
            initial={reduced ? false : { y: '130%' }}
            animate={{ y: reduced || visible ? '0%' : '130%' }}
            transition={{ duration: 0.9, delay: delay + index * stagger, ease: EASE }}
          >
            {line}
          </motion.span>{' '}
        </span>
      ))}
    </span>
  )
}
