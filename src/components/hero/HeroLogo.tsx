import { useEffect, useState } from 'react'
import { site } from '@/data/site.js'

/**
 * The DYMUN emblem, huge on the right of the home screen. On a phone it sits under the
 * wordmark at the width of the screen; from 1024px up it fills the right side behind the
 * headline. It appears just after the page has loaded, so the large image never competes
 * with the first paint.
 */
export function HeroLogo() {
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

  return (
    <div
      aria-hidden={show ? undefined : true}
      className="pointer-events-none relative mx-auto mt-8 aspect-[1000/786] w-[60vw] max-w-sm lg:absolute lg:top-[22vh] lg:right-[3vw] lg:mt-0 lg:w-[min(38vw,60vh)] lg:max-w-none"
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
