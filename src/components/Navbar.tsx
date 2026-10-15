import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { SchoolChip } from '@/components/SchoolChip'
import { nav, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { groups } from '@/lib/committees'
import { cn } from '@/lib/utils'

/** The Committees link with a drop-down of every committee, grouped by grade. */
function CommitteesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // It opens only on a click of the button, and closes on Escape or a click elsewhere.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="committees-menu"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.04em] uppercase transition-colors duration-200',
          active ? 'bg-ink text-orange' : 'text-fg-muted hover:text-fg',
        )}
      >
        Committees
        <ChevronDown
          aria-hidden="true"
          className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        // Centred on the page (not the button, which sits far right), touching the bar's bottom edge.
        <div id="committees-menu" className="fixed top-[calc(4.5rem+1px)] left-1/2 z-10 -translate-x-1/2">
          <div className="grid w-[min(52rem,calc(100vw-2rem))] grid-cols-3 gap-8 border border-gold/40 bg-ink p-7 text-text">
            {groups.map((group) => (
              <div key={group.id}>
                <p className="label text-gold-light">{group.grades}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.committees.map((committee) => (
                    <li key={committee.id}>
                      <Link
                        to={`/committees/${committee.id}`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-semibold text-text transition-colors duration-200 hover:text-orange"
                      >
                        {committee.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              to="/committees"
              onClick={() => setOpen(false)}
              className="col-span-3 border-t border-gold/30 pt-5 text-sm font-semibold text-gold-light transition-colors duration-200 hover:text-orange"
            >
              All committees and agendas
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * The site's navigation: a rectangular bar fixed to the top of every page. Only the
 * link buttons inside it (the current section and Register) are pill-shaped. On the left
 * the DYMUN emblem, a divider, then the school's logo (which opens its own dropdown).
 * On the right the section links, with the current one marked; below 1024px they sit
 * behind a menu button instead.
 */
export function Navbar() {
  const { pathname } = useLocation()
  const navigate = useAnchorNavigate()
  const [open, setOpen] = useState(false)

  // The active item is the one that owns the page being shown.
  const activeId =
    nav.find((item) =>
      item.path === '/' ? pathname === '/' : pathname === item.path || pathname.startsWith(`${item.path}/`),
    )?.id ?? null

  const items = nav.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.path,
    active: item.id === activeId,
  }))
  const lastId = items[items.length - 1]?.id

  // The menu closes on Escape and whenever the page changes.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header data-tone="cream" className="fixed inset-x-0 top-0 z-50 border-b border-line bg-cream text-fg">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:h-[4.5rem] lg:px-8">
        {/* Brand: DYMUN emblem | school logo */}
        <div className="flex min-w-0 items-center gap-3 lg:gap-5">
          <Link to="/" aria-label={`${site.name}, home`} className="shrink-0">
            <img
              src={site.munLogoSrc}
              alt=""
              width={1000}
              height={786}
              decoding="async"
              className="h-10 w-auto lg:h-12"
            />
          </Link>
          <span aria-hidden="true" className="h-8 w-px shrink-0 bg-gold-dark/60 lg:h-10" />
          <SchoolChip />
        </div>

        {/* Links (desktop) */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {items.map((item) =>
            item.id === 'committees' ? (
              <CommitteesMenu key={item.id} active={item.active} />
            ) : (
              <a
                key={item.id}
                href={item.href}
                onClick={navigate}
                aria-current={item.active ? 'true' : undefined}
                className={cn(
                  'relative rounded-full px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.04em] uppercase transition-colors duration-200',
                  item.id === lastId
                    ? 'ml-3 bg-orange text-ink hover:bg-gold-light'
                    : item.active
                      ? 'bg-ink text-orange'
                      : 'text-fg-muted hover:text-fg',
                )}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        {/* Menu button (smaller screens) */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold-dark/60 text-fg transition-colors duration-200 hover:border-orange hover:text-orange lg:hidden"
        >
          {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="border-t border-line bg-cream px-4 pb-6 lg:hidden"
        >
          <ul>
            {items.map((item) => (
              <li key={item.id} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={(event) => {
                    setOpen(false)
                    navigate(event)
                  }}
                  aria-current={item.active ? 'true' : undefined}
                  className={cn(
                    'flex h-14 items-center text-lg font-extrabold tracking-[-0.01em] uppercase',
                    item.active ? 'text-gold-dark' : 'text-fg',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
