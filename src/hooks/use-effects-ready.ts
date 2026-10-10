import { useSyncExternalStore } from 'react'
import { watchFrameRate } from '@/hooks/use-device'

/**
 * Decorative canvas effects (the page vortex, the hero waves) are heavy: they redraw
 * every frame, and on a machine with no graphics card that can keep the page busy
 * for seconds. So they wait. They start on the visitor's first scroll, touch, key or
 * mouse move, which is almost immediately for a real visitor, or after FALLBACK_MS if
 * the page is left alone. Until then the page is fully readable and interactive.
 */
const FALLBACK_MS = 20_000
const EVENTS = ['pointerdown', 'pointermove', 'wheel', 'scroll', 'keydown', 'touchstart'] as const

let ready = false
const listeners = new Set<() => void>()
let armed = false

function start() {
  if (ready) return
  ready = true
  watchFrameRate()
  for (const event of EVENTS) window.removeEventListener(event, start)
  listeners.forEach((notify) => notify())
}

function arm() {
  if (armed || typeof window === 'undefined') return
  armed = true
  for (const event of EVENTS) window.addEventListener(event, start, { passive: true, once: true })
  window.setTimeout(start, FALLBACK_MS)
}

function subscribe(notify: () => void) {
  arm()
  listeners.add(notify)
  return () => listeners.delete(notify)
}

/** False until the visitor first interacts (or the fallback timer fires). */
export function useEffectsReady(): boolean {
  return useSyncExternalStore(subscribe, () => ready, () => false)
}
