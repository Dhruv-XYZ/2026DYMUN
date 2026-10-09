import { SparklesCore } from '@/components/ui/sparkles'

/**
 * A field of gold sparkles over the footer wordmark, fading out at its edges. Its own
 * file so the particle library loads separately, and only once the footer is on screen.
 */
export default function FooterSparkles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <SparklesCore
        background="transparent"
        minSize={0.6}
        maxSize={1.8}
        particleDensity={90}
        speed={2}
        particleColor="#e6c877"
        className="h-full w-full [mask-image:radial-gradient(ellipse_closest-side,white,transparent_92%)]"
      />
    </div>
  )
}
