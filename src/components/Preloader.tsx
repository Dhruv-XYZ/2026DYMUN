import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { MaskedLines } from '@/components/Reveal'
import { LoaderOne } from '@/components/ui/loader'
import { site } from '@/data/site.js'

/** Shortest time on screen, so it never just flashes. */
const MIN_MS = 800
/** Longest time on screen, whether or not the fonts have arrived. */
const MAX_MS = 1400

/**
 * Full-screen loader shown before the hero. It leaves once the fonts are ready,
 * between MIN_MS and MAX_MS after it appeared, then slides up out of the way.
 * App decides whether to show it at all (once per browser session).
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const start = performance.now()
    let done = false
    let timer = 0

    const finish = () => {
      if (done) return
      done = true
      const wait = Math.max(0, MIN_MS - (performance.now() - start))
      timer = window.setTimeout(onDone, wait)
    }

    const cap = window.setTimeout(finish, MAX_MS)
    if (document.fonts) document.fonts.ready.then(finish).catch(finish)

    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(cap)
      window.clearTimeout(timer)
      document.documentElement.style.overflow = ''
    }
  }, [onDone])

  return (
    <motion.div
      role="status"
      aria-label="Loading"
      data-tone="dark"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-ink px-5 text-text"
      exit={reduced ? { opacity: 0 } : { y: '-100%' }}
      transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span aria-hidden="true" className="grain-layer" />

      <p aria-hidden="true" className="display relative text-center">
        <MaskedLines
          show
          lines={[
            <span key="name">
              <span className="text-outline">{site.shortName}</span>{' '}
              <span className="serif-accent text-gold-light">{site.edition}</span>
            </span>,
          ]}
        />
      </p>

      <LoaderOne className="relative" />

      <p aria-hidden="true" className="label relative flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-text-muted">
        <span>{site.school}</span>
        <span className="h-3 w-px bg-line" />
        <span>{site.city}</span>
      </p>
    </motion.div>
  )
}
