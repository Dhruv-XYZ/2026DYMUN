import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useInView } from 'motion/react'

/**
 * Renders `children` only once this spot is within 300px of the screen, and keeps them
 * from then on. Used to hold back decorative chunks (sparkles, the warp word) so they
 * are not downloaded or run during the first load. `fallback` fills the space until then.
 */
export function OnScreen({
  children,
  fallback = null,
  className,
}: {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const near = useInView(ref, { once: true, margin: '300px 0px 300px 0px' })
  return (
    <span ref={ref} className={className}>
      {near ? children : fallback}
    </span>
  )
}
