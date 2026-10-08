import { Logo } from '@/components/Logo'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { footer, nav, sections, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { useDeviceProfile } from '@/hooks/use-device'

const linkClass =
  'text-text underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-orange hover:decoration-orange'

/** Site footer: links, the school, contact placeholders, and the giant cropped wordmark. */
export function Footer() {
  const { touch, reducedMotion } = useDeviceProfile()
  const navigate = useAnchorNavigate()

  const links = [
    ...nav.map((item) => ({
      label: item.label,
      href: item.id === 'home' ? '/' : `/#${item.id}`,
    })),
    { label: sections.contact.label, href: '/contact' },
  ]

  const socials = [
    { label: 'Instagram', href: site.socials.instagram },
    { label: 'LinkedIn', href: site.socials.linkedin },
  ].filter((social) => social.href)

  return (
    <footer data-tone="dark" className="grain relative isolate bg-ink text-text max-md:pb-20">
      <div className="grid gap-12 px-5 pt-20 md:grid-cols-[1.2fr_1fr_1fr] md:px-10 md:pt-28">
        <div>
          <Logo className="text-2xl" />
          <p className="mt-5 max-w-[30ch] text-text-muted">{site.venue}</p>
        </div>

        <nav aria-label={footer.menu}>
          <p className="label text-text-muted">{footer.menu}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={navigate} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label text-text-muted">{sections.contact.label}</p>
          <ul className="mt-5 space-y-3">
            <li>
              {site.contact.email ? (
                <a href={`mailto:${site.contact.email}`} className={linkClass}>
                  {site.contact.email}
                </a>
              ) : (
                <span className="text-text-muted">{footer.emailPending}</span>
              )}
            </li>
            <li>
              {site.contact.phone ? (
                <a href={`tel:${site.contact.phone.replace(/\s+/g, '')}`} className={linkClass}>
                  {site.contact.phone}
                </a>
              ) : (
                <span className="text-text-muted">{footer.phonePending}</span>
              )}
            </li>
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The wordmark is taller than its strip, so its lower part is cut off. */}
      <div aria-hidden="true" className="mt-16 overflow-hidden md:mt-24">
        <div className="-mb-[5.5vw] px-3 md:px-6">
          <TextHoverEffect
            text={site.name.toUpperCase()}
            interactive={!touch && !reducedMotion}
            duration={0.12}
          />
        </div>
      </div>
    </footer>
  )
}
