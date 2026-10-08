import { Reveal } from '@/components/Reveal'
import { Section, SectionHeading } from '@/components/Section'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'
import { sections } from '@/data/site.js'
import { useDeviceProfile } from '@/hooks/use-device'
import { committeeCount, groups } from '@/lib/committees'
import { CommitteeVisual } from './CommitteeVisual'

/**
 * The signature section. One block per group in src/data/committees.js, each with a
 * giant outline grade label, then the sticky scroll: names and agendas on the left,
 * the active committee's visual held on the right.
 *
 * Agenda text is printed exactly as it is in the data file: no truncation, no change
 * of case.
 */
export function Committees() {
  const { compact, lowPower, reducedMotion } = useDeviceProfile()
  const copy = sections.committees

  // Phones, tablets and low-power devices get the plain stacked list with still visuals.
  const stacked = compact || lowPower
  const animated = !stacked && !reducedMotion

  return (
    <Section id="committees" tone="dark" labelledBy="committees-title" className="pb-24 md:pb-36">
      <SectionHeading
        id="committees-title"
        number="02"
        label={copy.label}
        lead={copy.lead}
        accent={copy.accent}
      />

      {groups.map((group) => (
        <div key={group.id} className="px-5 pt-20 md:px-10 md:pt-32">
          <Reveal>
            <p className="label flex items-center gap-4 text-fg-muted">
              <span>{group.name}</span>
              <span aria-hidden="true" className="h-px w-10 bg-line" />
              <span>
                {group.committees.length} {copy.label}
              </span>
            </p>
            <h3 className="display text-outline mt-4">{group.grades}</h3>
          </Reveal>

          <StickyScroll
            stacked={stacked}
            titleAs="h4"
            className="mt-12 lg:mt-0"
            titleClassName="display-sm text-fg"
            descriptionClassName="mt-5 max-w-[46ch] text-base leading-relaxed text-fg-muted md:text-lg"
            content={group.committees.map((committee) => ({
              id: committee.id,
              title: committee.name,
              description: committee.agenda ?? copy.agendaPending,
              visual: (
                <CommitteeVisual committee={committee} total={committeeCount} animated={animated} />
              ),
            }))}
          />
        </div>
      ))}
    </Section>
  )
}
