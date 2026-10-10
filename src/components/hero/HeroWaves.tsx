import { WavyBackground } from '@/components/ui/wavy-background'

/**
 * Slow orange, gold and teal waves behind the hero. Its own file so the canvas code loads
 * apart from the first bundle. The waves fade out towards the top and bottom edges so
 * the hero keeps its clean edges, and `still` draws one frame instead of animating.
 */
export default function HeroWaves({ still, small }: { still: boolean; small: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-70 max-md:opacity-40 [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_28%,black_72%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_28%,black_72%,transparent)]"
    >
      <WavyBackground
        paused={still}
        backgroundFill="#0a0a0a"
        waveOpacity={0.4}
        blur={small ? 12 : 18}
        waveWidth={small ? 40 : 64}
        speed="slow"
        containerClassName="absolute inset-0"
      />
    </div>
  )
}
