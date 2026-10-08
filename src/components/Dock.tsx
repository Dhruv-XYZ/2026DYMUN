import type { ReactNode } from 'react'
import { CalendarDays, Globe, House, Images, Landmark, Ticket, Users } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { FloatingDock } from '@/components/ui/floating-dock'
import { nav } from '@/data/site.js'
import { useActiveSection, useAnchorNavigate } from '@/hooks/use-active-section'
import { useDeviceProfile } from '@/hooks/use-device'

const iconProps = { className: 'h-full w-full', strokeWidth: 1.75, 'aria-hidden': true } as const

/** One icon per `id` in the nav list of src/data/site.js. */
const icons: Record<string, ReactNode> = {
  home: <House {...iconProps} />,
  about: <Globe {...iconProps} />,
  committees: <Landmark {...iconProps} />,
  schedule: <CalendarDays {...iconProps} />,
  gallery: <Images {...iconProps} />,
  team: <Users {...iconProps} />,
  register: <Ticket {...iconProps} />,
}

const sectionIds = nav.map((item) => item.id)

/**
 * Main navigation: the floating dock, fed from the nav list in src/data/site.js.
 * Top centre on desktop, a compact row at the bottom on phones.
 */
export function Dock() {
  const { pathname } = useLocation()
  const { reducedMotion } = useDeviceProfile()
  const navigate = useAnchorNavigate()

  const onHome = pathname === '/'
  const section = useActiveSection(sectionIds, onHome)
  // On the home page the active item follows the scroll; on any other page it is
  // the nav item that owns that page, if there is one.
  const activeId = onHome
    ? (section ?? 'home')
    : (nav.find((item) => item.path === pathname)?.id ?? null)

  const items = nav.map((item) => ({
    title: item.label,
    icon: icons[item.id],
    href: item.id === 'home' ? '/' : `/#${item.id}`,
    active: item.id === activeId,
  }))

  return (
    <FloatingDock
      items={items}
      label="Main"
      magnify={!reducedMotion}
      onNavigate={(_href, event) => navigate(event)}
      desktopClassName="fixed top-4 left-1/2 z-50 -translate-x-1/2"
      mobileClassName="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2"
    />
  )
}
