import { Brief } from '@/components/hero/Brief'
import { Hero } from '@/components/hero/Hero'
import { usePageMeta } from '@/hooks/use-page-meta'

/**
 * The landing page is the hero and a short brief. Everything else (About, Committees, Gallery, Team,
 * Register) is its own page, reached from the bar at the top.
 */
export default function Home() {
  usePageMeta('home')
  return (
    <>
      <Hero />
      <Brief />
    </>
  )
}
