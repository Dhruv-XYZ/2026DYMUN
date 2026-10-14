import { lazy, Suspense, useState } from 'react'
import { Play } from 'lucide-react'
import { Section } from '@/components/Section'
import { site } from '@/data/site.js'

const GlobeZoom = lazy(() => import('@/components/about/GlobeZoom'))

/**
 * A short welcome under the photo: one sentence on the left, and on the right a card
 * that plays the welcome video from the school (the same clip as the globe zoom).
 */
export function Welcome() {
  const [playing, setPlaying] = useState(false)

  return (
    <Section id="welcome" tone="cream" labelledBy="welcome-title" className="py-16 md:py-24">
      <div className="grid items-center gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="label text-tone">{site.school}</p>
          <h2 id="welcome-title" className="display-sm mt-4 text-fg">
            {site.name}
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg text-fg-muted md:text-xl">{site.tagline}</p>
        </div>

        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play the welcome video from ${site.schoolShort}`}
          className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-ink"
        >
          <img
            src={site.munLogoSrc}
            alt=""
            width={1000}
            height={786}
            loading="lazy"
            decoding="async"
            className="h-3/5 w-auto opacity-90"
          />
          <span className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-orange text-ink transition-transform duration-200 group-hover:scale-110">
            <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current" />
          </span>
        </button>
      </div>

      {playing && (
        <Suspense fallback={null}>
          <GlobeZoom onClose={() => setPlaying(false)} />
        </Suspense>
      )}
    </Section>
  )
}
