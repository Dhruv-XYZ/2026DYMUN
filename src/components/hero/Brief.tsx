import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/Section'
import { PhotoCarousel } from './PhotoCarousel'
import { sections, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'

/** A short brief of DYMUN on a light band under the photo, with a link to the full About page. */
export function Brief() {
  const navigate = useAnchorNavigate()

  return (
    <Section id="brief" tone="cream" labelledBy="brief-title" className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
        <p className="label text-tone">{site.school}</p>
        <h2 id="brief-title" className="display-sm mt-4 text-fg">
          {site.name}
        </h2>
        <p className="mt-8 text-2xl leading-snug font-semibold tracking-[-0.02em] text-fg md:text-3xl">
          {sections.about.body[0]}
        </p>
        <p className="mx-auto mt-6 max-w-[48ch] text-lg text-fg-muted">{site.tagline}</p>
        <a
          href="/about"
          onClick={navigate}
          className="group mt-10 inline-flex items-center gap-2 text-lg font-semibold text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
        >
          More about DYMUN
          <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      <PhotoCarousel />
    </Section>
  )
}
