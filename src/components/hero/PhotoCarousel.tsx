import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { galleryAlt, galleryTiles } from '@/lib/gallery'

const SLIDES = galleryTiles.slice(0, 10)
const AUTO_MS = 4500

/**
 * A row of photos at the end of the home page brief. Swipe or use the arrows; it also moves on by
 * itself every few seconds, pausing while the pointer or focus is on it and when reduced
 * motion is on. Photos come from public/gallery (placeholders until real ones are added).
 */
export function PhotoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  const goTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const count = SLIDES.length
    const target = ((index % count) + count) % count
    const slide = track.children[target] as HTMLElement | undefined
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' })
  }, [])

  // Keep the active dot in step with swiping and scrolling.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const width = (track.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1
      setActive(Math.round(track.scrollLeft / (width + 20)))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (paused || reduced) return
    const timer = window.setInterval(() => goTo(active + 1), AUTO_MS)
    return () => window.clearInterval(timer)
  }, [active, paused, reduced, goTo])

  const arrow =
    'flex h-12 w-12 items-center justify-center rounded-full bg-ink text-text transition-colors duration-200 hover:bg-orange hover:text-ink'

  return (
    <div aria-label="Photos" role="region" className="mt-14 md:mt-20">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={galleryAlt(index)}
              width={970}
              height={700}
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="aspect-[4/3] w-[85%] shrink-0 snap-start rounded-3xl object-cover sm:w-[60%] lg:w-[42%]"
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-6 px-5 md:px-10">
          <div className="flex gap-2" aria-hidden="true">
            {SLIDES.map((_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === active ? 'w-8 bg-orange' : 'w-2 bg-ink/25'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" aria-label="Previous photo" onClick={() => goTo(active - 1)} className={arrow}>
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => goTo(active + 1)} className={arrow}>
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
