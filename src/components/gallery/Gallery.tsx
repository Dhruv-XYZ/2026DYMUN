import { lazy, Suspense, useRef } from 'react'
import { useInView } from 'motion/react'
import { Section, SectionHeading } from '@/components/Section'
import { sections } from '@/data/site.js'
import { useDeviceProfile } from '@/hooks/use-device'

const MarqueeStage = lazy(() => import('./MarqueeStage'))

/** Almost no text: a headline and a full-width tilted wall of photos. */
export function Gallery() {
  const { reducedMotion, small, lowPower } = useDeviceProfile()
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
    </Section>
  )
}
