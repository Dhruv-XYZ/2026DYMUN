import { lazy, Suspense } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section, SectionHeading } from '@/components/Section'
import { enquiryForm } from '@/data/enquiry.js'
import { registrationButton, registrationTiers } from '@/data/registration.js'
import { sections } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { useDeviceProfile } from '@/hooks/use-device'
import { EnquiryForm } from './EnquiryForm'

const CoverWord = lazy(() => import('./CoverWord'))

/** The orange pill used for the registration button inside each dropdown. */
const registerButtonClass =
  'inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-orange px-10 text-[0.8rem] font-semibold tracking-[0.2em] text-ink uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]'

/**
 * The closing call to action: the headline, three open rows for the ways to attend
 * (name on the left, fee on the right, details on hover), then the form.
 */
export function Register() {
  const { touch, reducedMotion, lowPower } = useDeviceProfile()
  const navigate = useAnchorNavigate()
  const copy = sections.register

  // The warp-speed word needs a cursor to hover with, and is skipped where it would lag.
  const warp = !touch && !reducedMotion && !lowPower

  return (
    <Section id="register" tone="cream" noise labelledBy="register-title" className="pb-24 md:pb-36">
      <SectionHeading
        id="register-title"
        number="06"
        label={copy.label}
        lead={copy.lead}
        accent={
          warp ? (
            <Suspense fallback={copy.accent}>
              <CoverWord>{copy.accent}</CoverWord>
            </Suspense>
          ) : (
            copy.accent
          )
        }
      />

      {/* Two rows, Executive Board and Delegate. Each opens a dropdown with the
          registration button, which links to `registerUrl` in src/data/registration.js. */}
      <div className="border-b border-line">
        {registrationTiers.map((tier, index) => (
          <details
            key={tier.id}
            className={`group ${index > 0 ? 'border-t border-line' : ''}`}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-7 marker:hidden md:px-10 md:py-9 [&::-webkit-details-marker]:hidden">
              <span className="display-row">{tier.name}</span>
              <span className="flex items-center gap-4 md:gap-8">
                <span className="display-row text-outline">{tier.fee}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-8 w-8 shrink-0 text-tone transition-transform duration-300 group-open:rotate-180 md:h-12 md:w-12"
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

      <div className="grid gap-10 px-5 pt-20 md:px-10 md:pt-28 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)]">
        <Reveal>
          <p className="text-2xl font-extrabold tracking-[-0.02em] uppercase">{enquiryForm.title}</p>
          <p className="mt-4 max-w-[28ch] text-fg-muted">{enquiryForm.intro}</p>
          <a
            href="/committees"
            onClick={navigate}
            className="mt-6 inline-block text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors hover:text-orange hover:decoration-orange"
          >
            Read every committee agenda
          </a>
          <br />
          <a
            href="/contact"
            onClick={navigate}
            className="mt-3 inline-block text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors hover:text-orange hover:decoration-orange"
          >
            Contact details
          </a>
        </Reveal>
        <EnquiryForm />
      </div>
    </Section>
  )
}
