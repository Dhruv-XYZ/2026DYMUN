import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/Reveal'
import { Section, SectionHeading } from '@/components/Section'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'
import { committeePage, sections } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { useDeviceProfile } from '@/hooks/use-device'
import { groups } from '@/lib/committees'
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
  const { compact, lowPower } = useDeviceProfile()
  const navigate = useAnchorNavigate()
  const copy = sections.committees

  // Phones, tablets and low-power devices get the plain stacked list with still visuals.
  const stacked = compact || lowPower

  return (
    <Section id="committees" tone="cream" labelledBy="committees-title" className="pb-24 md:pb-36">
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
            <h3 className="display text-outline">{group.grades}</h3>
            <p className="mt-4 text-xl font-extrabold tracking-[-0.02em] uppercase md:text-3xl">
              {group.name}, {group.committees.length} {copy.label.toLowerCase()}
            </p>
          </Reveal>

          <StickyScroll
            stacked={stacked}
            titleAs="h4"
            className="mt-12 lg:mt-0"
            // The picture of the active committee runs the full height of the screen, from
            // the top edge to the bottom, out to the right edge of the page. From 1280px it
            // moves to the left edge and fades out toward the text.
            panelClassName="top-0 h-[100svh] md:-mr-10 xl:mr-0 xl:-ml-10 xl:[mask-image:linear-gradient(to_right,#000_50%,transparent_100%)]"
            titleClassName="display-sm text-fg"
            subtitleClassName="mt-3 text-sm font-semibold tracking-[0.14em] text-tone uppercase md:text-base"
            descriptionClassName="mt-5 max-w-[46ch] text-lg leading-relaxed font-bold text-fg md:text-xl"
            content={group.committees.map((committee) => ({
              id: committee.id,
              title: committee.name,
              subtitle: committee.fullName,
              description: committee.hasAgenda ? (committee.agenda ?? copy.agendaPending) : null,
              footer: (
                <Link
                  to={`/committees/${committee.id}`}
                  aria-label={`${committeePage.view}: ${committee.name}`}
                  className="mt-8 inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-orange px-7 text-[0.75rem] font-semibold tracking-[0.18em] text-ink uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                >
                  {committeePage.view}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ),
              visual: (
                <CommitteeVisual committee={committee} animated={false} />
              ),
            }))}
          />
        </div>
      ))}

      <div className="px-5 pt-16 md:px-10">
        <a
          href="/committees"
          onClick={navigate}
          className="group inline-flex items-center gap-3 text-lg font-semibold text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
        >
          {copy.allLink}
          <ArrowUpRight
            aria-hidden="true"
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </Section>
  )
}
