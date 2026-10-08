import { Section, SectionHeading } from '@/components/Section'
import { sections } from '@/data/site.js'
import { usePageTitle } from '@/hooks/use-page-title'
import { galleryAlt, galleryTiles } from '@/lib/gallery'

/** /gallery: every photo, flat and still, in columns. */
export default function GalleryPage() {
  const copy = sections.gallery
  usePageTitle(copy.label)

  return (
    <Section tone="dark" labelledBy="gallery-page-title" className="pb-24 md:pb-36">
      <SectionHeading
        level={1}
        id="gallery-page-title"
        number={String(galleryTiles.length).padStart(2, '0')}
        label={copy.label}
        lead={copy.lead}
        accent={copy.accent}
      />

      <div className="columns-2 gap-3 px-5 pt-12 md:columns-3 md:gap-5 md:px-10 md:pt-20">
        {galleryTiles.map((src, index) => (
          <img
            key={`${index}-${src.slice(-24)}`}
            src={src}
            alt={galleryAlt(index)}
            loading="lazy"
            decoding="async"
            className="mb-3 block w-full ring-1 ring-gold/25 md:mb-5"
          />
        ))}
      </div>
    </Section>
  )
}
