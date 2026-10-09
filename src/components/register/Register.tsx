import { lazy, Suspense } from 'react'
import { Reveal } from '@/components/Reveal'
import { Section, SectionHeading } from '@/components/Section'
import { enquiryForm } from '@/data/enquiry.js'
import { registrationTiers } from '@/data/registration.js'
import { sections } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { useDeviceProfile } from '@/hooks/use-device'
import { EnquiryForm } from './EnquiryForm'

const CoverWord = lazy(() => import('./CoverWord'))

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

      <ul className="border-b border-line">
        {registrationTiers.map((tier, index) => (
          <li
            key={tier.id}
            tabIndex={0}
            className={`group px-5 py-7 md:px-10 md:py-9 ${index > 0 ? 'border-t border-line' : ''}`}
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className="display-row">{tier.name}</span>
              <span className="display-row text-outline">{tier.fee}</span>
            </div>
            <div className="reveal-row">
              <p className="overflow-hidden text-fg-muted">
                <span className="block pt-3">{tier.details}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

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
