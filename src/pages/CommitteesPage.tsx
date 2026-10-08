import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section, SectionHeading } from '@/components/Section'
import { pages, sections } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { usePageTitle } from '@/hooks/use-page-title'
import { committeeCount, groups } from '@/lib/committees'

/**
 * /committees: every committee on one page, as a plain index. Number, name and agenda
 * in open rows separated by hairlines, grouped under the giant outline grade labels.
 */
export default function CommitteesPage() {
  const copy = sections.committees
  const navigate = useAnchorNavigate()
  usePageTitle(copy.label)

  return (
    <Section tone="dark" labelledBy="committees-page-title" className="pb-24 md:pb-36">
      <SectionHeading
        level={1}
        id="committees-page-title"
        number={String(committeeCount)}
        label={copy.label}
        lead={pages.committees.lead}
        accent={pages.committees.accent}
      />

      {groups.map((group) => (
        <div key={group.id} className="px-5 pt-16 md:px-10 md:pt-28">
          <Reveal>
            <p className="label text-fg-muted">{group.name}</p>
            <h2 className="display-section text-outline mt-3">{group.grades}</h2>
          </Reveal>

          <ol className="mt-8 border-t border-line md:mt-12">
            {group.committees.map((committee) => (
              <li
                key={committee.id}
                className="grid gap-x-10 gap-y-3 border-b border-line py-7 md:grid-cols-[3.5rem_minmax(0,0.8fr)_minmax(0,1.2fr)] md:py-9"
              >
                <span className="label text-tone md:pt-3">
                  {String(committee.index + 1).padStart(2, '0')}
                </span>
                <h3 className="display-sm">{committee.name}</h3>
                <p className="max-w-[60ch] text-base leading-relaxed text-fg-muted md:text-lg">
                  {committee.agenda ?? copy.agendaPending}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ))}

      <div className="px-5 pt-16 md:px-10 md:pt-24">
        <a
          href="/#register"
          onClick={navigate}
          className="group inline-flex items-center gap-3 text-lg font-semibold text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
        >
          {pages.committees.registerLink}
          <ArrowUpRight
            aria-hidden="true"
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </Section>
  )
}
