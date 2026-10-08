import photos from 'virtual:gallery'
import { ThreeDMarquee } from '@/components/ui/3d-marquee'

/**
 * TODO: replace with real DYMUN photos.
 * Drop image files (jpg, png, webp or avif) into public/gallery/. They are picked up
 * automatically, and the placeholder tiles below stop being used.
 */
const PLACEHOLDER_COUNT = 28

const PLACEHOLDER_STOPS = [
  ['#140a02', '#4a2205', '#8a6d2b'],
  ['#0a0a0a', '#140a02', '#4a2205'],
  ['#140a02', '#4a2205', '#c9a24b'],
  ['#0a0a0a', '#4a2205', '#8a6d2b'],
]

/** A dark gradient tile with a little gold in one corner, as an inline SVG image. */
function placeholderTile(index: number): string {
  const [from, mid, to] = PLACEHOLDER_STOPS[index % PLACEHOLDER_STOPS.length]
  const angle = (index * 47) % 360
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='970' height='700' viewBox='0 0 970 700'>` +
    `<defs><linearGradient id='g' gradientTransform='rotate(${angle} .5 .5)'>` +
    `<stop offset='0' stop-color='${from}'/><stop offset='.62' stop-color='${mid}'/><stop offset='1' stop-color='${to}'/>` +
    `</linearGradient></defs><rect width='970' height='700' fill='url(#g)'/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const hasPhotos = photos.length > 0

/** The wall needs about two dozen tiles to look full, so a short list is repeated. */
const MIN_TILES = 24
const images = hasPhotos
  ? Array.from({ length: Math.max(MIN_TILES, photos.length) }, (_, index) => photos[index % photos.length])
  : Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => placeholderTile(index))

/** The gallery's tilted photo wall. Its own file so it loads apart from the first bundle. */
export default function MarqueeStage({ paused, speed }: { paused: boolean; speed: number }) {
  return (
    <ThreeDMarquee
      images={images}
      paused={paused}
      speed={speed}
      className="h-full max-sm:h-full"
      getAlt={hasPhotos ? (index) => `DYMUN photo ${(index % photos.length) + 1}` : undefined}
    />
  )
}
