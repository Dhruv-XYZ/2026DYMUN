import { useEffect } from 'react'
import { site } from '@/data/site.js'

/**
 * Sets the browser tab title while a page is open, as "Committees | DYMUN '26",
 * and puts the previous title back when the visitor leaves it.
 */
export function usePageTitle(page: string) {
  useEffect(() => {
    const previous = document.title
    document.title = `${page} | ${site.name}`
    return () => {
      document.title = previous
    }
  }, [page])
}
