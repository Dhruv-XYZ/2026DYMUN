import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { sections } from '@/data/site.js'

const copy = sections.about.globe.zoom

/**
 * The zoom video that plays full screen when the DYPIS marker is clicked. It starts muted
 * (browsers block sound on autoplay); the controls unmute it. Escape or the button closes it.
 */
export default function GlobeZoom({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  // Escape closes; the page behind stays still while the player is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.label}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
    >
      <video
        src={copy.video}
        autoPlay
        playsInline
        muted
        controls
        className="h-full w-full object-contain"
        aria-label={copy.label}
      />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-cream ring-2 ring-orange transition-colors hover:bg-ink-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <X aria-hidden="true" className="h-4 w-4" />
        {copy.close}
      </button>
    </div>,
    document.body,
  )
}
