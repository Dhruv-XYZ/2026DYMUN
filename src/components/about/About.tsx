import { Reveal } from '@/components/Reveal'
import { Section, SectionHeading } from '@/components/Section'
import { Highlight } from '@/components/ui/hero-highlight'
import { sections, site } from '@/data/site.js'
import { committeeCount, gradeMax, gradeMin, gradeRange } from '@/lib/committees'
import { cn } from '@/lib/utils'
import { withBase } from '@/lib/base'

/** Fills {days}, {count} and {grades} in the copy from the data, so the numbers cannot drift. */
function fill(text: string): string {
  return text
    .replace('{days}', String(site.days))
    .replace('{count}', String(committeeCount))
    .replace('{grades}', `${gradeMin} to ${gradeMax}`)
}

/** What DYMUN is: a few lines and three numbers, with the conference emblem beside them. */
export function About({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const copy = sections.about
  const word = copy.accent.toUpperCase()

  const [first, ...rest] = copy.body.map(fill)
  const stats = [
    { value: String(site.days), label: copy.stats.days },
    { value: String(committeeCount), label: copy.stats.committees },
    { value: gradeRange, label: copy.stats.grades },
  ]

  return (
    <Section id="about" tone="cream" labelledBy="about-title" className="min-h-[80svh] pt-20 pb-20 md:pt-24 md:pb-32">
      <SectionHeading
        id="about-title"
        level={headingLevel}
        label={copy.label}
        lead={copy.lead}
        accentClassName="inline-block"
        accent={
          <Highlight className="align-bottom">
            <span className="text-ink-text">{word}</span>
          </Highlight>
        }
      />

      <div className="grid items-center gap-12 px-5 pt-12 md:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="max-w-[24ch] text-2xl leading-snug font-semibold tracking-[-0.02em] md:text-3xl">
              {first}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-6 max-w-[46ch] space-y-4 text-fg-muted">
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <dl className="mt-14 grid grid-cols-3 border-t border-line">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn('flex flex-col-reverse pt-6', index > 0 && 'border-l border-line pl-4 md:pl-6')}
              >
                <dt className="label mt-3 text-fg-muted max-md:text-[0.68rem] max-md:tracking-[0.03em]">
                  {stat.label}
                </dt>
                <dd className="text-[clamp(2.25rem,4.6vw,5rem)] leading-none font-black tracking-[-0.05em] whitespace-nowrap">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <img
          src={withBase(site.munLogoSrc)}
          alt={`${site.name} emblem`}
          width={1000}
          height={786}
          loading="lazy"
          decoding="async"
          className="mx-auto h-auto w-full max-w-[28rem]"
        />
      </div>
    </Section>
  )
}
