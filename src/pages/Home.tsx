import { lazy, Suspense, useEffect } from 'react'
import { Hero } from '@/components/hero/Hero'
import { usePageMeta } from '@/hooks/use-page-meta'

const loadSections = () => import('./HomeSections')
const HomeSections = lazy(loadSections)

/**
 * The landing page. Sections alternate dark and cream:
 * hero (dark), about (cream), committees (dark), schedule (cream), gallery (dark),
 * team (dark), the wavy statement (dark), register (cream), then the dark footer.
 * `ready` is false while the preloader is still on screen.
 *
 * The hero is in the first download so it paints quickly. The rest is a second chunk,
 * fetched as soon as the browser is idle after the first paint.
 */
export default function Home({ ready = true }: { ready?: boolean }) {
  usePageMeta('home')

  useEffect(() => {
    const start = () => void loadSections()
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(start, 1200)
    return () => clearTimeout(id)
  }, [])

  return (
    <>
      <Hero ready={ready} />
      <Suspense fallback={<div aria-hidden="true" className="min-h-[100svh]" />}>
        <HomeSections />
      </Suspense>
    </>
  )
}
