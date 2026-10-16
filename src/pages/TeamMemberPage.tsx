import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { teamMemberPage } from '@/data/site.js'
import { usePageMeta } from '@/hooks/use-page-meta'
import { isPending, memberPath, members, placeholderFor } from '@/lib/team'
import NotFound from './NotFound'
import { withBase } from '@/lib/base'

const card = 'rounded-3xl bg-[color-mix(in_srgb,var(--color-cream)_55%,white)] p-7 shadow-[0_8px_28px_rgb(0_0_0/0.06)] md:p-9'

/**
 * /team/:id. A dark banner with the person's photo, name and role; then their bio; then
 * the previous and next members of the team. Anything not filled in yet in
 * src/data/team.js shows the pending wording from site.js.
 */
export default function TeamMemberPage() {
  const { id } = useParams()
  const member = members.find((item) => item.id === id)
  const copy = teamMemberPage

  const position = member ? members.indexOf(member) : -1
  const previous = position > 0 ? members[position - 1] : undefined
  const next = position >= 0 && position < members.length - 1 ? members[position + 1] : undefined

  const name = member && !isPending(member.name) ? member.name : copy.namePending
  const role = member && !isPending(member.role) ? member.role : copy.rolePending

  usePageMeta('team', {
    override: member
      ? {
          path: memberPath(member),
          title: `${name}, ${role} | DYMUN '26 Model UN`,
          description: (member.bio && !isPending(member.bio) ? member.bio : `${name}, ${role} at DYMUN 2026.`).slice(0, 160),
        }
      : undefined,
  })

  if (!member) return <NotFound />

  const bio = isPending(member.bio) ? '' : member.bio

  return (
    <article aria-labelledby="member-title" data-tone="cream" className="bg-surface pb-24 text-fg md:pb-36">
      <header data-tone="dark" className="bg-ink pt-16 text-text lg:pt-[4.5rem]">
        <div className="px-5 pt-8 pb-12 md:px-10 md:pb-14">
          <Link
            to="/team"
            className="group inline-flex items-center gap-2 text-base font-semibold text-text transition-colors duration-200 hover:text-orange"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {copy.back}
          </Link>

          <div className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:gap-12">
            <div className="relative aspect-[4/5] w-full max-w-xs shrink-0 overflow-hidden bg-ink-raised md:w-72 lg:w-80">
              {member.photo ? (
                <img src={withBase(member.photo)} alt={name} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(140deg,var(--color-amber-black),var(--color-amber-deep)_55%,var(--color-gold-dark))] [container-type:size]"
                >
                  <span
                    className="text-[38cqw] leading-none font-black tracking-[-0.04em] text-amber-black"
                    style={{ WebkitTextStroke: '2px var(--color-gold-light)', paintOrder: 'stroke fill', mixBlendMode: 'lighten' }}
                  >
                    {placeholderFor(member)}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="block w-fit rounded-full bg-amber-deep px-4 py-2 text-sm font-bold text-gold-light">{role}</p>
              <h1
                id="member-title"
                className="mt-4 text-[clamp(2.75rem,8vw,7rem)] leading-none font-black tracking-[-0.05em] break-words uppercase"
              >
                {name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="member-about" className="px-5 pt-14 md:px-10 md:pt-20">
        <h2 id="member-about" className="text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
          {copy.about}
        </h2>
        <p className={`mt-5 max-w-[60ch] text-lg leading-relaxed md:text-xl ${bio ? 'text-fg' : 'text-fg-muted'}`}>
          {bio || copy.bioPending}
        </p>
      </section>

      <nav aria-label="Other members of the team" className="grid gap-5 px-5 pt-12 md:grid-cols-2 md:px-10 md:pt-16">
        {previous ? (
          <Link to={memberPath(previous)} className={`${card} group block py-6 md:py-6`}>
            <span className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {copy.previous}
            </span>
            <span className="mt-1 block text-3xl font-black tracking-[-0.03em] uppercase transition-colors duration-200 group-hover:text-orange">
              {isPending(previous.name) ? copy.namePending : previous.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={memberPath(next)} className={`${card} group block py-6 md:py-6`}>
            <span className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
              {copy.next}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="mt-1 block text-3xl font-black tracking-[-0.03em] uppercase transition-colors duration-200 group-hover:text-orange">
              {isPending(next.name) ? copy.namePending : next.name}
            </span>
          </Link>
        )}
      </nav>
    </article>
  )
}
