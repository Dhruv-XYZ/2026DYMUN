import { Section } from '@/components/Section'
import { registerUrl, registrationButton } from '@/data/registration.js'
import { sections } from '@/data/site.js'

const titleClass =
  'px-5 text-[clamp(4rem,13vw,11rem)] leading-[0.9] font-black tracking-[-0.05em] text-fg md:px-10'

/** The orange pill that links to the registration form. */
const registerButtonClass =
  'inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-orange px-10 text-[0.8rem] font-semibold tracking-[0.04em] text-ink uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]'

/**
 * Register: a plain title and one button that opens the registration form
 * (`registerUrl` in src/data/registration.js) in a new tab.
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

      <div className="mt-10 px-5 md:mt-14 md:px-10">
        <a href={registerUrl} target="_blank" rel="noopener noreferrer" className={registerButtonClass}>
          {registrationButton}
        </a>
      </div>
    </Section>
  )
}
