import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { galleryAlt, galleryTiles } from '@/lib/gallery'

const SLIDES = galleryTiles.slice(0, 10)
const COUNT = SLIDES.length
/** Three copies in a row, so there is always a photo on both sides: it looks endless. */
const LOOP = [...SLIDES, ...SLIDES, ...SLIDES]
const AUTO_MS = 4500
const GAP = 20
const SWIPE_PX = 40
const MOVE_MS = 600

/**
 * A row of equal photos at the end of the home page brief. The current photo sits dead
 * centre with its neighbours peeking in on both sides, and it wraps round without end.
 * Arrows, dots, swipe, or it moves on by itself every few seconds (paused on hover or
 * focus, and still when reduced motion is on). Photos come from public/gallery.
 */
export function PhotoCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLImageElement>(null)
  const dragStart = useRef<number | null>(null)

  // Position in LOOP. It starts on the first photo of the middle copy.
  const [position, setPosition] = useState(COUNT)
  const [animate, setAnimate] = useState(true)
  const [sizes, setSizes] = useState({ viewport: 0, slide: 0 })
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  // Measure the viewport and one slide, and again whenever the window changes size.
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const measure = () =>
      setSizes({ viewport: viewport.clientWidth, slide: slideRef.current?.offsetWidth ?? 0 })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  const go = useCallback((step: number) => {
    setAnimate(true)
    setPosition((value) => {
      // Many quick clicks: fold back into the middle copy first, so it never runs off the end.
      const safe = value + step < 0 || value + step >= COUNT * 3 ? COUNT + (((value % COUNT) + COUNT) % COUNT) : value
      return safe + step
    })
  }, [])

  // Once a move has finished in the first or last copy, jump to the same photo in the
  // middle copy without animating, so the row never runs out. A timer (not transitionend)
  // so it also works when nothing animates, such as with reduced motion.
  useEffect(() => {
    if (position >= COUNT && position < COUNT * 2) return
    const timer = window.setTimeout(
      () => {
        setAnimate(false)
        setPosition(COUNT + (((position % COUNT) + COUNT) % COUNT))
      },
      animate && !reduced ? MOVE_MS + 40 : 0,
    )
    return () => window.clearTimeout(timer)
  }, [position, animate, reduced])

  // Turn animation back on the frame after a silent jump.
  useEffect(() => {
    if (animate) return
    const frame = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(frame)
  }, [animate])

  useEffect(() => {
    if (paused || reduced) return
    const timer = window.setInterval(() => go(1), AUTO_MS)
    return () => window.clearInterval(timer)
  }, [paused, reduced, go])

  const onPointerDown = (event: PointerEvent) => {
    dragStart.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (dragStart.current === null) return
    const delta = event.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(delta) > SWIPE_PX) go(delta < 0 ? 1 : -1)
  }

  const offset = sizes.viewport / 2 - (position * (sizes.slide + GAP) + sizes.slide / 2)
  const current = ((position % COUNT) + COUNT) % COUNT

  const arrow =
    'flex h-12 w-12 items-center justify-center rounded-full bg-ink text-text transition-colors duration-200 hover:bg-orange hover:text-ink'

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos"
      className="mt-14 md:mt-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={viewportRef}
        className="touch-pan-y overflow-hidden select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}
      >
        <div
          className="flex"
          style={{
            gap: GAP,
            transform: `translateX(${offset}px)`,
            transition: animate && !reduced ? `transform ${MOVE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
            visibility: sizes.slide ? 'visible' : 'hidden',
          }}
        >
          {LOOP.map((src, index) => {
            const isCurrent = index === position
            return (
              <img
                key={index}
                ref={index === 0 ? slideRef : undefined}
                src={src}
                alt={isCurrent ? galleryAlt(index % COUNT) : ''}
                aria-hidden={isCurrent ? undefined : true}
                width={970}
                height={700}
                draggable={false}
                loading={Math.abs(index - position) <= 2 ? 'eager' : 'lazy'}
                decoding="async"
                className={`aspect-[4/3] w-[78vw] shrink-0 rounded-3xl object-cover transition-opacity duration-500 sm:w-[56vw] lg:w-[40vw] ${
                  isCurrent ? 'opacity-100' : 'opacity-60'
                }`}
              />
            )
          })}
        </div>
      </div>

      <div className="mt-7 flex flex-col items-center gap-5">
        <div className="flex gap-2" aria-hidden="true">
          {SLIDES.map((_, index) => (
            <span
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? 'w-8 bg-orange' : 'w-2 bg-ink/25'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={arrow}>
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className={arrow}>
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
