import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { SchoolChip } from '@/components/SchoolChip'
import { nav, site } from '@/data/site.js'
import { useActiveSection, useAnchorNavigate } from '@/hooks/use-active-section'
import { cn } from '@/lib/utils'

const sectionIds = nav.map((item) => item.id)

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

  const onHome = pathname === '/'
  const section = useActiveSection(sectionIds, onHome)
  // On the home page the active item follows the scroll; on any other page it is the
  // nav item that owns that page, if there is one.
  const activeId = onHome
    ? (section ?? 'home')
    : (nav.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))?.id ?? null)

  const items = nav.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.id === 'home' ? '/' : `/#${item.id}`,
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/40 bg-ink text-text">
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
          <span aria-hidden="true" className="h-8 w-px shrink-0 bg-gold/70 lg:h-10" />
          <SchoolChip />
        </div>

        {/* Links (desktop) */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={navigate}
              aria-current={item.active ? 'true' : undefined}
              className={cn(
                'relative rounded-full px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-200',
                item.id === lastId
                  ? 'ml-3 bg-orange text-ink hover:bg-gold-light'
                  : item.active
                    ? 'bg-ink-raised text-orange ring-1 ring-orange/60'
                    : 'text-text-muted hover:text-text',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Menu button (smaller screens) */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/50 text-text transition-colors duration-200 hover:border-orange hover:text-orange lg:hidden"
        >
          {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="border-t border-gold/40 bg-ink px-4 pb-6 lg:hidden"
        >
          <ul>
            {items.map((item) => (
              <li key={item.id} className="border-b border-gold/20">
                <a
                  href={item.href}
                  onClick={(event) => {
                    setOpen(false)
                    navigate(event)
                  }}
                  aria-current={item.active ? 'true' : undefined}
                  className={cn(
                    'flex h-14 items-center text-lg font-extrabold tracking-[-0.01em] uppercase',
                    item.active ? 'text-orange' : 'text-text',
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
