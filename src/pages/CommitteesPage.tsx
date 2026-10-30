import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { committeePage, pages, sections } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { usePageMeta } from '@/hooks/use-page-meta'
import { groups, logoFor } from '@/lib/committees'
import { withBase } from '@/lib/base'

/** Tile colours, taken in turn: ink, deep amber, dark gold. `sub` is the full-form colour on each. */
const TILES = [
  { bg: 'bg-ink', sub: 'text-gold-light' },
  { bg: 'bg-amber-deep', sub: 'text-gold-light' },
  { bg: 'bg-gold-dark', sub: 'text-text' },
]

/**
 * /committees: every committee as a colour tile (logo, name and full form), grouped under plain
 * grade headings. A tile opens the committee's own page, which has the agenda.
 */
export default function CommitteesPage() {
  const copy = sections.committees
  const navigate = useAnchorNavigate()
  usePageMeta('committees')

  return (
    <Section tone="cream" labelledBy="committees-page-title" className="border-t-0 pt-28 pb-24 md:pt-36 md:pb-36">
      <h1
        id="committees-page-title"
        className="px-5 text-[clamp(2.75rem,8vw,7rem)] leading-none font-extrabold tracking-[-0.04em] text-fg md:px-10"
      >
        {copy.label}
      </h1>

      {groups.map((group, groupIndex) => (
        <div key={group.id} className="px-5 pt-14 md:px-10 md:pt-20">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-fg md:text-5xl">{group.grades}</h2>
          </Reveal>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-5">
            {group.committees.map((committee, i) => {
              const tile = TILES[(i + groupIndex) % TILES.length]
              const logo = logoFor(committee.id)
              return (
                <li key={committee.id}>
                  <Link
                    to={`/committees/${committee.id}`}
                    aria-label={`${committeePage.view}: ${committee.name}`}
                    className={`group relative flex h-60 flex-col justify-end rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-1 md:h-64 md:p-7 lg:h-72 ${tile.bg}`}
                  >
                    <span className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-orange text-ink md:top-6 md:right-6">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                    {logo && (
                      <img
                        src={logo}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="absolute top-5 left-5 h-20 w-auto max-w-[55%] object-contain md:top-6 md:left-6 md:h-24"
                      />
                    )}
                    <span className="text-[clamp(2.25rem,4vw,3.5rem)] leading-none font-black tracking-[-0.04em] text-text">
                      {committee.name}
                    </span>
                    {committee.fullName && (
                      <span className={`mt-2 text-base font-semibold ${tile.sub}`}>{committee.fullName}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div className="px-5 pt-16 md:px-10 md:pt-24">
        <a
          href={withBase('/register')}
          onClick={navigate}
          className="group inline-flex items-center gap-3 text-lg font-semibold text-fg underline decoration-tone decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange"
        >
          {pages.committees.registerLink}
          <ArrowUpRight
            aria-hidden="true"
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </Section>
  )
}
