import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { ArrowDownRight } from 'lucide-react'
import { MaskedLines } from '@/components/Reveal'
import { ContainerTextFlip } from '@/components/ui/container-text-flip'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { MovingBorderButton } from '@/components/ui/moving-border'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { hero, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { useDeviceProfile } from '@/hooks/use-device'

const HeroBackdrop = lazy(() => import('./HeroBackdrop'))

/**
 * The giant outline wordmark. It follows the cursor anywhere in the hero, not only
 * over the letters. Kept as its own component so cursor movement re-renders just this.
 */
function HeroWordmark({
  sectionRef,
  interactive,
  active,
}: {
  sectionRef: RefObject<HTMLElement | null>
  interactive: boolean
  active: boolean
}) {
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !interactive) return

    const move = (event: PointerEvent) => setPointer({ x: event.clientX, y: event.clientY })
    const leave = () => setPointer(null)
    section.addEventListener('pointermove', move)
    section.addEventListener('pointerleave', leave)
    return () => {
      section.removeEventListener('pointermove', move)
      section.removeEventListener('pointerleave', leave)
    }
  }, [sectionRef, interactive])

  return (
    <TextHoverEffect
      text={site.shortName.toUpperCase()}
      pointer={interactive ? pointer : null}
      interactive={interactive}
      active={active}
      duration={0.12}
    />
  )
}

/** `ready` turns true when the preloader has left; the entrance waits for it. */
export function Hero({ ready }: { ready: boolean }) {
  const { reducedMotion, touch, lite } = useDeviceProfile()
  const sectionRef = useRef<HTMLElement>(null)
  const navigate = useAnchorNavigate()

  // Cursor effects only where there is a real cursor and motion is welcome.
  const cursorEffects = !touch && !reducedMotion

  const facts = [
    { term: 'Date', value: site.date === 'TBA' ? 'Date TBA' : site.date },
    { term: 'Venue', value: `${site.schoolShort}, ${site.city}` },
    { term: 'Length', value: site.duration },
  ]

  return (
    <section
      ref={sectionRef}
      id="home"
      data-tone="dark"
      className="grain relative flex min-h-[100svh] flex-col overflow-x-clip bg-ink pt-24 pb-20 text-text md:pt-28 md:pb-0"
    >
      <div className="relative px-4 md:px-8">
        <HeroWordmark sectionRef={sectionRef} interactive={cursorEffects} active={ready} />
      </div>

      {/* After the wordmark on purpose: the dots then show through the letters too. */}
      <Suspense fallback={null}>
        <HeroBackdrop animated={!lite} />
      </Suspense>

      <div className="relative mt-auto grid gap-10 px-5 pt-10 pb-8 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-16">
        {/* Screen readers get one steady sentence instead of a word that keeps changing. */}
        <h1 aria-label={`${site.name}. ${hero.spoken}`} className="display-hero">
          <span aria-hidden="true" className="block">
            <MaskedLines show={ready} lines={[hero.lead]} />
            <span className="block">
              <ContainerTextFlip
                words={hero.words}
                paused={reducedMotion || !ready}
                className="serif-accent text-[1.06em] text-gold-light"
              />
            </span>
            <MaskedLines
              show={ready}
              delay={0.2}
              lines={[
                <span key="close" className="shiny inline-block">
                  {hero.close}
                </span>,
              ]}
            />
          </span>
        </h1>

        <div className="flex flex-col gap-7 lg:pb-4">
          <p className="max-w-[36ch] text-base text-text-muted md:text-lg">{site.tagline}</p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <MagneticButton
              strength={0.35}
              maxDistance={16}
              disabled={!cursorEffects}
              className="-m-3 p-3"
            >
              <MovingBorderButton
                as="a"
                href="/#register"
                onClick={navigate}
                borderRadius="999px"
                rx="28"
                ry="28"
                duration={3200}
                paused={reducedMotion}
                className="px-9 text-[0.8rem] tracking-[0.2em] uppercase"
              >
                {hero.primaryCta}
              </MovingBorderButton>
            </MagneticButton>

            <a
              href="/#committees"
              onClick={navigate}
              className="group inline-flex items-center gap-2 text-sm font-medium text-text underline decoration-gold/60 decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
            >
              {hero.secondaryCta}
              <ArrowDownRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>

      <dl className="relative flex items-center gap-x-3 border-t border-line px-5 py-5 md:gap-x-6 md:px-10">
        {facts.map((fact, index) => (
          <div key={fact.term} className="flex items-center gap-3 md:gap-6">
            {index > 0 && <span aria-hidden="true" className="h-3 w-px bg-line" />}
            <dt className="sr-only">{fact.term}</dt>
            <dd className="label whitespace-nowrap text-text max-md:text-[0.6rem] max-md:tracking-[0.14em]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
