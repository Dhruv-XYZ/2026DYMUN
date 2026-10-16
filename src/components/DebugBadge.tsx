import { useEffect, useState } from 'react'
import { deviceReasons, frameStats, useDeviceProfile } from '@/hooks/use-device'

/**
 * A small readout at the bottom left, shown only when the address ends in ?debug. It
 * says how fast the page is running and whether (and why) it is in its light version,
 * so a slow machine can be diagnosed from one screenshot.
 */
export function DebugBadge() {
  const { lowPower, lite } = useDeviceProfile()
  const [live, setLive] = useState(0)

  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let raf = 0
    const tick = (now: number) => {
      frames++
      if (now - last >= 1000) {
        setLive(Math.round((frames * 1000) / (now - last)))
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const reasons = deviceReasons()
  return (
    <pre
      aria-hidden="true"
      className="pointer-events-none fixed bottom-2 left-2 z-[300] bg-ink/90 p-2 text-[11px] leading-snug text-text"
    >
      {`fps now: ${live}\nlight version: ${lowPower ? 'YES' : 'no'} (lite: ${lite ? 'yes' : 'no'})\nweak hardware: ${reasons.weakHardware}\nsoftware GPU: ${reasons.softwareRendering}\nmeasured slow: ${reasons.measuredSlow}\nwindows slow/total: ${frameStats.slowWindows}/${frameStats.windows} (last ${frameStats.fps} fps)\ncores: ${navigator.hardwareConcurrency}`}
    </pre>
  )
}
