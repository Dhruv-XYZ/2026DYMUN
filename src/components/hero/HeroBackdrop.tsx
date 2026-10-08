import { DottedGlowBackground } from '@/components/ui/dotted-glow-background'

/**
 * The hero's field of gold dots with an orange glow. It is its own file so the canvas
 * code loads separately from the first bundle. `animated={false}` draws a single still
 * frame, for phones, low-power devices and reduced motion.
 */
export default function HeroBackdrop({ animated }: { animated: boolean }) {
  return (
    <DottedGlowBackground
      className="pointer-events-none [mask-image:radial-gradient(ellipse_78%_72%_at_50%_36%,black_12%,transparent_78%)]"
      gap={18}
      radius={1.3}
      opacity={0.85}
      speedMin={0.25}
      speedMax={1.1}
      animated={animated}
    />
  )
}
