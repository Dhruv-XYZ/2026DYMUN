import { useEffect, useMemo, useState } from 'react'
import { Globe3D } from '@/components/ui/3d-globe'
import type { Globe3DConfig, GlobePoint } from '@/components/ui/3d-globe'
import { landmarks } from '@/data/landmarks.js'
import { sections } from '@/data/site.js'
import GlobeZoom from './GlobeZoom'
import { LandmarkCard } from './LandmarkCard'

/** Navi Mumbai, where the conference is held. */
const VENUE: GlobePoint = { lat: 19.03, lng: 73.03 }

/** Palette: gold land on an ink sea, a gold-light rim, an orange marker for the venue. */
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

const STILL_CONFIG: Globe3DConfig = { ...CONFIG, autoRotateSpeed: 0 }


/**
 * The About section's globe. Its own file so three.js loads separately, and only when
 * the section is near the screen. `active` pauses rendering while it is out of view.
 * `still` switches off the idle spin (reduced motion); dragging still works.
 */
export default function GlobeStage({ active, still }: { active: boolean; still: boolean }) {
  const [zooming, setZooming] = useState(false)
  // The venue, labelled DYPIS on the globe. Clicking it plays the zoom.
  // The United Nations landmarks are smaller gold dots; hover one for a photo and a few lines.
  const markers = useMemo(
    () => [
      { ...VENUE, label: sections.about.globe.marker, onSelect: () => setZooming(true) },
      ...landmarks.map((landmark) => ({
        lat: landmark.lat,
        lng: landmark.lng,
        name: landmark.name,
        color: '#e6c877',
        size: 0.02,
        info: <LandmarkCard landmark={landmark} />,
      })),
    ],
    [],
  )

  // Fetch the landmark photos once the globe is up, so a card has its picture the moment
  // it opens.
  useEffect(() => {
    for (const landmark of landmarks) new Image().src = landmark.image
  }, [])

  return (
    <>
      <Globe3D
        className="h-full"
        ariaLabel="Interactive globe centred on DYPIS in Navi Mumbai, India, where DYMUN is held. Drag to spin it; click DYPIS to zoom in, or hover the gold dots to see United Nations landmarks."
        active={active}
        markers={markers}
        config={still ? STILL_CONFIG : CONFIG}
      />
      {zooming && <GlobeZoom onClose={() => setZooming(false)} />}
    </>
  )
}
