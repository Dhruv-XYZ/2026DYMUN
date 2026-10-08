import { lazy, Suspense, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useInView } from 'motion/react'
import { Section, SectionHeading } from '@/components/Section'
import { pages, sections } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { useDeviceProfile } from '@/hooks/use-device'

const MarqueeStage = lazy(() => import('./MarqueeStage'))

/** Almost no text: a headline and a full-width tilted wall of photos. */
export function Gallery() {
  const { reducedMotion, small, lowPower } = useDeviceProfile()
  const navigate = useAnchorNavigate()
  const copy = sections.gallery

  const stageRef = useRef<HTMLDivElement>(null)
  const near = useInView(stageRef, { once: true, margin: '500px 0px' })

  return (
    <Section id="gallery" tone="dark" labelledBy="gallery-title">
      <SectionHeading
        id="gallery-title"
        number="04"
        label={copy.label}
        lead={copy.lead}
        accent={copy.accent}
      />

      <div ref={stageRef} className="h-[70vh] min-h-[26rem] md:h-[88vh]">
        {near && (
          <Suspense fallback={null}>
            <MarqueeStage paused={reducedMotion} speed={small || lowPower ? 0.5 : 1} />
          </Suspense>
        )}
      </div>

      <div className="border-t border-line px-5 py-8 md:px-10">
        <a
          href="/gallery"
          onClick={navigate}
          className="group inline-flex items-center gap-3 text-lg font-semibold text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
        >
          {pages.gallery.link}
          <ArrowUpRight
            aria-hidden="true"
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </Section>
  )
}
