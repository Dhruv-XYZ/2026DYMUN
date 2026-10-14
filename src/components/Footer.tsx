import { useRef } from 'react'
import { useInView } from 'motion/react'
import { Logo } from '@/components/Logo'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { footer, nav, sections, site } from '@/data/site.js'
import { useAnchorNavigate } from '@/hooks/use-active-section'
import { useDeviceProfile } from '@/hooks/use-device'

const linkClass =
  'text-text underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-orange hover:decoration-orange'

/** Site footer: links, the school, contact placeholders, the giant wordmark and a credit line. */
export function Footer() {
  const { touch, reducedMotion } = useDeviceProfile()
  const navigate = useAnchorNavigate()

  // The wordmark draws itself on once it is on screen.
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const seen = useInView(wordmarkRef, { once: true, margin: '0px 0px -12% 0px' })

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

      {/* The wordmark, shown in full. The outline draws itself on when it scrolls into view. */}
      <div ref={wordmarkRef} aria-hidden="true" className="relative mt-16 px-3 md:mt-24 md:px-6">
        <TextHoverEffect
          text={site.name.toUpperCase()}
          interactive={!touch && !reducedMotion}
          active={seen}
          duration={0.12}
        />
      </div>

      <p className="px-5 pt-6 pb-4 text-center text-lg font-semibold md:text-xl">
        {footer.credit}
      </p>
      <p className="px-5 pb-10 text-center text-xs text-text-muted md:pb-14">{footer.photoCredit}</p>
    </footer>
  )
}
