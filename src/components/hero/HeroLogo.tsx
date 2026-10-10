import { useEffect, useState } from 'react'
import { site } from '@/data/site.js'
import { useMediaQuery } from '@/hooks/use-device'

/**
 * The DYMUN emblem, large on the right of the home screen. Below 1024px it sits under the
 * wordmark ("below"). From 1024px up it sits on the right ("side"), in the space the wordmark leaves free
 * (see Hero: the wordmark is narrower there), so it never touches the outlined wordmark. It appears
 * just after the page has loaded, so the large image never competes with the first paint.
 */
export function HeroLogo({ placement }: { placement: 'below' | 'side' }) {
  const wide = useMediaQuery('(min-width: 1024px)')
  const [show, setShow] = useState(false)

  useEffect(() => {
    let timer = 0
    const start = () => {
      timer = window.setTimeout(() => setShow(true), 400)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('load', start)
    }
  }, [])

  if ((placement === 'side') !== wide) return null

  return (
    <div
      aria-hidden={show ? undefined : true}
      className={
        placement === 'side'
          ? 'pointer-events-none absolute top-28 right-[3vw] aspect-[1000/786] w-[min(30vw,52vh)]'
          : 'pointer-events-none relative mx-auto mt-8 aspect-[1000/786] w-[60vw] max-w-sm'
      }
    >
      {show && (
        <img
          src={site.munLogoSrc}
          alt={`${site.name} logo: a globe wreathed in grass`}
          width={1000}
          height={786}
          decoding="async"
          className="h-full w-full animate-fade-in object-contain motion-reduce:animate-none"
        />
      )}
    </div>
  )
}
