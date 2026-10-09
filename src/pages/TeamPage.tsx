import { Team } from '@/components/team/Team'
import { usePageMeta } from '@/hooks/use-page-meta'

/** /team: the Secretariat on a page of its own. */
export default function TeamPage() {
  usePageMeta('team')
  return <Team headingLevel={1} />
}
