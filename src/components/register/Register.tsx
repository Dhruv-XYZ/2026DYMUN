import { ChevronDown } from 'lucide-react'
import { Section } from '@/components/Section'
import { registrationButton, registrationTiers } from '@/data/registration.js'
import { sections } from '@/data/site.js'

const titleClass =
  'px-5 text-[clamp(4rem,13vw,11rem)] leading-[0.9] font-black tracking-[-0.05em] text-fg md:px-10'

/** The orange pill used for the registration button inside each dropdown. */
const registerButtonClass =
  'inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-orange px-10 text-[0.8rem] font-semibold tracking-[0.04em] text-ink uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]'

/**
 * Register: a plain title, then one row for each way to attend (name on the left, fee on
 * the right once it is set; "TBA" is not shown). Each row opens to its details and the registration button.
 */
export function Register({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const copy = sections.register

  return (
    <Section id="register" tone="cream" labelledBy="register-title" className="border-t-0 pt-28 pb-24 md:pt-36 md:pb-36">
      {headingLevel === 1 ? (
        <h1 id="register-title" className={titleClass}>
          {copy.label}
        </h1>
      ) : (
        <h2 id="register-title" className={titleClass}>
          {copy.label}
        </h2>
      )}

      {/* Two rows, Executive Board and Delegate. Each opens a dropdown with the
          registration button, which links to `registerUrl` in src/data/registration.js. */}
      <div className="mt-10 border-b border-line md:mt-14">
        {registrationTiers.map((tier, index) => (
          <details
            key={tier.id}
            className={`group ${index > 0 ? 'border-t border-line' : ''}`}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-7 marker:hidden md:px-10 md:py-9 [&::-webkit-details-marker]:hidden">
              <span className="text-3xl font-extrabold tracking-[-0.03em] uppercase md:text-5xl">{tier.name}</span>
              <span className="flex items-center gap-4 md:gap-8">
                {tier.fee && !/^TBA$/i.test(tier.fee.trim()) && (
                  <span className="text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">{tier.fee}</span>
                )}
                <ChevronDown
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 text-tone transition-transform duration-300 group-open:rotate-180 md:h-9 md:w-9"
                  strokeWidth={2.5}
                />
              </span>
            </summary>

            <div className="animate-in fade-in slide-in-from-top-2 flex flex-col items-start gap-6 px-5 pb-9 duration-300 md:flex-row md:items-center md:justify-between md:px-10 md:pb-12">
              <p className="max-w-[44ch] text-lg text-fg-muted">{tier.details}</p>

              {tier.registerUrl ? (
                <a href={tier.registerUrl} target="_blank" rel="noopener noreferrer" className={registerButtonClass}>
                  {registrationButton}
                </a>
              ) : (
                <button type="button" aria-disabled="true" className={registerButtonClass}>
                  {registrationButton}
                </button>
              )}
            </div>
          </details>
        ))}
      </div>

    </Section>
  )
}
