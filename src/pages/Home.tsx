import { Hero } from '@/components/hero/Hero'
import { usePageMeta } from '@/hooks/use-page-meta'

/**
 * The landing page is only the hero. Everything else (About, Committees, Gallery, Team,
 * Register) is its own page, reached from the bar at the top.
 */
export default function Home() {
  usePageMeta('home')
  return <Hero />
}
