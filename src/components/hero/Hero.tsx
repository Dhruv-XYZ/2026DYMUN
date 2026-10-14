import { ArrowDownRight } from 'lucide-react'
import { hero, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'

/**
 * The top of the home page: a wide photo of the United Nations General Assembly Hall
 * with one short card on it, the name, the three facts and the way to register.
 * The photo is decorative (its credit is in the footer); it sits under a dark linear
 * gradient so the card and the edges stay clear.
 */
export function Hero() {
  const navigate = useAnchorNavigate()

  return (
    <section
      id="home"
      data-tone="dark"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-x-clip bg-ink pt-20 pb-10 text-text md:min-h-[100svh]"
    >
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
      </div>

      <h1 className="sr-only">{`${site.name}. ${hero.spoken}`}</h1>

      <div className="relative mx-5 flex w-full max-w-xl flex-col items-center border border-gold/40 bg-ink/85 px-6 py-10 text-center md:mx-10 md:px-10 md:py-12">
        <img
          src={site.munLogoSrc}
          alt=""
          width={1000}
          height={786}
          decoding="async"
          className="h-20 w-auto md:h-24"
        />
        <p aria-hidden="true" className="display mt-6 text-[clamp(3.25rem,11vw,5.75rem)] leading-[0.9]">
          {site.shortName}
          <span className="serif-accent ml-2 text-[0.5em] text-gold-light">{site.edition}</span>
        </p>

        <p className="label mt-6 text-text">{site.date}</p>
        <p className="label mt-2 text-text">{site.venueLine}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <a
            href="/register"
            onClick={navigate}
            className="inline-flex h-12 items-center justify-center rounded-full bg-orange px-9 text-[0.8rem] font-semibold tracking-[0.04em] text-ink uppercase transition-colors duration-200 hover:bg-gold-light"
          >
            {hero.primaryCta}
          </a>
          <a
            href="/committees"
            onClick={navigate}
            className="group inline-flex items-center gap-2 text-sm font-medium text-text underline decoration-gold/60 decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
          >
            {hero.secondaryCta}
            <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
