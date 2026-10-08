import { Section, SectionHeading } from '@/components/Section'
import { FocusCards } from '@/components/ui/focus-cards'
import { sections } from '@/data/site.js'
import { team } from '@/data/team.js'

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
export function Team() {
  const copy = sections.team

  const cards = team.map((member, index) => ({
    title: member.name,
    subtitle: member.role,
    src: member.photo || undefined,
    placeholder:
      member.name && member.name !== PLACEHOLDER_NAME
        ? initialsOf(member.name)
        : String(index + 1).padStart(2, '0'),
  }))

  return (
    <Section id="team" tone="dark" labelledBy="team-title" className="pb-24 md:pb-36">
      <SectionHeading
        id="team-title"
        number="05"
        label={copy.label}
        lead={copy.lead}
        accent={copy.accent}
      />

      <div className="px-5 pt-14 md:px-10 md:pt-20">
        <FocusCards cards={cards} />
      </div>
    </Section>
  )
}
