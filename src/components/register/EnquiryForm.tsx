import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { StatefulButton } from '@/components/ui/stateful-button'
import {
  enquiryForm as copy,
  isEnquiryOpen,
  LIMITS,
  WEB3FORMS_ACCESS_KEY,
  WEB3FORMS_ENDPOINT,
} from '@/data/enquiry.js'
import { site } from '@/data/site.js'
import { cn } from '@/lib/utils'

type FieldName = 'name' | 'email' | 'phone' | 'school' | 'message'
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName | 'form', string>>
type Status = 'idle' | 'loading' | 'success' | 'error' | 'closed'

const EMPTY: Values = { name: '', email: '', phone: '', school: '', message: '' }
const FIELD_ORDER: FieldName[] = ['name', 'email', 'phone', 'school', 'message']

/** Presence and range checks. Returns an error for each field that fails. */
function validate(values: Values): Errors {
  const errors: Errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const phone = values.phone.trim()
  const school = values.school.trim()
  const message = values.message.trim()

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) errors.name = copy.errors.name

  if (!email) errors.email = copy.errors.email
  else if (email.length > LIMITS.email.max) errors.email = copy.errors.emailLong
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = copy.errors.emailFormat

  if (phone) {
    const digits = phone.replace(/\D/g, '').length
    // Only digits and the usual separators are allowed in a phone number.
    if (!/^[+\d\s().-]+$/.test(phone) || digits < LIMITS.phone.minDigits || digits > LIMITS.phone.maxDigits) {
      errors.phone = copy.errors.phone
    }
  }

  if (school.length > LIMITS.school.max) errors.school = copy.errors.school

  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
    errors.message = copy.errors.message
  }
  return errors
}

/** Underline-only controls: the fields sit on the page, not in boxes. */
const control =
  'mt-2 block w-full appearance-none rounded-none border-0 border-b border-line bg-transparent px-0 py-3 text-xl font-medium text-fg placeholder:text-fg-muted/70 aria-invalid:border-b-2 aria-invalid:border-orange'

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label block text-fg-muted">
          {label}
        </label>
        {hint && <span className="label text-fg-muted">{hint}</span>}
      </div>
      {children}
      <p
        id={`${id}-error`}
        className={cn('mt-2 flex items-center gap-2 text-sm font-medium text-fg', !error && 'hidden')}
      >
        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-orange" />
        {error}
      </p>
    </div>
  )
}

/**
 * Enquiry form, sent through Web3Forms. Spam is kept out three ways:
 * 1. presence and range checks on every field (see LIMITS in src/data/enquiry.js);
 * 2. a hidden "botcheck" field that people never see but bots fill in;
 * 3. a minimum fill time, since a bot posts the form instantly.
 * While the access key is still the placeholder nothing is sent.
 */
export function EnquiryForm() {
  const base = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const openedAt = useRef(0)
  // The moment the form appeared, for the minimum fill time. Set after mount.
  useEffect(() => {
    openedAt.current = Date.now()
  }, [])
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const id = (name: FieldName) => `${base}-${name}`
  const describedBy = (name: FieldName) => (errors[name] ? `${id(name)}-error` : undefined)

  const change =
    (name: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [name]: value }))
      if (errors[name] || errors.form) setErrors((current) => ({ ...current, [name]: undefined, form: undefined }))
      if (status !== 'idle' && status !== 'loading') setStatus('idle')
    }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return

    const data = new FormData(event.currentTarget)

    // A real visitor never sees the hidden field. If it is filled, a bot did it:
    // pretend it worked and send nothing.
    if (data.get('botcheck')) {
      setValues(EMPTY)
      setStatus('success')
      return
    }

    const found = validate(values)
    if (Object.keys(found).length === 0 && Date.now() - openedAt.current < LIMITS.minFillSeconds * 1000) {
      found.form = copy.errors.tooFast
    }
    setErrors(found)

    const firstInvalid = FIELD_ORDER.find((name) => found[name])
    if (firstInvalid) {
      setStatus('idle')
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    if (found.form) {
      setStatus('idle')
      return
    }

    if (!isEnquiryOpen) {
      setStatus('closed')
      return
    }

    setStatus('loading')
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `${site.name} enquiry from ${values.name.trim()}`,
          from_name: `${site.name} website`,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          school: values.school.trim(),
          message: values.message.trim(),
          botcheck: '',
        }),
      })
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null
      if (!response.ok || !result?.success) throw new Error('Web3Forms did not accept the enquiry')
      setStatus('success')
      setValues(EMPTY)
      openedAt.current = Date.now()
    } catch {
      setStatus('error')
    }
  }

  const message =
    errors.form ??
    (status === 'closed'
      ? copy.notConnected
      : status === 'success'
        ? copy.success
        : status === 'error'
          ? copy.failure
          : '')

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit}>
      {/* Honeypot: out of sight and out of the tab order. Only bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
        <Field id={id('name')} label={copy.fields.name} error={errors.name}>
          <input
            id={id('name')}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name.max}
            value={values.name}
            onChange={change('name')}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy('name')}
            className={control}
          />
        </Field>

        <Field id={id('email')} label={copy.fields.email} error={errors.email}>
          <input
            id={id('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email.max}
            value={values.email}
            onChange={change('email')}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy('email')}
            className={control}
          />
        </Field>

        <Field id={id('phone')} label={copy.fields.phone} error={errors.phone}>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={24}
            value={values.phone}
            onChange={change('phone')}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy('phone')}
            className={control}
          />
        </Field>

        <Field id={id('school')} label={copy.fields.school} error={errors.school}>
          <input
            id={id('school')}
            name="school"
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.school.max}
            value={values.school}
            onChange={change('school')}
            aria-invalid={errors.school ? true : undefined}
            aria-describedby={describedBy('school')}
            className={control}
          />
        </Field>

        <div className="md:col-span-2">
          <Field
            id={id('message')}
            label={copy.fields.message}
            error={errors.message}
            hint={`${values.message.length} / ${LIMITS.message.max}`}
          >
            <textarea
              id={id('message')}
              name="message"
              rows={4}
              maxLength={LIMITS.message.max}
              value={values.message}
              onChange={change('message')}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy('message')}
              className={cn(control, 'resize-y')}
            />
          </Field>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        <StatefulButton
          type="submit"
          state={status === 'loading' ? 'loading' : status === 'success' ? 'success' : 'idle'}
          disabled={status === 'loading'}
          className="h-14 px-10 text-[0.8rem] font-semibold tracking-[0.2em] uppercase"
        >
          {copy.submit}
        </StatefulButton>

        <p role="status" aria-live="polite" className="text-base font-medium text-fg">
          {message}
        </p>
      </div>
    </form>
  )
}
