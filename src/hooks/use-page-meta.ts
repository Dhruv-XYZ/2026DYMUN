import { useEffect } from 'react'
import { seo } from '@/data/site.js'

type PageKey = keyof typeof seo

/** Sets (or creates) one tag in the document head and returns how to undo it. */
function setTag(selector: string, create: () => HTMLElement, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLElement>(selector)
  const created = !element
  if (!element) {
    element = create()
    document.head.appendChild(element)
  }
  const previous = element.getAttribute(attribute)
  element.setAttribute(attribute, value)
  return () => {
    if (created) element?.remove()
    else if (previous !== null) element?.setAttribute(attribute, previous)
  }
}

const meta = (attr: 'name' | 'property', key: string) => () => {
  const element = document.createElement('meta')
  element.setAttribute(attr, key)
  return element
}

/**
 * Gives the page its own title, description, canonical address and share tags while it is
 * open (the words come from `seo` in src/data/site.js), and puts the previous values back
 * when the visitor leaves it. `noindex` is for pages that should stay out of search
 * results, such as the not-found page.
 *
 * The canonical address is built from the address the visitor is actually on, so it is
 * always the site's real domain and never a placeholder.
 */
export function usePageMeta(page: PageKey, options: { noindex?: boolean } = {}) {
  const { noindex = false } = options

  useEffect(() => {
    const content = seo[page]
    const url = `${window.location.origin}${page === 'notFound' ? window.location.pathname : content.path}`
    const previousTitle = document.title
    document.title = content.title

    const undo = [
      setTag('meta[name="description"]', meta('name', 'description'), 'content', content.description),
      setTag('meta[property="og:title"]', meta('property', 'og:title'), 'content', content.title),
      setTag('meta[property="og:description"]', meta('property', 'og:description'), 'content', content.description),
      setTag('meta[property="og:url"]', meta('property', 'og:url'), 'content', url),
      setTag(
        'link[rel="canonical"]',
        () => {
          const link = document.createElement('link')
          link.setAttribute('rel', 'canonical')
          return link
        },
        'href',
        url,
      ),
    ]
    if (noindex) {
      undo.push(setTag('meta[name="robots"]', meta('name', 'robots'), 'content', 'noindex, follow'))
    }

    return () => {
      document.title = previousTitle
      for (const restore of undo) restore()
    }
  }, [page, noindex])
}
