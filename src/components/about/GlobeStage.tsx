import { Globe3D } from '@/components/ui/3d-globe'
import type { Globe3DConfig, GlobeArc, GlobePoint } from '@/components/ui/3d-globe'

/** Navi Mumbai, where the conference is held. */
const VENUE: GlobePoint = { lat: 19.03, lng: 73.03 }

const toRadians = (degrees: number) => (degrees * Math.PI) / 180
const toDegrees = (radians: number) => (radians * 180) / Math.PI

/** The point reached by travelling `distance` degrees of arc from `start` on a compass bearing. */
function destination(start: GlobePoint, bearing: number, distance: number): GlobePoint {
  const lat1 = toRadians(start.lat)
  const lng1 = toRadians(start.lng)
  const angle = toRadians(bearing)
  const span = toRadians(distance)

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(span) + Math.cos(lat1) * Math.sin(span) * Math.cos(angle),
  )
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(angle) * Math.sin(span) * Math.cos(lat1),
      Math.cos(span) - Math.sin(lat1) * Math.sin(lat2),
    )

  return { lat: toDegrees(lat2), lng: toDegrees(lng2) }
}

/**
 * Arcs fanning out from the venue. They are ornament only: the far ends are spaced by
 * compass bearing and are not real places, so the globe makes no claim about where
 * delegates come from.
 */
const ARCS: GlobeArc[] = [20, 78, 140, 200, 262, 322].map((bearing, index) => ({
  from: VENUE,
  to: destination(VENUE, bearing, 46 + (index % 3) * 17),
}))

/** Palette: gold land on an ink sea, a gold-light rim, orange arcs and marker. */
const CONFIG: Globe3DConfig = {
  radius: 2,
  focus: VENUE,
  landColor: '#c9a24b',
  oceanColor: '#0a0a0a',
  atmosphereColor: '#e6c877',
  atmosphereIntensity: 0.55,
  arcColor: '#ff7a1a',
  markerColor: '#ff7a1a',
  wireframeColor: '#c9a24b',
  rimLightColor: '#e6c877',
  autoRotateSpeed: 0.5,
  bumpScale: 2,
}

const MARKERS = [VENUE]

/**
 * The About section's globe. Its own file so three.js loads separately, and only when
 * the section is near the screen. `active` pauses rendering while it is out of view.
 */
export default function GlobeStage({ active }: { active: boolean }) {
  return <Globe3D className="h-full" active={active} markers={MARKERS} arcs={ARCS} config={CONFIG} />
}
