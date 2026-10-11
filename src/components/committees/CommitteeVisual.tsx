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
 * the name in giant solid cream type over a slowly turning gold to orange glow, with grain.
 *
 * The glow's angle, centre and warm colour all come from the committee's position in
 * the list, so every committee looks a little different while staying in the palette.
 * The turn is a transform on a layer that is blurred once, so it does not repaint.
 */
export function CommitteeVisual({
  committee,
  animated,
  className,
}: {
  committee: Committee
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
      {/* An even ink wash keeps the gold and orange a glow, not a fill... */}
      <div
        className="absolute inset-0"
        style={{ background: 'color-mix(in srgb, var(--color-ink) 42%, transparent)' }}
      />
      {/* ...and a darker band across the middle sits behind the name, so the name
          stays readable wherever the glow has turned to. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 46% at 50% 50%, color-mix(in srgb, var(--color-ink) 78%, transparent) 0%, transparent 100%)',
        }}
      />
      <div className="grain-layer" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {lines.map((line) => (
          <span
            key={line}
            className="block leading-[0.9] font-black tracking-[-0.04em] text-text uppercase"
            // Solid cream letters: an outline alone disappeared against the bright
            // parts of the glow. The soft shadow separates them from what is behind.
            style={{
              fontSize,
              textShadow: '0 2px 28px var(--color-ink), 0 0 6px var(--color-ink)',
            }}
          >
            {line}
          </span>
        ))}
      </div>

      {committee.fullName ? (
        <p
          className="absolute inset-x-0 bottom-0 px-[6cqw] pb-[7cqh] text-center font-bold tracking-[0.02em] text-text uppercase"
          style={{ fontSize: 'clamp(0.7rem, 3.4cqw, 1.15rem)', textShadow: '0 1px 14px var(--color-ink)' }}
        >
          {committee.fullName}
        </p>
      ) : null}
    </div>
  )
}
