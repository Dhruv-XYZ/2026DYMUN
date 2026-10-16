import { Logo } from '@/components/Logo'
import { footer, nav, sections, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { withBase } from '@/lib/base'

const linkClass =
  'text-text underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-orange hover:decoration-orange'

/** Site footer: links, the school and contact details, then the banner at the very bottom. */
export function Footer() {
  const navigate = useAnchorNavigate()

  const links = [
    // A section with a page of its own links to that page; the rest scroll to the section.
    ...nav.map((item) => ({
      label: item.label,
      href: item.path,
    })),
    { label: sections.contact.label, href: '/contact' },
  ]

  const socials = [
    { label: 'Instagram', href: site.socials.instagram },
    { label: 'LinkedIn', href: site.socials.linkedin },
  ].filter((social) => social.href)

  return (
    <footer data-tone="dark" className="relative isolate bg-ink text-text">
      <div className="grid gap-12 px-5 pt-14 md:grid-cols-[1.2fr_1fr_1fr] md:px-10 md:pt-20">
        <div>
          <Logo className="text-2xl" />
          <p className="mt-5 max-w-[30ch] text-text-muted">{site.venue}</p>
        </div>

        <nav aria-label={footer.menu}>
          <p className="label text-text-muted">{footer.menu}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a href={withBase(link.href)} onClick={navigate} className={linkClass}>
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

      <p className="px-5 py-10 text-center text-xs text-text-muted md:py-14">{footer.photoCredit}</p>
    </footer>
  )
}
