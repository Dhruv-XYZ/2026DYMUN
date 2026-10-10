import { useEffect, useState } from 'react'
import { site } from '@/data/site.js'
import { useMediaQuery } from '@/hooks/use-device'
import { cn } from '@/lib/utils'

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
          ? 'pointer-events-none relative w-[23.8%] shrink-0 self-stretch'
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
          className={cn(
            'animate-fade-in object-contain motion-reduce:animate-none',
            // Beside the wordmark, line up with the letters themselves, which sit a little
            // lower than the top of the wordmark box.
            placement === 'side' ? 'absolute inset-x-0 top-[11.4%] h-[87.4%] w-full' : 'h-full w-full',
          )}
        />
      )}
    </div>
  )
}
