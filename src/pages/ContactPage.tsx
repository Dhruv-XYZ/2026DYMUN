import { useEffect, useRef, useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/Section'
import { pages, site } from '@/data/site.js'
import { usePageMeta } from '@/hooks/use-page-meta'
import { gradeList } from '@/lib/committees'

/**
 * Web3Forms access key. Set VITE_WEB3FORMS_ACCESS_KEY in the environment (in Vercel:
 * Project → Settings → Environment Variables, then redeploy). The key is meant to be
 * public, so it is fine in the browser. Until it is set, the form shows a notice and
 * points people to the email address instead of sending.
 */
const ACCESS_KEY: string = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? ''

/**
 * hCaptcha. On Web3Forms' free plan this is their own site key (no hCaptcha account
 * needed); Web3Forms checks the answer itself once hCaptcha is switched on for the form
 * in the Web3Forms dashboard. hCaptcha does not run on localhost, so local development
 * uses hCaptcha's official test key, which always passes.
 */
const HCAPTCHA_SITE_KEY = import.meta.env.DEV
  ? '10000000-ffff-ffff-ffff-000000000001'
  : '50b2fe65-b00b-4b9e-ad62-3ba471098be2'

type HCaptcha = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  getResponse: (widgetId?: string) => string
  reset: (widgetId?: string) => void
}

declare global {
  interface Window {
    hcaptcha?: HCaptcha
    onHCaptchaLoad?: () => void
  }
}

/** Loads hCaptcha's script once and draws the checkbox into `container`. Returns the widget id. */
function useHCaptcha(container: RefObject<HTMLDivElement | null>) {
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    const draw = () => {
      if (!container.current || widgetId.current !== null || !window.hcaptcha) return
      widgetId.current = window.hcaptcha.render(container.current, {
        sitekey: HCAPTCHA_SITE_KEY,
        theme: 'light',
      })
    }
    if (window.hcaptcha) {
      draw()
      return
    }
    window.onHCaptchaLoad = draw
    if (!document.querySelector('script[data-hcaptcha]')) {
      const script = document.createElement('script')
      script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=onHCaptchaLoad&recaptchacompat=off'
      script.async = true
      script.defer = true
      script.dataset.hcaptcha = ''
      document.head.appendChild(script)
    }
  }, [container])

  return widgetId
}

type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'notConnected' | 'needsCaptcha'

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

const fieldClass =
  'mt-2 block w-full rounded-2xl border border-line bg-[color-mix(in_srgb,var(--color-cream)_55%,white)] px-5 py-4 text-lg text-fg outline-none transition-colors duration-200 placeholder:text-fg-muted focus:border-tone focus:ring-2 focus:ring-tone/30'

const labelClass = 'block text-base font-bold text-fg'

const choiceClass =
  'flex cursor-pointer items-center justify-center rounded-full border border-line px-6 py-3 text-base font-bold text-fg transition-colors duration-200 hover:border-tone has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-text has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tone has-[:focus-visible]:ring-offset-2'

const buttonClass =
  'inline-flex h-13 items-center justify-center gap-2 rounded-full bg-orange px-8 py-4 text-base font-bold text-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

/**
 * /contact: an enquiry form (name, whether they are a DYPIS student, grade, email and
 * the enquiry itself, up to 500 words) that sends through Web3Forms.
 */
export default function ContactPage() {
  const copy = pages.contact
  usePageMeta('contact')

  const [enquiry, setEnquiry] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const captchaRef = useRef<HTMLDivElement>(null)
  const captchaId = useHCaptcha(captchaRef)

  const words = countWords(enquiry)
  const overLimit = words > copy.wordLimit

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (overLimit || status === 'sending') return
    if (!ACCESS_KEY) {
      setStatus('notConnected')
      return
    }

    const captchaToken = window.hcaptcha?.getResponse(captchaId.current ?? undefined) ?? ''
    if (!captchaToken) {
      setStatus('needsCaptcha')
      return
    }

    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `DYMUN '26 enquiry from ${data.name}`,
          from_name: "DYMUN '26 website",
          ...data,
          'h-captcha-response': captchaToken,
        }),
      })
      const result = (await response.json()) as { success?: boolean }
      if (!result.success) throw new Error('Web3Forms did not accept the enquiry')
      form.reset()
      setEnquiry('')
      setStatus('sent')
    } catch {
      setStatus('failed')
    } finally {
      // Each answer can be used once, so the checkbox is cleared for any next try.
      window.hcaptcha?.reset(captchaId.current ?? undefined)
    }
  }

  const emailLink = (
    <a href={`mailto:${site.contact.email}`} className="font-bold underline decoration-tone underline-offset-4">
      {site.contact.email}
    </a>
  )

  return (
    <Section tone="cream" labelledBy="contact-page-title" className="min-h-[100svh] border-t-0 pt-28 pb-24 md:pt-36 md:pb-36">
      <div className="px-5 md:px-10">
        <h1
          id="contact-page-title"
          className="text-[clamp(2.75rem,8vw,7rem)] leading-none font-extrabold tracking-[-0.04em] text-fg"
        >
          {copy.title}
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-fg md:text-xl">{copy.intro}</p>

        <form onSubmit={onSubmit} className="mt-12 grid max-w-3xl gap-8 md:mt-16">
          {/* Web3Forms' spam trap: people never see or fill it. */}
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />

          <div>
            <label htmlFor="contact-name" className={labelClass}>
              {copy.name}
            </label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required className={fieldClass} />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <fieldset>
              <legend className={labelClass}>{copy.dypis}</legend>
              <div className="mt-2 flex gap-3">
                {[copy.yes, copy.no].map((answer) => (
                  <label key={answer} className={choiceClass}>
                    <input type="radio" name="dypis_student" value={answer} required className="sr-only" />
                    {answer}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="contact-grade" className={labelClass}>
                {copy.grade}
              </label>
              <select id="contact-grade" name="grade" required defaultValue="" className={`${fieldClass} appearance-none`}>
                <option value="" disabled>
                  {copy.gradePlaceholder}
                </option>
                {gradeList.map((grade) => (
                  <option key={grade} value={`Grade ${grade}`}>
                    Grade {grade}
                  </option>
                ))}
                <option value={copy.notStudent}>{copy.notStudent}</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              {copy.email}
            </label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required className={fieldClass} />
          </div>

          <div>
            <label htmlFor="contact-enquiry" className={labelClass}>
              {copy.enquiry}
            </label>
            <textarea
              id="contact-enquiry"
              name="enquiry"
              required
              rows={7}
              value={enquiry}
              onChange={(event) => setEnquiry(event.target.value)}
              aria-describedby="contact-enquiry-count"
              aria-invalid={overLimit || undefined}
              className={`${fieldClass} resize-y ${overLimit ? 'border-orange focus:border-orange' : ''}`}
            />
            <p id="contact-enquiry-count" className={`mt-2 text-sm ${overLimit ? 'font-bold text-fg' : 'text-fg-muted'}`}>
              {words} / {copy.wordLimit} {copy.words}
              {overLimit && <span> · {copy.overLimit}</span>}
            </p>
          </div>

          {/* hCaptcha's "I am human" checkbox, drawn here by useHCaptcha. */}
          <div ref={captchaRef} className="min-h-[78px]" />

          <div>
            <button type="submit" disabled={overLimit || status === 'sending'} className={buttonClass}>
              {status === 'sending' ? copy.sending : copy.submit}
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </button>

            <p role="status" aria-live="polite" className="mt-5 max-w-[60ch] text-base leading-relaxed text-fg">
              {status === 'sent' && copy.sent}
              {status === 'needsCaptcha' && copy.captchaMissing}
              {status === 'failed' && (
                <>
                  {copy.failed} {emailLink}.
                </>
              )}
              {status === 'notConnected' && (
                <>
                  {copy.notConnected} {emailLink}.
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </Section>
  )
}
