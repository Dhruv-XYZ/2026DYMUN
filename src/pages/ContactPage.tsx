import { Section, SectionHeading } from '@/components/Section'
import { pages, sections, site } from '@/data/site.js'
import { usePageTitle } from '@/hooks/use-page-title'

const valueClass = 'display-sm break-words text-right'

/**
 * /contact: email, phone and venue as three open rows. A value that has not been
 * set in src/data/site.js shows as an outline "TBA".
 */
export default function ContactPage() {
  const copy = sections.contact
  const words = pages.contact
  usePageTitle(copy.label)

  const rows = [
    {
      label: words.email,
      value: site.contact.email,
      href: site.contact.email ? `mailto:${site.contact.email}` : '',
    },
    {
      label: words.phone,
      value: site.contact.phone,
      href: site.contact.phone ? `tel:${site.contact.phone.replace(/\s+/g, '')}` : '',
    },
    { label: words.venue, value: site.venue, href: '' },
  ]

  const anyPending = rows.some((row) => !row.value)

  return (
    <Section tone="cream" noise labelledBy="contact-page-title" className="min-h-[100svh] pb-24 md:pb-36">
      <SectionHeading
        level={1}
        id="contact-page-title"
        number="07"
        label={copy.label}
        lead={copy.lead}
        accent={copy.accent}
      />

      <dl className="border-b border-line">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`flex flex-col gap-3 px-5 py-8 md:flex-row md:items-baseline md:justify-between md:gap-10 md:px-10 md:py-10 ${index > 0 ? 'border-t border-line' : ''}`}
          >
            <dt className="label shrink-0 text-fg-muted">{row.label}</dt>
            <dd className="min-w-0 max-md:[&>*]:text-left">
              {!row.value ? (
                <span className={`${valueClass} text-outline block`}>{words.pendingValue}</span>
              ) : row.href ? (
                <a
                  href={row.href}
                  className={`${valueClass} block underline decoration-tone decoration-1 underline-offset-8 transition-colors duration-200 hover:text-orange hover:decoration-orange`}
                >
                  {row.value}
                </a>
              ) : (
                <span className={`${valueClass} block`}>{row.value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {anyPending && <p className="px-5 pt-10 text-fg-muted md:px-10">{copy.pending}</p>}
    </Section>
  )
}
