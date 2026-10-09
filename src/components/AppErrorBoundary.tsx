import { Component } from 'react'
import type { ReactNode } from 'react'

/**
 * Catches anything that throws while a page renders (including a lazy chunk that fails
 * to download on a bad connection) and shows a plain recovery screen instead of a blank
 * page. Reloading is the right fix for both cases.
 */
export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('DYMUN site error:', error)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div
        data-tone="dark"
        role="alert"
        className="flex min-h-[100svh] flex-col items-start justify-center gap-8 bg-ink px-5 text-text md:px-10"
      >
        <p className="display-section">
          Something <span className="serif-accent text-gold-light">broke.</span>
        </p>
        <p className="max-w-[40ch] text-lg text-text-muted">
          The page did not load properly. Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-orange px-9 py-4 text-[0.8rem] font-semibold tracking-[0.2em] text-ink uppercase"
        >
          Reload the page
        </button>
      </div>
    )
  }
}
