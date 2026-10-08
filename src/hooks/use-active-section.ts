import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Which of the given section ids is crossing the upper part of the screen.
 * Returns null while `enabled` is false or before any section has been seen.
 */
export function useActiveSection(ids: string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    if (!enabled) return

    const elements = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) return

    // A zero-height line 40% down the viewport: the section crossing it is active.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -60% 0px', threshold: 0 },
    )
    for (const element of elements) observer.observe(element)
    return () => observer.disconnect()
  }, [key, enabled])

  return enabled ? active : null
}

/**
 * Click handler for links such as "/#register" or "/committees". It moves through the
 * router instead of reloading the page, and leaves modified clicks (new tab) alone.
 */
export function useAnchorNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      const href = event.currentTarget.getAttribute('href')
      if (!href || !href.startsWith('/')) return
      event.preventDefault()
      navigate(href)
    },
    [navigate],
  )
}
