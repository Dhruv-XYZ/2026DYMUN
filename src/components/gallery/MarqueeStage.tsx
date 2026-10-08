import { ThreeDMarquee } from '@/components/ui/3d-marquee'
import { galleryAlt, galleryTiles, hasGalleryPhotos } from '@/lib/gallery'

/** The wall needs about two dozen tiles to look full, so a short list is repeated. */
const MIN_TILES = 24
const images = Array.from(
  { length: Math.max(MIN_TILES, galleryTiles.length) },
  (_, index) => galleryTiles[index % galleryTiles.length],
)

/** The gallery's tilted photo wall. Its own file so it loads apart from the first bundle. */
export default function MarqueeStage({ paused, speed }: { paused: boolean; speed: number }) {
  return (
    <ThreeDMarquee
      images={images}
      paused={paused}
      speed={speed}
      className="h-full max-sm:h-full"
      getAlt={hasGalleryPhotos ? galleryAlt : undefined}
    />
  )
}
