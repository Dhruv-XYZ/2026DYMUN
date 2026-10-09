import { lazy, Suspense } from 'react'
import { MaskedLines } from '@/components/Reveal'
import { WavyBackground } from '@/components/ui/wavy-background'
import { sections } from '@/data/site.js'
import { useDeviceProfile } from '@/hooks/use-device'

const SparkleStrip = lazy(() => import('./SparkleStrip'))

/**
 * A full-width statement between the Team and Register sections: the tagline's own
 * closing line over slow orange and gold waves, with a sparkling rule beneath it.
 * Decorative waves and sparkles; the words are real text.
 */
export function Interlude() {
  const { reducedMotion, lowPower, small } = useDeviceProfile()
  const copy = sections.interlude

  // The waves hold still for reduced motion and weak devices, and the sparkles are
  // left out there altogether.
  const still = reducedMotion || lowPower
  const sparkles = !reducedMotion && !lowPower

  return (
    <section
      data-tone="dark"
      aria-label={copy.label}
      className="relative isolate w-full overflow-x-clip bg-ink text-text"
    >
      <WavyBackground
        paused={still}
        backgroundFill="#0a0a0a"
        waveOpacity={0.42}
        blur={small ? 12 : 16}
        waveWidth={small ? 36 : 56}
        speed="slow"
        containerClassName="min-h-[78svh] w-full py-28 md:py-40"
        className="w-full px-5 md:px-10"
      >
        <p className="display-section text-center">
          <MaskedLines
            lines={[
              copy.lines[0],
              <span key="accent" className="serif-accent text-[1.06em] text-gold-light">
                {copy.lines[1]}
              </span>,
              copy.lines[2],
            ]}
          />
        </p>

        <div className="mt-10">
          {sparkles && (
            <Suspense fallback={<div className="h-24" />}>
              <SparkleStrip />
            </Suspense>
          )}
        </div>
      </WavyBackground>
    </section>
  )
}
