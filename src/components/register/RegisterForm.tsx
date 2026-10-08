import { useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { StatefulButton } from '@/components/ui/stateful-button'
import {
  experienceLevels,
  isRegistrationOpen,
  REGISTER_ENDPOINT,
  registrationForm as copy,
} from '@/data/registration.js'
import { sections } from '@/data/site.js'
import { gradeList, groupForGrade, groups } from '@/lib/committees'
import { cn } from '@/lib/utils'

type FieldName = 'name' | 'grade' | 'school' | 'email' | 'committee' | 'experience'
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>
type Status = 'idle' | 'loading' | 'success' | 'error' | 'closed'

const EMPTY: Values = { name: '', grade: '', school: '', email: '', committee: '', experience: '' }
const FIELD_ORDER: FieldName[] = ['name', 'grade', 'school', 'email', 'committee', 'experience']

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = copy.errors.name
  if (!values.grade) errors.grade = copy.errors.grade
  if (!values.school.trim()) errors.school = copy.errors.school
  if (!values.email.trim()) errors.email = copy.errors.email
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = copy.errors.emailFormat
  }
  if (!values.committee) errors.committee = copy.errors.committee
  if (!values.experience) errors.experience = copy.errors.experience
  return errors
}

/** Underline-only controls: the fields sit on the page, not in boxes. */
const control =
  'mt-2 block w-full appearance-none rounded-none border-0 border-b border-line bg-transparent px-0 py-3 text-xl font-medium text-fg placeholder:text-fg-muted/70 aria-invalid:border-b-2 aria-invalid:border-orange'

/** A label, its control, and the error line underneath. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="label block text-fg-muted">
        {label}
      </label>
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

function SelectField({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-4 h-5 w-5 text-fg-muted"
      />
    </div>
  )
}

/**
 * Registration form. It posts to REGISTER_ENDPOINT in src/data/registration.js.
 * While that is still the placeholder, a valid form is not sent anywhere: the visitor
 * is told registration is not open yet, rather than shown a false success.
 */
export function RegisterForm() {
  const base = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const id = (name: FieldName) => `${base}-${name}`
  const describedBy = (name: FieldName) => (errors[name] ? `${id(name)}-error` : undefined)

  const change =
    (name: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value
      setValues((current) => {
        const next = { ...current, [name]: value }
        // A committee from another age group no longer applies once the grade changes.
        if (name === 'grade' && current.committee) {
          const group = value ? groupForGrade(Number(value)) : undefined
          if (group && !group.committees.some((committee) => committee.name === current.committee)) {
            next.committee = ''
          }
        }
        return next
      })
      if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
      if (status !== 'idle' && status !== 'loading') setStatus('idle')
    }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return

    const found = validate(values)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((name) => found[name])
    if (firstInvalid) {
      setStatus('idle')
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    if (!isRegistrationOpen) {
      setStatus('closed')
      return
    }

    setStatus('loading')
    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error(`The form endpoint answered ${response.status}`)
      setStatus('success')
      setValues(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  const gradeGroup = values.grade ? groupForGrade(Number(values.grade)) : undefined
  const committeeGroups = gradeGroup ? [gradeGroup] : groups

  const messages = sections.register
  const message =
    status === 'closed'
      ? messages.notConnected
      : status === 'success'
        ? messages.success
        : status === 'error'
          ? messages.failure
          : ''

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit}>
      <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
        <Field id={id('name')} label={copy.fields.name} error={errors.name}>
          <input
            id={id('name')}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={change('name')}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy('name')}
            className={control}
          />
        </Field>

        <Field id={id('grade')} label={copy.fields.grade} error={errors.grade}>
          <SelectField>
            <select
              id={id('grade')}
              name="grade"
              value={values.grade}
              onChange={change('grade')}
              aria-invalid={errors.grade ? true : undefined}
              aria-describedby={describedBy('grade')}
              className={control}
            >
              <option value="">{copy.choose}</option>
              {gradeList.map((grade) => (
                <option key={grade} value={grade}>
                  {copy.fields.grade} {grade}
                </option>
              ))}
            </select>
          </SelectField>
        </Field>

        <Field id={id('school')} label={copy.fields.school} error={errors.school}>
          <input
            id={id('school')}
            name="school"
            type="text"
            autoComplete="organization"
            value={values.school}
            onChange={change('school')}
            aria-invalid={errors.school ? true : undefined}
            aria-describedby={describedBy('school')}
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
            value={values.email}
            onChange={change('email')}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy('email')}
            className={control}
          />
        </Field>

        <Field id={id('committee')} label={copy.fields.committee} error={errors.committee}>
          <SelectField>
            <select
              id={id('committee')}
              name="committee"
              value={values.committee}
              onChange={change('committee')}
              aria-invalid={errors.committee ? true : undefined}
              aria-describedby={describedBy('committee')}
              className={control}
            >
              <option value="">{copy.choose}</option>
              {committeeGroups.map((group) => (
                <optgroup key={group.id} label={`${group.name}, ${group.grades}`}>
                  {group.committees.map((committee) => (
                    <option key={committee.id} value={committee.name}>
                      {committee.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </SelectField>
        </Field>

        <Field id={id('experience')} label={copy.fields.experience} error={errors.experience}>
          <SelectField>
            <select
              id={id('experience')}
              name="experience"
              value={values.experience}
              onChange={change('experience')}
              aria-invalid={errors.experience ? true : undefined}
              aria-describedby={describedBy('experience')}
              className={control}
            >
              <option value="">{copy.choose}</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </SelectField>
        </Field>
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
