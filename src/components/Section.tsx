import { useRef } from 'react'
import type { ReactNode } from 'react'
import { MaskedLines } from '@/components/Reveal'
import { NoiseBackground } from '@/components/ui/noise-background'
import { cn } from '@/lib/utils'

export type Tone = 'dark' | 'cream'

/**
 * The texture of a cream section: Aceternity's noise background, with its warm glow
 * under film grain. It is held still: animating a glow across a whole section meant
 * repainting the section every frame, which Safari could not keep up with.
 *
 * It is laid over the section's content and multiplied in, like a tint on a print.
 * That way it colours the filled-in letters of outline type exactly as it colours the
 * paper around them, so they still look empty.
 */
function NoiseLayer() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 mix-blend-multiply"
    >
      <NoiseBackground
        containerClassName="absolute inset-0"
        animating={false}
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
 * Section title: a giant headline whose last line is the accent (serif italic by
 * default), and the section number in outline type. There is no small label above the
 * headline; the headline is the first thing in the section.
 */
export function SectionHeading({
  id,
  number,
  lead,
  accent,
  accentClassName = 'serif-accent text-[1.08em] text-tone',
  level = 2,
  className,
}: {
  id: string
  number: string
  /** Not shown. Kept so callers can still say what a section is called. */
  label?: string
  lead: string
  accent: ReactNode
  accentClassName?: string
  /** 1 on a page of its own, where this is the page's main heading. */
  level?: 1 | 2
  className?: string
}) {
  const Heading = level === 1 ? 'h1' : 'h2'

  return (
    <header className={cn('px-5 pt-24 md:px-10 md:pt-36', className)}>
      <div className="flex items-end justify-between gap-8">
        <div className="min-w-0">
          <Heading id={id} className="display-section">
            <MaskedLines
              lines={[
                lead,
                <span key="accent" className={accentClassName}>
                  {accent}
                </span>,
              ]}
            />
          </Heading>
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
