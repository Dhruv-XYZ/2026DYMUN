import photos from 'virtual:gallery'

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
    `<stop offset='0' stop-color='${from}'/><stop offset='.7' stop-color='${mid}'/><stop offset='1' stop-color='${to}'/>` +
    `</linearGradient></defs><rect width='970' height='700' fill='url(#g)'/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** True once there is at least one image in public/gallery. */
export const hasGalleryPhotos = photos.length > 0

/** The gallery's images: the real photos, or generated placeholders while there are none. */
export const galleryTiles: string[] = hasGalleryPhotos
  ? photos
  : Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => placeholderTile(index))

/** Alt text for the tile at this position. Placeholders are decorative, so theirs is empty. */
export function galleryAlt(index: number): string {
  return hasGalleryPhotos ? `DYMUN photo ${(index % photos.length) + 1}` : ''
}
