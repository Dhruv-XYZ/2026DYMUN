// Fails when a colour from outside the DYMUN palette is left in src/.
// Run with: npm run audit:palette
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const src = join(root, 'src')

// The palette from the brief, plus the muted text colour used on cream.
const PALETTE = [
  '#0a0a0a', // ink
  '#141414', // ink-raised, ink-text
  '#f4ede0', // cream
  '#c9a24b', // gold
  '#e6c877', // gold-light
  '#8a6d2b', // gold-dark
  '#ff7a1a', // orange
  '#4a2205', // amber-deep
  '#140a02', // amber-black
  '#ede6d6', // text
  '#9a9486', // text-muted
  '#5e574a', // ink-muted (added: muted text on cream)
]

// Pure black and white are allowed for SVG masks and shadows only.
const NEUTRAL = ['#000', '#000000', '#fff', '#ffffff']

const toTriplet = (hex) => {
  const h = hex.slice(1)
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6)
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)).join(',')
}
const allowedHex = new Set([...PALETTE, ...NEUTRAL])
const allowedTriplets = new Set([...PALETTE, ...NEUTRAL].map(toTriplet))

const DEFAULT_COLOURS =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

const checks = [
  {
    name: 'Tailwind default palette class',
    regex: new RegExp(`(?<![\\w-])(?:[a-z-]+-)?(?:${DEFAULT_COLOURS})-(?:50|[1-9]00|950)(?![\\w])`, 'g'),
    bad: () => true,
  },
  {
    name: 'colour outside the palette',
    regex: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z_-])/g,
    bad: (match) => {
      const hex = match.toLowerCase()
      const base = hex.length === 9 ? hex.slice(0, 7) : hex.length === 5 ? hex.slice(0, 4) : hex
      return !allowedHex.has(base)
    },
  },
  {
    name: 'colour outside the palette',
    regex: /rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})[^)]*\)/g,
    bad: (_match, groups) => !allowedTriplets.has(groups.join(',')),
  },
  {
    name: 'colour outside the palette',
    regex: /(?:hsla?|oklch|oklab|lab|lch)\([^)]*\)/g,
    bad: () => true,
  },
]

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* walk(path)
    else if (/\.(tsx?|jsx?|css)$/.test(entry)) yield path
  }
}

const problems = []

for (const file of walk(src)) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, index) => {
    // HTML entities such as &#39; and SVG url(#id) references are not colours.
    const text = line.replace(/&#\w+;/g, '').replace(/url\(#[^)]*\)/g, '').replace(/href="#[^"]*"/g, '')
    for (const check of checks) {
      for (const match of text.matchAll(check.regex)) {
        if (check.bad(match[0], match.slice(1))) {
          problems.push(`${relative(root, file)}:${index + 1}  ${check.name}: ${match[0]}`)
        }
      }
    }
  })
}

if (problems.length > 0) {
  console.error(`Palette audit failed: ${problems.length} problem(s)\n`)
  console.error(problems.join('\n'))
  process.exit(1)
}

console.log('Palette audit passed: every colour in src/ comes from the DYMUN palette.')
