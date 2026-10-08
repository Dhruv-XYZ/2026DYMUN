import type { ReactNode } from 'react'
import { MaskedLines, Reveal } from '@/components/Reveal'
import { cn } from '@/lib/utils'

export type Tone = 'dark' | 'cream'

/**
 * A full-width band of the page. `tone` switches every colour inside it between the
 * dark and cream schemes (see [data-tone] in index.css).
 *
 * It clips sideways with overflow-x: clip, never overflow: hidden, because hidden
 * overflow would stop sticky children from sticking.
 */
export function Section({
  id,
  tone,
  grain = true,
  labelledBy,
  className,
  children,
}: {
  id?: string
  tone: Tone
  grain?: boolean
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
        'relative w-full overflow-x-clip bg-surface text-fg',
        grain && 'grain',
        className,
      )}
    >
      {children}
    </section>
  )
}

/**
 * Section title: a tiny tracked label, a giant headline whose last word is the serif
 * accent, and the section number in outline type.
 */
export function SectionHeading({
  id,
  number,
  label,
  lead,
  accent,
  className,
}: {
  id: string
  number: string
  label: string
  lead: string
  accent: string
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
                <span key="accent" className="serif-accent text-[1.08em] text-tone">
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
