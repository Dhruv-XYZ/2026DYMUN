import { ArrowDownRight } from 'lucide-react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { hero, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'

import { HeroLogo } from './HeroLogo'

/** The giant outline wordmark. It draws itself on once and then holds still. */
function HeroWordmark() {
  return (
    <TextHoverEffect
      text={site.shortName.toUpperCase()}
      interactive={false}
      active
      alignStart
      duration={0.12}
    />
  )
}

export function Hero() {
  const navigate = useAnchorNavigate()

  const facts = [
    { term: 'Date', value: site.date === 'TBA' ? 'Date TBA' : site.date },
    { term: 'Venue', value: `${site.schoolShort}, ${site.city}` },
    { term: 'Length', value: site.duration },
  ]

  return (
    <section
      id="home"
      data-tone="dark"
      className="relative flex min-h-[100svh] flex-col overflow-x-clip bg-ink pt-24 pb-20 text-text md:pt-28 md:pb-0"
    >
      {/* The United Nations General Assembly Hall, under a dark linear gradient so the type
          on top stays readable. Decorative; the credit is in the footer. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          src="/hero/un-general-assembly.jpg"
          alt=""
          width={1600}
          height={1067}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgb(10 10 10 / 0.7) 0%, rgb(10 10 10 / 0.3) 38%, rgb(10 10 10 / 0.68) 72%, var(--color-ink) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgb(10 10 10 / 0.55) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* From 1024px the emblem stands beside the wordmark and is exactly as tall as it:
          the wordmark takes 76.2% of the row and the emblem the rest, which makes both
          the same height. Below 1024px the emblem sits under the wordmark instead. */}
      <div className="relative px-4 md:px-8 lg:flex lg:items-stretch">
        <div className="min-w-0 lg:w-[76.2%]">
          <HeroWordmark />
        </div>
        <HeroLogo placement="side" />
      </div>

      <HeroLogo placement="below" />

      <div className="relative mt-auto px-5 pt-10 pb-8 md:px-10">
        {/* The page heading is kept for screen readers and search engines. */}
        <h1 className="sr-only">{`${site.name}. ${hero.spoken}`}</h1>

        <div className="flex flex-col gap-7">
          <p className="max-w-[36ch] text-base text-text-muted md:text-lg">{site.tagline}</p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href="/#register"
              onClick={navigate}
              className="inline-flex h-12 items-center justify-center rounded-full bg-orange px-9 text-[0.8rem] font-semibold tracking-[0.2em] text-ink uppercase transition-colors duration-200 hover:bg-gold-light"
            >
              {hero.primaryCta}
            </a>

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

      <dl className="relative flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line px-5 py-5 md:gap-x-14 md:px-10">
        {facts.map((fact) => (
          <div key={fact.term}>
            <dt className="sr-only">{fact.term}</dt>
            <dd className="label whitespace-nowrap text-text max-md:text-[0.7rem] max-md:tracking-[0.1em]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
