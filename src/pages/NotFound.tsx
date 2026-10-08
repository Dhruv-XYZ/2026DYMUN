import { ArrowUpRight } from 'lucide-react'
import { Section, SectionHeading } from '@/components/Section'
import { pages } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { usePageTitle } from '@/hooks/use-page-title'

/** Shown for any address that is not a page of the site. */
export default function NotFound() {
  const copy = pages.notFound
  const navigate = useAnchorNavigate()
  usePageTitle(`${copy.lead} ${copy.accent}`)

  return (
    <Section tone="dark" labelledBy="not-found-title" className="min-h-[100svh] pb-24 md:pb-36">
      <SectionHeading
        level={1}
        id="not-found-title"
        number="404"
        label={copy.label}
        lead={copy.lead}
        accent={copy.accent}
      />

      <div className="px-5 pt-12 md:px-10">
        <a
          href="/"
          onClick={navigate}
          className="group inline-flex items-center gap-3 text-lg font-semibold text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
        >
          {copy.back}
          <ArrowUpRight
            aria-hidden="true"
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </Section>
  )
}
