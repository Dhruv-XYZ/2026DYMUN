import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

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
export default defineConfig({
  plugins: [react(), tailwindcss(), galleryManifest()],
  resolve: {
    alias: { '@': fromRoot('./src') },
    dedupe: ['react', 'react-dom'],
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
})
