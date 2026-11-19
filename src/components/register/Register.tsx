import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/Section'
import { registerUrl, registrationCardLabel, registrationHeading } from '@/data/registration.js'
import { site } from '@/data/site.js'
import { withBase } from '@/lib/base'

const headingClass =
  'mt-10 text-center text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] font-black tracking-[-0.04em] text-fg uppercase md:mt-14'

/**
 * Register: a glass card with the DYMUN and school logos that opens the registration form
 * (`registerUrl` in src/data/registration.js) in a new tab, and the heading beneath it.
 */
export function Register({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'

  return (
    <Section id="register" tone="cream" labelledBy="register-title" className="border-t-0 pt-28 pb-24 md:pt-36 md:pb-36">
      <div className="flex flex-col items-center px-5 md:px-10">
        <div className="glass-stage">
          <a
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${registrationCardLabel} (opens in a new tab)`}
            className="glass-card group flex w-full flex-col items-center gap-8 rounded-3xl px-6 py-10 transition-transform duration-200 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-tone focus-visible:ring-offset-2 md:px-12 md:py-14"
          >
            <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
              <img
                src={withBase(site.schoolLogoSrc)}
                alt="D Y Patil International School"
                className="h-24 w-auto object-contain md:h-32"
              />
              <span aria-hidden="true" className="h-px w-full max-w-64 bg-ink/60 sm:h-28 sm:w-px sm:max-w-none sm:bg-line" />
              <img src={withBase(site.munLogoSrc)} alt="DYMUN '26 emblem" className="h-24 w-auto object-contain md:h-32" />
            </div>
            <span className="group/btn relative inline-flex h-16 overflow-hidden rounded-full p-[2px] md:h-20">
              <span
                aria-hidden="true"
                className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f3dd9b_0%,#9a7421_50%,#f3dd9b_100%)] motion-reduce:animate-none"
              />
              <span className="relative inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-ink px-12 text-base font-semibold tracking-[0.04em] md:px-16 md:text-lg text-white uppercase transition-colors duration-300 group-hover/btn:text-ink">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[linear-gradient(to_right,#c9a24b,#e6c877,#c9a24b)] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
                />
                <span className="relative inline-flex items-center gap-2">
                  {registrationCardLabel}
                  <ArrowUpRight aria-hidden="true" className="size-5 md:size-6" />
                </span>
              </span>
            </span>
          </a>
        </div>

        <Heading id="register-title" className={headingClass}>
          {registrationHeading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Heading>
      </div>
    </Section>
  )
}
