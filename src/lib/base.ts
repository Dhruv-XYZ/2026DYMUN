/**
 * Where the site lives: '' at the root of a domain, or for example '/2026DYMUN' on
 * GitHub Pages. It comes from BASE_PATH at build time (see vite.config.ts).
 */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Puts the base in front of a site path such as '/gallery/a.jpg'. Other addresses pass through. */
export const withBase = (path: string) => (path.startsWith('/') && !path.startsWith('//') ? `${BASE}${path}` : path)
