import { type RefObject, useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button as AriaButton } from 'react-aria-components'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Dropdown } from '@/components/base/dropdown/dropdown'
import { SchoolChip } from '@/components/SchoolChip'
import { nav, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { groups } from '@/lib/committees'
import { cn } from '@/lib/utils'
import { withBase } from '@/lib/base'

const committeeItem =
  'block cursor-pointer py-[5px] text-sm font-semibold outline-hidden transition-colors duration-200 data-focus-visible:underline data-focused:text-orange'

/**
 * The Committees link with a drop-down of every committee, grouped by grade, built on the
 * Untitled UI dropdown (react-aria: arrow keys, Escape and click-away come with it). The
 * box is anchored to the whole bar, so it sits centred on the page and touches its bottom edge.
 */
function CommitteesMenu({ active, anchorRef }: { active: boolean; anchorRef: RefObject<HTMLElement | null> }) {
  const navigate = useNavigate()

  return (
    <Dropdown.Root>
      <AriaButton
        className={({ isFocusVisible }) =>
          cn(
            'group inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.04em] uppercase outline-hidden transition-colors duration-200',
            active ? 'bg-ink text-orange' : 'text-fg-muted hover:text-fg',
            isFocusVisible && 'outline-2 outline-offset-2 outline-orange',
          )
        }
      >
        Committees
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-200 group-aria-expanded:rotate-180"
        />
      </AriaButton>

      <Dropdown.Popover
        triggerRef={anchorRef}
        placement="bottom"
        offset={0}
        className="z-[60] w-[min(52rem,calc(100vw-2rem))] rounded-none border border-gold/40 bg-ink text-text shadow-none ring-0"
      >
        <Dropdown.Menu
          aria-label="Committees"
          onAction={(key) => navigate(key === 'all' ? '/committees' : `/committees/${key}`)}
          className="grid grid-cols-3 gap-x-8 p-7"
        >
          {groups.map((group) => (
            <Dropdown.Section key={group.id}>
              <Dropdown.SectionHeader className="label mb-3 text-gold-light">{group.grades}</Dropdown.SectionHeader>
              {group.committees.map((committee) => (
                <Dropdown.Item
                  key={committee.id}
                  id={committee.id}
                  textValue={committee.name}
                  unstyled
                  className={cn(committeeItem, 'text-text')}
                >
                  {committee.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Section>
          ))}
          <Dropdown.Section aria-label="All committees" className="col-span-3 mt-5 border-t border-gold/30 pt-4">
            <Dropdown.Item id="all" textValue="All committees and agendas" unstyled className={cn(committeeItem, 'text-gold-light')}>
              All committees and agendas
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
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
  const headerRef = useRef<HTMLElement>(null)

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
    <header ref={headerRef} data-tone="cream" className="fixed inset-x-0 top-0 z-50 border-b border-line bg-cream text-fg">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:h-[4.5rem] lg:px-8">
        {/* Brand: DYMUN emblem | school logo */}
        <div className="flex min-w-0 items-center gap-3 lg:gap-5">
          <Link to="/" aria-label={`${site.name}, home`} className="shrink-0">
            <img
              src={withBase(site.munLogoSrc)}
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
              <CommitteesMenu key={item.id} active={item.active} anchorRef={headerRef} />
            ) : (
              <a
                key={item.id}
                href={withBase(item.href)}
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
                  href={withBase(item.href)}
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
