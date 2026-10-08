import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Dock } from '@/components/Dock'
import { Footer } from '@/components/Footer'
import { Logo } from '@/components/Logo'
import { Preloader } from '@/components/Preloader'
import { site } from '@/data/site.js'
import Home from '@/pages/Home'

// The other pages load only when someone opens them.
const CommitteesPage = lazy(() => import('@/pages/CommitteesPage'))
const TeamPage = lazy(() => import('@/pages/TeamPage'))
const GalleryPage = lazy(() => import('@/pages/GalleryPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Set once the preloader has played, so it is skipped for the rest of the session. */
const SESSION_KEY = 'dymun26:preloaded'

function hasPreloaded(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return true // storage blocked: skip the preloader rather than replay it every time
  }
}

function markPreloaded() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // storage blocked: nothing to remember
  }
}

/** Scrolls to the section named in the address (/#register), or to the top of a new page. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, behavior: hash ? 'smooth' : 'instant' })
  }, [pathname, hash, key])

  return null
}

/** The grain used by the `shiny` headline word. Referenced from index.css. */
function ShinyNoise() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <filter id="shiny-noise" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"
          result="specks"
        />
        <feComposite in="specks" in2="SourceGraphic" operator="in" result="clipped" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="clipped" />
        </feMerge>
      </filter>
    </svg>
  )
}

/** The wordmark, top left on every page. It inverts against whatever is behind it. */
function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex px-5 pt-6 mix-blend-difference md:px-8">
      <Link to="/" aria-label={`${site.name}, home`} className="pointer-events-auto text-text">
        <Logo />
      </Link>
    </header>
  )
}

export default function App() {
  const [loading, setLoading] = useState(() => !hasPreloaded())

  const finishLoading = useCallback(() => {
    markPreloaded()
    setLoading(false)
  }, [])

  return (
    <BrowserRouter>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-orange focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <ShinyNoise />
      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={finishLoading} />}
      </AnimatePresence>

      <ScrollManager />
      <Header />
      <Dock />

      <main id="main">
        <Suspense fallback={<div data-tone="dark" className="min-h-[100svh] bg-ink" />}>
          <Routes>
            <Route path="/" element={<Home ready={!loading} />} />
            <Route path="/committees" element={<CommitteesPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </BrowserRouter>
  )
}
