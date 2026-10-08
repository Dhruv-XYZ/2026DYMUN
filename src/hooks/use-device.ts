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

const lowPower = detectLowPower()

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

  return {
    reducedMotion,
    touch,
    small,
    compact,
    lowPower,
    lite: reducedMotion || small || lowPower,
  }
}
