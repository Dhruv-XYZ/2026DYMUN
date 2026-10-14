import { lazy, Suspense, useEffect, useState } from 'react'
import { Hero } from '@/components/hero/Hero'
import { usePageMeta } from '@/hooks/use-page-meta'

const HomeSections = lazy(() => import('./HomeSections'))

const WAKE_EVENTS = ['pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'] as const

/**
 * The landing page. Sections alternate dark and cream:
 * hero (dark), about (cream), committees (dark), schedule (cream), gallery (dark),
 * team (dark), register (cream), then the dark footer.
 *
 * The hero is in the first download so it paints quickly. The rest is a second chunk,
 * brought in a few seconds after load, or at once if the visitor scrolls, touches or
 * presses a key first (and a link such as /#register counts too).
 */
export default function Home() {
  usePageMeta('home')
  const [more, setMore] = useState(() => window.location.hash.length > 1)

  useEffect(() => {
    if (more) return
    const wake = () => setMore(true)
    const timer = window.setTimeout(wake, 3500)
    for (const event of WAKE_EVENTS) window.addEventListener(event, wake, { passive: true, once: true })
    return () => {
      window.clearTimeout(timer)
      for (const event of WAKE_EVENTS) window.removeEventListener(event, wake)
    }
  }, [more])

  return (
    <>
      <Hero />
      {more ? (
        <Suspense fallback={<div aria-hidden="true" className="min-h-[100svh]" />}>
          <HomeSections />
        </Suspense>
      ) : (
        <div aria-hidden="true" className="min-h-[100svh]" />
      )}
    </>
  )
}
