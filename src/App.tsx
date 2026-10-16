import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { BASE } from '@/lib/base'
import { AppErrorBoundary } from '@/components/AppErrorBoundary'
import { DebugBadge } from '@/components/DebugBadge'
import { Navbar } from '@/components/Navbar'
import Home from '@/pages/Home'

const Footer = lazy(() => import('@/components/Footer').then((m) => ({ default: m.Footer })))

// The other pages load only when someone opens them.
const CommitteesPage = lazy(() => import('@/pages/CommitteesPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const TeamPage = lazy(() => import('@/pages/TeamPage'))
const TeamMemberPage = lazy(() => import('@/pages/TeamMemberPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const CommitteePage = lazy(() => import('@/pages/CommitteePage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

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

export default function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter basename={BASE || '/'}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-orange focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>

        {window.location.search.includes('debug') && <DebugBadge />}
        <ScrollManager />
        <Navbar />

        <main id="main">
          <Suspense fallback={<div data-tone="cream" className="min-h-[100svh] bg-cream" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/committees" element={<CommitteesPage />} />
              <Route path="/committees/:id" element={<CommitteePage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/team/:id" element={<TeamMemberPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Suspense fallback={<div aria-hidden="true" className="min-h-[60svh]" />}>
          <Footer />
        </Suspense>
      </BrowserRouter>
    </AppErrorBoundary>
  )
}
