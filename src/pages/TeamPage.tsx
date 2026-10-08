import { Team } from '@/components/team/Team'
import { sections } from '@/data/site.js'
import { usePageTitle } from '@/hooks/use-page-title'

/** /team: the Secretariat on a page of its own. */
export default function TeamPage() {
  usePageTitle(sections.team.label)
  return <Team headingLevel={1} />
}
