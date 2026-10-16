import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Search engine files, all generated from src/data/site.js so nothing is typed twice.
 *
 * - Always: fills the title and description placeholders in index.html from `seo.home`.
 * - When the site's address is known: adds the canonical link, og:url, the share image,
 *   the JSON-LD structured data and a Google Search Console verification tag, and writes
 *   sitemap.xml and robots.txt (with its Sitemap line) into the build.
 *
 * The address is read from SITE_URL, or from VERCEL_PROJECT_PRODUCTION_URL, which Vercel
 * sets during a production build. Without either, no sitemap is written, because a sitemap
 * with the wrong address would do harm, and robots.txt simply allows everything.
 * GOOGLE_SITE_VERIFICATION holds the token Search Console gives you.
 */
/**
 * In the production build, start the app script after the page's first paint instead of
 * during it. The HTML already holds a painted shell (see index.html), so the visitor sees
 * the page at once; the script is still downloaded in parallel (its modulepreload tag
 * stays), it just runs one frame later.
 */
function startAfterFirstPaint(): Plugin {
  return {
    name: 'dymun-start-after-first-paint',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      // The page's own stylesheet no longer blocks the first paint (the shell is styled
      // inline); the app script waits for both that stylesheet and the first paint.
      let out = html.replace(
        /<link rel="stylesheet"([^>]*?) href="([^"]+\.css)"([^>]*)>/,
        (_m, before, href, after) =>
          `<link rel="stylesheet" id="app-css"${before} href="${href}"${after} media="print" onload="this.media='all'">` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`,
      )
      out = out.replace(
        /<script type="module"([^>]*) src="([^"]+)"([^>]*)><\/script>/,
        (_m, _before, src) =>
          `<link rel="modulepreload" crossorigin href="${src}"><script>(function(){` +
          `var started=false;` +
          `var go=function(){if(started)return;started=true;var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src='${src}';document.head.appendChild(s)};` +
          `var css=document.getElementById('app-css');` +
          `var ready=function(){if(started)return;if(css&&!css.sheet){css.addEventListener('load',function(){css.media='all';go()});window.setTimeout(function(){css.media='all';go()},3000)}else{go()}};` +
          // Normally one frame after the first paint. A tab in the background never gets a
          // frame, so a timer starts the app anyway.
          `requestAnimationFrame(function(){setTimeout(ready,0)});window.setTimeout(ready,500)})()</script>`,
      )
      return out
    },
  }
}

async function seoFiles(): Promise<Plugin> {
  const { seo, nav, site } = (await import(pathToFileURL(fromRoot('./src/data/site.js')).href)) as {
    seo: Record<string, { path: string; title: string; description: string }>
    nav: { id: string; path?: string }[]
    site: { name: string; school: string; city: string }
  }

  const raw =
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  // Always https, never a trailing slash.
  const origin = raw
    ? raw.replace(/^http:\/\//, 'https://').replace(/^(?!https:\/\/)/, 'https://').replace(/\/+$/, '')
    : ''
  const verification = process.env.GOOGLE_SITE_VERIFICATION ?? ''

  // Pages that belong in the sitemap: the home page, every nav page, and /contact.
  const paths = ['/', ...nav.flatMap((item) => (item.path ? [item.path] : [])), seo.contact.path]
  // Every committee has its own page.
  const { committeeGroups } = (await import(pathToFileURL(fromRoot('./src/data/committees.js')).href)) as {
    committeeGroups: { committees: { id: string }[] }[]
  }
  const committeePaths = committeeGroups.flatMap((group) => group.committees.map((c) => `/committees/${c.id}`))
  const pages = [...new Set([...paths, ...committeePaths])]

  const structuredData = origin
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${origin}/#website`,
            url: `${origin}/`,
            name: site.name,
            description: seo.home.description,
            inLanguage: 'en',
          },
          {
            '@type': 'Organization',
            '@id': `${origin}/#organization`,
            name: site.name,
            url: `${origin}/`,
            image: `${origin}/og.png`,
            parentOrganization: {
              '@type': 'EducationalOrganization',
              name: site.school,
              address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'IN' },
            },
          },
        ],
      })
    : ''

  const robots = `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ''}`

  return {
    name: 'seo-files',
    // In `npm run dev` there is no build, so answer /robots.txt directly. Without this the
    // dev server would hand back the app's HTML page for it.
    configureServer(server) {
      server.middlewares.use('/robots.txt', (_request, response) => {
        response.setHeader('Content-Type', 'text/plain; charset=utf-8')
        response.end(robots)
      })
    },
    transformIndexHtml(html) {
      const filled = html
        .replaceAll('%SEO_TITLE%', escapeHtml(seo.home.title))
        .replaceAll('%SEO_DESCRIPTION%', escapeHtml(seo.home.description))

      const tags: { tag: string; attrs?: Record<string, string>; children?: string; injectTo: 'head' }[] = []
      if (verification) {
        tags.push({ tag: 'meta', attrs: { name: 'google-site-verification', content: verification }, injectTo: 'head' })
      }
      if (origin) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${origin}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: `${origin}/og.png` }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: `${origin}/og.png` }, injectTo: 'head' },
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: structuredData, injectTo: 'head' },
        )
      }
      return { html: filled, tags }
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      if (origin) {
        const urls = pages
          .map((path) => `  <url>\n    <loc>${origin}${path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
          .join('\n')
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        })
      } else {
        this.warn(
          'SEO: no SITE_URL or VERCEL_PROJECT_PRODUCTION_URL, so no sitemap.xml, canonical, og:image or structured data were written.',
        )
      }
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robots,
      })
    },
  }
}

/**
 * Exposes the images in public/gallery as `virtual:gallery`, so adding photos to the
 * site only means dropping files into that folder. An empty folder gives an empty list.
 */
function galleryManifest(): Plugin {
  const id = 'virtual:gallery'
  const resolvedId = '\0' + id
  const dir = fromRoot('./public/gallery')

  const list = () =>
    existsSync(dir)
      ? readdirSync(dir)
          .filter((file) => /\.(avif|webp|jpe?g|png)$/i.test(file))
          .sort()
          .map((file) => `/gallery/${file}`)
      : []

  return {
    name: 'gallery-manifest',
    resolveId: (source) => (source === id ? resolvedId : undefined),
    load: (source) => (source === resolvedId ? `export default ${JSON.stringify(list())}` : undefined),
    configureServer(server) {
      server.watcher.add(dir)
      const refresh = (file: string) => {
        if (!file.startsWith(dir)) return
        const module = server.moduleGraph.getModuleById(resolvedId)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh)
      server.watcher.on('unlink', refresh)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(async () => ({
  // '/' at the root of a domain (Vercel). The GitHub Pages workflow sets BASE_PATH=/2026DYMUN/.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), galleryManifest(), await seoFiles(), startAfterFirstPaint()],
  resolve: {
    alias: { '@': fromRoot('./src') },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // The globe's chunk is three.js, about 950 kB before compression. It is loaded
    // lazily, on capable desktops only, as the About section nears the screen, so it
    // never delays the first paint. The limit is raised so that one known chunk does
    // not hide a real size regression elsewhere.
    chunkSizeWarningLimit: 1000,
  },
  // These libraries are only imported lazily (globe, hover sparkles). Listing them here
  // makes the dev server prepare them at start-up, instead of discovering them later
  // and reloading the page in the middle of a visit.
  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@tsparticles/react',
      '@tsparticles/slim',
      '@tsparticles/engine',
    ],
  },
}))
