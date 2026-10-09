import { SparklesCore } from '@/components/ui/sparkles'

/**
 * The glowing line with sparkles that sits under the interlude headline: two gradient
 * rules (orange, then gold) and a field of gold sparkles that fades out at its edges.
 * It is its own file so the particle library loads separately from the first bundle.
 */
export default function SparkleStrip() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-24 w-full max-w-[44rem]">
      {/* Gradient rules */}
      <div className="absolute inset-x-[8%] top-0 h-[2px] w-[84%] bg-gradient-to-r from-transparent via-orange to-transparent blur-sm" />
      <div className="absolute inset-x-[8%] top-0 h-px w-[84%] bg-gradient-to-r from-transparent via-orange to-transparent" />
      <div className="absolute inset-x-[30%] top-0 h-[5px] w-[40%] bg-gradient-to-r from-transparent via-gold-light to-transparent blur-sm" />
      <div className="absolute inset-x-[30%] top-0 h-px w-[40%] bg-gradient-to-r from-transparent via-gold-light to-transparent" />

      <SparklesCore
        background="transparent"
        minSize={0.5}
        maxSize={1.4}
        particleDensity={600}
        particleColor="#e6c877"
        className="h-full w-full [mask-image:radial-gradient(closest-side,white,transparent_85%)]"
      />
    </div>
  )
}
