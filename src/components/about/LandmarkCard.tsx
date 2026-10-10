import type { landmarks } from '@/data/landmarks.js'

type Landmark = (typeof landmarks)[number]

/** The card that opens when a landmark dot on the globe is hovered or focused. */
export function LandmarkCard({ landmark }: { landmark: Landmark }) {
  return (
    <div className="space-y-3">
      <img
        src={landmark.image}
        alt={landmark.alt}
        width={800}
        height={520}
        decoding="async"
        className="h-32 w-full object-cover"
      />
      <div>
        <p className="text-base leading-tight font-extrabold tracking-[-0.01em] text-text">
          {landmark.name}
        </p>
        <p className="label mt-1 text-gold-light">{landmark.place}</p>
      </div>
      <p className="text-[0.8rem] leading-relaxed text-text-muted">{landmark.text}</p>
      <p className="text-[0.7rem] text-text-muted/80">Photo: {landmark.credit}</p>
    </div>
  )
}
