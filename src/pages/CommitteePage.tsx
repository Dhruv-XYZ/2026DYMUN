import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { committeePage, sections } from '@/data/site.js'
import { detailsFor } from '@/data/committeeDetails.js'
import { usePageMeta } from '@/hooks/use-page-meta'
import { allCommittees, groups } from '@/lib/committees'
import NotFound from './NotFound'

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

const buttonClass =
  'inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-orange px-9 text-[0.8rem] font-semibold tracking-[0.04em] text-ink uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]'

/** /committees/:id. One committee: its agenda, a description, and its two chairs. */
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

  return (
    <Section tone="cream" labelledBy="committee-title" className="pb-24 md:pb-36">
      <header className="px-5 pt-28 md:px-10 md:pt-40">
        <Link
          to="/committees"
          className="group inline-flex items-center gap-2 text-base font-semibold text-fg-muted transition-colors duration-200 hover:text-orange"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          {copy.back}
        </Link>

        <h1 id="committee-title" className="display-section mt-8 break-words">
          {committee.name}
        </h1>
        {committee.fullName ? (
          <p className="mt-4 text-base font-semibold tracking-[0.03em] text-tone uppercase md:text-xl">
            {committee.fullName}
          </p>
        ) : null}
        <p className="mt-5 text-xl font-extrabold tracking-[-0.02em] text-tone uppercase md:text-3xl">
          {group.name}, {group.grades}
        </p>
      </header>

      <div className="hairline mx-5 mt-14 w-auto md:mx-10 md:mt-20" />

      <div
        className={`grid gap-x-16 gap-y-14 px-5 pt-14 md:px-10 md:pt-20 ${
          committee.hasAgenda ? 'lg:grid-cols-2' : ''
        }`}
      >
        {committee.hasAgenda && (
          <Reveal>
            <h2 className="text-4xl font-black tracking-[-0.03em] uppercase md:text-6xl">{copy.agenda}</h2>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed font-bold text-fg md:text-xl">{agenda}</p>
          </Reveal>
        )}
        <Reveal delay={0.08}>
          <h2 className="text-4xl font-black tracking-[-0.03em] uppercase md:text-6xl">{copy.about}</h2>
          <p
            className={`mt-6 max-w-[48ch] text-lg leading-relaxed md:text-xl ${
              details.about ? 'text-fg' : 'text-fg-muted'
            }`}
          >
            {details.about || copy.aboutPending}
          </p>
        </Reveal>
      </div>

      <div className="hairline mx-5 mt-16 w-auto md:mx-10 md:mt-24" />

      <div className="px-5 pt-14 md:px-10 md:pt-20">
        <Reveal>
          <h2 className="text-4xl font-black tracking-[-0.03em] uppercase md:text-6xl">{copy.chairs}</h2>
        </Reveal>

        <div className="mt-12 grid gap-x-16 gap-y-20 lg:grid-cols-2">
          {details.chairs.map((chair, index) => {
            const named = Boolean(chair.name)
            return (
              <Reveal key={index} delay={index * 0.08}>
                <article aria-label={named ? chair.name : `${copy.chairRole} ${index + 1}`}>
                  <div className="flex items-center gap-6">
                    {chair.photo ? (
                      <img
                        src={chair.photo}
                        alt={chair.name}
                        width={160}
                        height={160}
                        loading="lazy"
                        className="h-28 w-28 rounded-full object-cover ring-2 ring-orange md:h-36 md:w-36"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-amber-deep text-4xl font-black tracking-[-0.04em] text-gold-light ring-2 ring-gold/60 md:h-36 md:w-36 md:text-5xl"
                      >
                        {named ? initialsOf(chair.name) : String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-3xl leading-[1.05] font-black tracking-[-0.03em] break-words uppercase md:text-4xl">
                        {named ? chair.name : copy.chairNamePending}
                      </h3>
                      <p className="mt-2 text-lg font-semibold text-tone">
                        {chair.role || copy.chairRole}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`mt-8 max-w-[52ch] text-base leading-relaxed md:text-lg ${
                      chair.bio ? 'text-fg' : 'text-fg-muted'
                    }`}
                  >
                    {chair.bio || copy.chairBioPending}
                  </p>

                  <h4 className="mt-10 text-xl font-extrabold tracking-[-0.02em] md:text-2xl">
                    {copy.messageTitle}
                  </h4>
                  <blockquote className="mt-4 max-w-[52ch] border-l-2 border-orange pl-5">
                    <p
                      className={`serif-accent text-2xl leading-snug md:text-3xl ${
                        chair.message ? 'text-fg' : 'text-fg-muted'
                      }`}
                    >
                      {chair.message || copy.messagePending}
                    </p>
                  </blockquote>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>

      <div className="hairline mx-5 mt-20 w-auto md:mx-10 md:mt-28" />

      <nav
        aria-label="Committees"
        className="flex flex-col gap-10 px-5 pt-12 md:px-10 md:pt-16 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          {previous && (
            <Link to={`/committees/${previous.id}`} className="group block">
              <span className="flex items-center gap-2 text-base font-semibold text-fg-muted">
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                />
                {copy.previous}
              </span>
              <span className="mt-1 block text-3xl font-black tracking-[-0.03em] uppercase transition-colors duration-200 group-hover:text-orange md:text-4xl">
                {previous.name}
              </span>
            </Link>
          )}
          {next && (
            <Link to={`/committees/${next.id}`} className="group block">
              <span className="flex items-center gap-2 text-base font-semibold text-fg-muted">
                {copy.next}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
              <span className="mt-1 block text-3xl font-black tracking-[-0.03em] uppercase transition-colors duration-200 group-hover:text-orange md:text-4xl">
                {next.name}
              </span>
            </Link>
          )}
        </div>

        <Link to="/register" className={buttonClass}>
          {copy.register}
          <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
        </Link>
      </nav>
    </Section>
  )
}
