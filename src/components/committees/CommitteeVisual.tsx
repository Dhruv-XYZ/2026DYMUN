import type { Committee } from '@/lib/committees'
import { cn } from '@/lib/utils'

/** The warm stop of the glow. Rotates through the palette so neighbours differ. */
const WARM = [
  'var(--color-gold-light)',
  'var(--color-gold)',
  'color-mix(in srgb, var(--color-gold) 55%, var(--color-orange))',
]

/** A long two-word name goes on two lines; everything else stays on one. */
function linesFor(name: string): string[] {
  const words = name.split(' ')
  return name.length > 8 && words.length > 1 ? words : [name]
}

/**
 * The picture for one committee. There are no committee icons, so it is drawn in CSS:
 * the name in giant outline type over a slowly turning gold to orange glow, with grain.
 *
 * The glow's angle, centre and warm colour all come from the committee's position in
 * the list, so every committee looks a little different while staying in the palette.
 * The turn is a transform on a layer that is blurred once, so it does not repaint.
 */
export function CommitteeVisual({
  committee,
  total,
  animated,
  className,
}: {
  committee: Committee
  total: number
  animated: boolean
  className?: string
}) {
  const i = committee.index
  const angle = (i * 137.5) % 360
  const x = 28 + ((i * 53) % 45)
  const y = 30 + ((i * 31) % 40)
  const warm = WARM[i % WARM.length]

  const lines = linesFor(committee.name)
  const longest = Math.max(...lines.map((line) => line.length))
  // Sized against the tile itself: as tall as the lines allow, never wider than the tile.
  const fontSize = `min(${Math.round(62 / lines.length)}cqh, ${(120 / longest).toFixed(1)}cqw)`

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative isolate h-full w-full overflow-hidden bg-amber-black [container-type:size]',
        className,
      )}
    >
      <div
        className={cn(
          'absolute -inset-[40%] will-change-transform',
          animated && (i % 2 === 0 ? 'animate-glow-spin' : 'animate-glow-spin-reverse'),
        )}
        style={{
          background: `conic-gradient(from ${angle}deg at ${x}% ${y}%, var(--color-amber-black) 0deg, var(--color-amber-deep) 95deg, ${warm} 150deg, var(--color-orange) 174deg, var(--color-amber-deep) 218deg, var(--color-amber-black) 290deg)`,
          filter: 'blur(56px)',
        }}
      />
      {/* Darkens the edges so the gold and orange stay a glow, not a fill. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(95% 80% at 50% 62%, transparent 20%, var(--color-ink) 100%)',
        }}
      />
      <div className="grain-layer" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {lines.map((line) => (
          <span
            key={line}
            className="block leading-[0.9] font-black tracking-[-0.04em] text-amber-black uppercase"
            style={{
              fontSize,
              WebkitTextStroke: '3px var(--color-gold-light)',
              paintOrder: 'stroke fill',
            }}
          >
            {line}
          </span>
        ))}
      </div>

      <span className="label absolute top-5 left-5 text-text">
        {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  )
}
