import { Component, lazy, Suspense, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { useInView } from 'motion/react'
import { Reveal } from '@/components/Reveal'
import { Highlight } from '@/components/ui/hero-highlight'
import { Section, SectionHeading } from '@/components/Section'
import { sections, site } from '@/data/site.js'
import { useDeviceProfile } from '@/hooks/use-device'
import { committeeCount, gradeMax, gradeMin, gradeRange } from '@/lib/committees'
import { cn } from '@/lib/utils'

// Both are heavy for what the first screen needs, so each loads on its own.
const GlobeStage = lazy(() => import('./GlobeStage'))
const CanvasText = lazy(() =>
  import('@/components/ui/canvas-text').then((module) => ({ default: module.CanvasText })),
)

/**
 * A still globe drawn in SVG. Shown on phones, low-power devices and when reduced
 * motion is on, and as the stand-in while the 3D globe loads.
 */
function StaticGlobe() {
  const r = 170
  const parallels = [-60, -30, 0, 30, 60]
  const meridians = [0, 30, 60, 90, 120, 150]

  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Globe" className="h-full w-full">
      <circle cx="200" cy="200" r={r} className="fill-ink" />
      <g className="fill-none stroke-gold/45" strokeWidth="1">
        {parallels.map((lat) => {
          const angle = (lat * Math.PI) / 180
          const rx = r * Math.cos(angle)
          return (
            <ellipse key={lat} cx="200" cy={200 - r * Math.sin(angle) * 0.94} rx={rx} ry={rx * 0.2} />
          )
        })}
        {meridians.map((lng) => (
          <ellipse
            key={lng}
            cx="200"
            cy="200"
            rx={Math.abs(r * Math.cos((lng * Math.PI) / 180))}
            ry={r}
          />
        ))}
      </g>
      <circle cx="200" cy="200" r={r} className="fill-none stroke-gold" strokeWidth="1.5" />
      <g className="fill-none stroke-orange" strokeWidth="1.5" strokeLinecap="round">
        <path d="M232 168 Q 150 56 92 150" />
        <path d="M232 168 Q 300 86 326 190" />
        <path d="M232 168 Q 214 292 126 284" />
      </g>
      <circle cx="232" cy="168" r="5" className="fill-orange" />
    </svg>
  )
}

/**
 * If the 3D globe cannot start (no WebGL, a blocked download), show the still globe
 * instead of letting the error take the whole page down.
 */
class GlobeBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Fills {days}, {count} and {grades} in the copy from the data, so the numbers cannot drift. */
function fill(text: string): string {
  return text
    .replace('{days}', String(site.days))
    .replace('{count}', String(committeeCount))
    .replace('{grades}', `${gradeMin} to ${gradeMax}`)
}

export function About() {
  const { lite, reducedMotion, lowPower } = useDeviceProfile()
  const copy = sections.about

  // The real globe runs on phones too (swipe sideways to spin; vertical swipes still
  // scroll the page). It is replaced by the still picture only for visitors who asked
  // for less motion or whose device reports very little power, and even they can
  // switch the real globe on with a button.
  const [forced, setForced] = useState(false)
  const stillOnly = (reducedMotion || lowPower) && !forced

  const stageRef = useRef<HTMLDivElement>(null)
  // Start loading the globe a little before it scrolls in; render it only while visible.
  const near = useInView(stageRef, { once: true, margin: '500px 0px' })
  const visible = useInView(stageRef, { margin: '100px 0px' })

  const word = copy.accent.toUpperCase()
  const plainWord = <span className="text-outline">{word}</span>

  const [first, ...rest] = copy.body.map(fill)
  const stats = [
    { value: String(site.days), label: copy.stats.days },
    { value: String(committeeCount), label: copy.stats.committees },
    { value: gradeRange, label: copy.stats.grades },
  ]

  return (
    <Section id="about" tone="cream" noise labelledBy="about-title" className="pb-20 md:pb-32">
      <SectionHeading
        id="about-title"
        number="01"
        label={copy.label}
        lead={copy.lead}
        accentClassName="inline-block"
        accent={
          lite ? (
            plainWord
          ) : (
            <Highlight className="align-bottom">
              <Suspense fallback={plainWord}>
                <CanvasText
                  text={word}
                  backgroundClassName="bg-ink-text"
                  lineGap={8}
                  lineWidth={2}
                  curveIntensity={36}
                  animationDuration={10}
                />
              </Suspense>
            </Highlight>
          )
        }
      />

      <div className="grid items-center gap-12 px-5 pt-12 md:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
        <div>
          <Reveal>
            <p className="max-w-[24ch] text-2xl leading-snug font-semibold tracking-[-0.02em] md:text-3xl">
              {first}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-6 max-w-[46ch] space-y-4 text-fg-muted">
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <dl className="mt-14 grid grid-cols-3 border-t border-line">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn('flex flex-col-reverse pt-6', index > 0 && 'border-l border-line pl-4 md:pl-6')}
              >
                <dt className="label mt-3 text-fg-muted max-md:text-[0.56rem] max-md:tracking-[0.1em]">
                  {stat.label}
                </dt>
                <dd className="text-[clamp(2.25rem,4.6vw,5rem)] leading-none font-black tracking-[-0.05em] whitespace-nowrap">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto w-full max-w-[52rem]">
          <div ref={stageRef} className="relative aspect-square w-full">
            {stillOnly ? (
              <StaticGlobe />
            ) : (
              near && (
                <GlobeBoundary fallback={<StaticGlobe />}>
                  <Suspense fallback={<StaticGlobe />}>
                    <GlobeStage active={visible} still={reducedMotion} />
                  </Suspense>
                </GlobeBoundary>
              )
            )}
          </div>

          {/* Free text beside the globe: where it points, and how to move it. */}
          <div className="mt-2 flex items-start justify-between gap-6 border-t border-line pt-5">
            <div>
              <p className="text-xl font-extrabold tracking-[-0.02em] uppercase">
                {site.city}, {copy.globe.country}
              </p>
              <p className="mt-1 max-w-[30ch] text-sm text-fg-muted">{copy.globe.caption}</p>
            </div>
            {stillOnly ? (
              <button
                type="button"
                onClick={() => setForced(true)}
                className="label shrink-0 text-right underline decoration-tone decoration-1 underline-offset-8 transition-colors hover:text-orange hover:decoration-orange"
              >
                {copy.globe.enable}
              </button>
            ) : (
              <p className="label flex shrink-0 items-center gap-2 text-fg-muted">
                <MoveHorizontal aria-hidden="true" className="h-4 w-4 text-tone" />
                {copy.globe.hint}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
