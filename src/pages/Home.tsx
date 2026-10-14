import { Brief } from '@/components/hero/Brief'
import { Hero } from '@/components/hero/Hero'
import { usePageMeta } from '@/hooks/use-page-meta'

/**
 * The landing page is the hero, a short brief and a row of photos. Everything else (About, Committees, Team,
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
