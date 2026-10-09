import { Vortex } from '@/components/ui/vortex'

/**
 * One very faint field of orange and gold streaks over the whole page, fixed to the
 * screen so it stays put while the sections scroll past. It sits above the section
 * backgrounds but under the dock, the logo and the preloader, takes no clicks, and is
 * drawn at a low resolution with half the streaks and at 7% strength, so it reads as
 * a faint texture. `still` draws a single frame instead of animating.
 */
export default function PageVortex({ still, small }: { still: boolean; small: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.07]"
    >
      <Vortex
        paused={still}
        particleCount={small ? 130 : 210}
        resolution={small ? 0.4 : 0.5}
        rangeY={small ? 200 : 320}
        baseRadius={1}
        rangeRadius={2}
        containerClassName="absolute inset-0"
      />
    </div>
  )
}
