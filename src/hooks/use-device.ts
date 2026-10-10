import { useCallback, useSyncExternalStore } from 'react'

/** True while the media query matches. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

interface NavigatorHints {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

/**
 * Very little power: two cores or fewer, 2 GB of memory or less, or the visitor asked
 * the browser to save data. The bar is low on purpose. Four cores is an ordinary
 * laptop or phone, and treating it as weak left capable devices with a still picture
 * where a spinning globe belongs.
 */
function detectLowPower(): boolean {
  if (typeof navigator === 'undefined') return false
  const hints = navigator as Navigator & NavigatorHints
  const cores = navigator.hardwareConcurrency
  return (
    (typeof cores === 'number' && cores <= 2) ||
    (typeof hints.deviceMemory === 'number' && hints.deviceMemory <= 2) ||
    hints.connection?.saveData === true
  )
}

const lowPowerHardware = detectLowPower()

/**
 * No graphics card doing the work: the browser is drawing in software (SwiftShader,
 * llvmpipe, a remote desktop, or hardware acceleration switched off). The animated
 * canvases and the 3D globe crawl there, so the site uses its light version.
 */
function detectSoftwareRenderer(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return true
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return /swiftshader|llvmpipe|software|basic render|softpipe/i.test(renderer)
  } catch {
    return false
  }
}
const softwareRendering = detectSoftwareRenderer()

// ---- The page measures itself ----------------------------------------------------
// If the first seconds of animation run slowly on this machine, the light version is
// switched on for good (for this visit and the next ones in the same tab). Adding
// ?lite to the address forces it, which is also how to see what it looks like.
const SLOW_KEY = 'dymun26:slow'
function readSlow(): boolean {
  try {
    return window.location.search.includes('lite') || window.sessionStorage.getItem(SLOW_KEY) === '1'
  } catch {
    return false
  }
}
// ?full keeps every effect on, whatever the page measures.
const forceFull = typeof window !== 'undefined' && window.location.search.includes('full')
let slow = typeof window !== 'undefined' && !forceFull && readSlow()
const slowListeners = new Set<() => void>()

function markSlow() {
  if (slow) return
  slow = true
  try {
    window.sessionStorage.setItem(SLOW_KEY, '1')
  } catch {
    // Private mode: it only lasts for this page then.
  }
  slowListeners.forEach((notify) => notify())
}

/**
 * Called once the animated effects have started. Times three two-second windows of
 * animation frames; two slow ones (under about 30 frames a second) mean this machine
 * cannot keep up, and the light version takes over.
 */
let watching = false
/** The latest measurement, for the ?debug readout. */
export const frameStats = { fps: 0, windows: 0, slowWindows: 0 }

export function watchFrameRate() {
  if (watching || slow || forceFull || typeof window === 'undefined') return
  watching = true

  // Three-second windows, judged by the MEDIAN frame time so a few long frames while the
  // page is still loading cannot count against it. Two slow windows out of four flip
  // the switch; the first window starts a few seconds after the effects do.
  const runWindow = () => {
    const gaps: number[] = []
    let last = 0
    let start = 0
    const tick = (now: number) => {
      if (document.hidden) {
        gaps.length = 0
        last = 0
        start = 0
        requestAnimationFrame(tick)
        return
      }
      if (!start) start = now
      if (last) gaps.push(now - last)
      last = now
      if (now - start < 3000) {
        requestAnimationFrame(tick)
        return
      }
      gaps.sort((a, b) => a - b)
      const median = gaps[Math.floor(gaps.length / 2)] ?? 16
      frameStats.fps = Math.round(1000 / Math.max(1, median))
      frameStats.windows++
      if (median > 40) frameStats.slowWindows++
      if (frameStats.slowWindows >= 2) markSlow()
      else if (frameStats.windows < 4) window.setTimeout(runWindow, 500)
    }
    requestAnimationFrame(tick)
  }
  window.setTimeout(runWindow, 4000)
}

function subscribeSlow(notify: () => void) {
  slowListeners.add(notify)
  return () => slowListeners.delete(notify)
}

export interface DeviceProfile {
  /** The visitor asked for less motion. */
  reducedMotion: boolean
  /** No hover, or a coarse pointer: cursor effects make no sense. */
  touch: boolean
  /** Phone width. */
  small: boolean
  /** Below the two-column layouts (under 1024px). */
  compact: boolean
  lowPower: boolean
  /** Use the simplified fallbacks: static globe, no canvas text, still backgrounds. */
  lite: boolean
}

export function useDeviceProfile(): DeviceProfile {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const touch = useMediaQuery('(hover: none), (pointer: coarse)')
  const small = useMediaQuery('(max-width: 767px)')
  const compact = useMediaQuery('(max-width: 1023px)')
  const tooSlow = useSyncExternalStore(subscribeSlow, () => slow, () => false)
  const lowPower = !forceFull && (lowPowerHardware || softwareRendering || tooSlow)

  return {
    reducedMotion,
    touch,
    small,
    compact,
    lowPower,
    lite: reducedMotion || small || lowPower,
  }
}

/** Why the page is (or is not) in its light version. Shown by ?debug. */
export const deviceReasons = () => ({
  weakHardware: lowPowerHardware,
  softwareRendering,
  measuredSlow: slow,
  forcedFull: forceFull,
})
