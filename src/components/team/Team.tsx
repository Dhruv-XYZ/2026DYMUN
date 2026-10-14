import { Section, SectionHeading } from '@/components/Section'
import { FocusCards } from '@/components/ui/focus-cards'
import { ArrowUpRight } from 'lucide-react'
import { pages, sections } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { team } from '@/data/team.js'
import { TeamInfo } from './TeamInfo'

/** The name every placeholder entry in src/data/team.js carries. */
const PLACEHOLDER_NAME = 'Name TBA'

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * The Secretariat as focus cards. A member without a photo gets a tile with their
 * initials; a placeholder entry gets its slot number instead, since it has no name yet.
 */
export function Team({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const copy = sections.team
  const navigate = useAnchorNavigate()

  const cards = team.map((member, index) => ({
    title: member.name,
    subtitle: member.role,
    // The card that follows the cursor on hover. Missing details show as a skeleton.
    info: <TeamInfo member={member} />,
    src: member.photo || undefined,
    placeholder:
      member.name && member.name !== PLACEHOLDER_NAME
        ? initialsOf(member.name)
        : String(index + 1).padStart(2, '0'),
  }))

  return (
    <Section id="team" tone="cream" labelledBy="team-title" className="pb-24 md:pb-36">
      <SectionHeading
        level={headingLevel}
        id="team-title"
        number="05"
        label={copy.label}
        lead={copy.lead}
        accent={copy.accent}
      />

      <div className="px-5 pt-14 md:px-10 md:pt-20">
        <FocusCards cards={cards} />
      </div>

      {/* On the home page, link through to the team's own page. */}
      {headingLevel === 2 && (
        <div className="px-5 pt-14 md:px-10">
          <a
            href="/team"
            onClick={navigate}
            className="group inline-flex items-center gap-3 text-lg font-semibold text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
          >
            {pages.team.link}
            <ArrowUpRight
              aria-hidden="true"
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      )}
    </Section>
  )
}
