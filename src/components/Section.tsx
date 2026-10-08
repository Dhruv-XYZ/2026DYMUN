import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { MaskedLines, Reveal } from '@/components/Reveal'
import { NoiseBackground } from '@/components/ui/noise-background'
import { cn } from '@/lib/utils'

export type Tone = 'dark' | 'cream'

/**
 * The texture of a cream section: Aceternity's noise background, with its warm glow
 * drifting slowly under film grain. It only moves while it is on screen.
 *
 * It is laid over the section's content and multiplied in, like a tint on a print.
 * That way it colours the filled-in letters of outline type exactly as it colours the
 * paper around them, so they still look empty.
 */
function NoiseLayer() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '200px 0px' })
  const reduced = useReducedMotion()

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 mix-blend-multiply"
    >
      <NoiseBackground
        containerClassName="absolute inset-0"
        animating={inView && !reduced}
        strength={0.45}
        speed={0.06}
      />
    </div>
  )
}

/**
 * A full-width band of the page. `tone` switches every colour inside it between the
 * dark and cream schemes (see [data-tone] in index.css).
 *
 * Texture: `noise` gives the moving noise background (used on cream sections);
 * otherwise `grain` lays static film grain over the section.
 *
 * It clips sideways with overflow-x: clip, never overflow: hidden, because hidden
 * overflow would stop sticky children from sticking.
 */
export function Section({
  id,
  tone,
  grain = true,
  noise = false,
  labelledBy,
  className,
  children,
}: {
  id?: string
  tone: Tone
  grain?: boolean
  noise?: boolean
  labelledBy?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={cn(
        'relative isolate w-full overflow-x-clip bg-surface text-fg',
        grain && !noise && 'grain',
        className,
      )}
    >
      {noise && <NoiseLayer />}
      {children}
    </section>
  )
}

/**
 * Section title: a tiny tracked label, a giant headline whose last line is the accent
 * (serif italic by default), and the section number in outline type.
 */
export function SectionHeading({
  id,
  number,
  label,
  lead,
  accent,
  accentClassName = 'serif-accent text-[1.08em] text-tone',
  className,
}: {
  id: string
  number: string
  label: string
  lead: string
  accent: ReactNode
  accentClassName?: string
  className?: string
}) {
  return (
    <header className={cn('px-5 pt-24 md:px-10 md:pt-36', className)}>
      <div className="flex items-end justify-between gap-8">
        <div className="min-w-0">
          <Reveal className="flex items-center gap-4">
            <span className="label text-tone md:hidden">{number}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line md:hidden" />
            <span className="label text-fg-muted">{label}</span>
          </Reveal>
          <h2 id={id} className="display-section mt-5">
            <MaskedLines
              lines={[
                lead,
                <span key="accent" className={accentClassName}>
                  {accent}
                </span>,
              ]}
            />
          </h2>
        </div>
        <span
          aria-hidden="true"
          className="display-section text-outline hidden shrink-0 md:block"
        >
          {number}
        </span>
      </div>
      <div className="hairline mt-10 md:mt-14" />
    </header>
  )
}
