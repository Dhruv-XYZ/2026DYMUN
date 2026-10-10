import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { schoolCard, site } from '@/data/site.js'

/**
 * The school's logo, top right of every page, on a cream chip so its red shield and gold
 * lettering stand out from the dark page. Hover it, focus it or tap it and a small card
 * drops down with the school's name and address and a button to the school's website.
 */
export function SchoolChip() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const panelId = useId()
  const reduced = useReducedMotion()

  const show = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  // A short grace period, so crossing the gap between chip and card does not close it.
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 160)
  }

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  // Escape closes; so does a tap anywhere else.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onFocus={show}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) hideSoon()
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${site.school}: about the school`}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center rounded-full bg-cream px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-2 ring-gold transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange lg:px-5 lg:py-2.5"
      >
        <img
          src={site.schoolLogoSrc}
          alt=""
          width={1000}
          height={326}
          decoding="async"
          className="h-6 w-auto lg:h-9"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            // pt-3 is part of the panel, so the pointer never leaves it on the way down.
            className="absolute top-full right-0 z-50 w-[min(20rem,calc(100vw-2rem))] pt-3"
          >
            <div className="bg-ink-raised p-5 text-text shadow-[0_24px_60px_rgba(0,0,0,0.6)] ring-1 ring-gold/60">
              <p className="text-lg leading-tight font-extrabold tracking-[-0.01em]">{site.school}</p>
              <p className="mt-1 text-sm font-semibold text-gold-light">{schoolCard.intro}</p>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{site.schoolAddress}</p>
              <a
                href={site.schoolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange px-6 text-[0.75rem] font-semibold tracking-[0.16em] whitespace-nowrap text-ink uppercase transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {schoolCard.button}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
