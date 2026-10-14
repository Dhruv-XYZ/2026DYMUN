import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { committeePage, sections } from '@/data/site.js'
import { detailsFor } from '@/data/committeeDetails.js'
import { usePageMeta } from '@/hooks/use-page-meta'
import { allCommittees, groups } from '@/lib/committees'
import NotFound from './NotFound'

/** Committee logos, by committee id: src/assets/committee-logos/<id>.png|webp|svg|jpg. */
const logoFiles = import.meta.glob<string>('../assets/committee-logos/*.{png,webp,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const logoFor = (id: string) =>
  Object.entries(logoFiles).find(([path]) => path.split('/').pop()?.replace(/\.\w+$/, '') === id)?.[1]

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

const card = 'rounded-3xl bg-[color-mix(in_srgb,var(--color-cream)_55%,white)] p-7 shadow-[0_8px_28px_rgb(0_0_0/0.06)] md:p-9'

const buttonClass =
  'inline-flex h-13 items-center justify-center gap-2 rounded-full bg-orange px-8 py-4 text-base font-bold text-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]'

/**
 * /committees/:id. A dark banner with the committee's logo, name and full form; then the
 * agenda (with the register button) beside the description; then the two chairs as cards;
 * then the previous and next committees. No dividers.
 */
export default function CommitteePage() {
  const { id } = useParams()
  const committee = allCommittees.find((item) => item.id === id)
  const copy = committeePage

  const group = committee && groups.find((item) => item.id === committee.groupId)
  const position = committee ? allCommittees.indexOf(committee) : -1
  const previous = position > 0 ? allCommittees[position - 1] : undefined
  const next = position >= 0 && position < allCommittees.length - 1 ? allCommittees[position + 1] : undefined

  usePageMeta('committees', {
    override: committee
      ? {
          path: `/committees/${committee.id}`,
          title: `${committee.name} Committee | DYMUN '26 Model UN`,
          description: `${committee.name} at DYMUN 2026, ${group?.grades}${
            committee.hasAgenda ? `: ${committee.agenda ?? sections.committees.agendaPending}` : '.'
          }`.slice(0, 160),
        }
      : undefined,
  })

  if (!committee || !group) return <NotFound />

  const details = detailsFor(committee.id)
  const agenda = committee.agenda ?? sections.committees.agendaPending
  const logo = logoFor(committee.id)

  return (
    <article aria-labelledby="committee-title" data-tone="cream" className="bg-surface pb-24 text-fg md:pb-36">
      {/* Banner: the committee's logo large on the right, under a dark fade so the name reads. */}
      <header data-tone="dark" className="relative isolate overflow-hidden bg-ink pt-16 text-text lg:pt-[4.5rem]">
        {logo && (
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 right-[4%] -z-10 h-[78%] w-auto max-w-[55%] -translate-y-1/2 object-contain opacity-90"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(90deg, var(--color-ink) 30%, rgb(10 10 10 / 0.55) 65%, rgb(10 10 10 / 0.2) 100%)' }}
        />

        <div className="px-5 pt-8 pb-12 md:px-10 md:pb-14">
          <Link
            to="/committees"
            className="group inline-flex items-center gap-2 text-base font-semibold text-text transition-colors duration-200 hover:text-orange"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {copy.back}
          </Link>

          <p className="mt-16 block w-fit rounded-full bg-amber-deep px-4 py-2 text-sm font-bold text-gold-light md:mt-24">
            {group.grades}
          </p>
          <h1
            id="committee-title"
            className="mt-4 text-[clamp(3.5rem,11vw,9.5rem)] leading-none font-black tracking-[-0.05em] break-words"
          >
            {committee.name}
          </h1>
          {committee.fullName && (
            <p className="mt-3 text-xl font-semibold text-gold-light md:text-3xl">{committee.fullName}</p>
          )}
        </div>
      </header>

      <div className="grid gap-x-14 gap-y-12 px-5 pt-14 md:px-10 md:pt-20 lg:grid-cols-2">
        {committee.hasAgenda && (
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">{copy.agenda}</h2>
            <p className="mt-5 max-w-[46ch] text-xl leading-snug font-bold text-fg md:text-2xl">{agenda}</p>
            <Link to="/register" className={`mt-8 ${buttonClass}`}>
              {copy.register}
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        )}
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">{copy.about}</h2>
          <p className={`mt-5 max-w-[48ch] text-lg leading-relaxed md:text-xl ${details.about ? 'text-fg' : 'text-fg-muted'}`}>
            {details.about || copy.aboutPending}
          </p>
          {!committee.hasAgenda && (
            <Link to="/register" className={`mt-8 ${buttonClass}`}>
              {copy.register}
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      <section aria-labelledby="chairs-title" className="px-5 pt-16 md:px-10 md:pt-24">
        <h2 id="chairs-title" className="text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
          {copy.chairs}
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {details.chairs.map((chair, index) => {
            const named = Boolean(chair.name)
            return (
              <div key={index}>
                <div className={card} aria-label={named ? chair.name : `${copy.chairRole} ${index + 1}`} role="group">
                  <div className="flex items-start gap-5">
                    {chair.photo ? (
                      <img
                        src={chair.photo}
                        alt={chair.name}
                        width={160}
                        height={160}
                        loading="lazy"
                        className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-gold md:h-24 md:w-24"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-amber-deep text-2xl font-black text-gold-light ring-2 ring-gold md:h-24 md:w-24 md:text-3xl"
                      >
                        {named ? initialsOf(chair.name) : `C${index + 1}`}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold md:text-2xl">{named ? chair.name : copy.chairNamePending}</h3>
                      <p className="mt-0.5 font-bold text-tone">{chair.role || copy.chairRole}</p>
                      <p className={`mt-2 ${chair.bio ? 'text-fg' : 'text-fg-muted'}`}>{chair.bio || copy.chairBioPending}</p>
                    </div>
                  </div>
                  <p className="sr-only">{copy.messageTitle}</p>
                  <blockquote className={`mt-6 text-lg leading-relaxed italic md:text-xl ${chair.message ? 'text-fg' : 'text-fg-muted'}`}>
                    “{chair.message || copy.messagePending}”
                  </blockquote>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <nav aria-label="Other committees" className="grid gap-5 px-5 pt-12 md:grid-cols-2 md:px-10 md:pt-16">
        {previous ? (
          <Link to={`/committees/${previous.id}`} className={`${card} group block py-6 md:py-6`}>
            <span className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {copy.previous}
            </span>
            <span className="mt-1 block text-3xl font-black tracking-[-0.03em] transition-colors duration-200 group-hover:text-orange">
              {previous.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/committees/${next.id}`} className={`${card} group block py-6 md:py-6`}>
            <span className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
              {copy.next}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="mt-1 block text-3xl font-black tracking-[-0.03em] transition-colors duration-200 group-hover:text-orange">
              {next.name}
            </span>
          </Link>
        )}
      </nav>
    </article>
  )
}
