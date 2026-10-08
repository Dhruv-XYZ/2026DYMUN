# DYMUN '26 website

The website for DYMUN '26, the Model UN conference hosted by D Y Patil International
School, Navi Mumbai.

Built with Vite, React and TypeScript, Tailwind CSS v4, shadcn, Motion and React Router.
It deploys to Vercel as a static site.

## Run it

```bash
npm install
npm run dev            # local preview
npm run build          # type check, then production build into dist/
npm run preview        # serve the production build locally
npm run audit:palette  # fails if a colour from outside the palette is in src/
```

## Change the content

Everything a non-developer needs to edit is in `src/data/`. You never need to touch a
component to change wording.

| What | File |
| --- | --- |
| Name, tagline, date, venue, contact details, social links, logo | `src/data/site.js` (`site`) |
| Navigation, hero words, section headings and short copy | `src/data/site.js` (`nav`, `hero`, `sections`, `pages`, `footer`) |
| Committees and agendas | `src/data/committees.js` |
| Schedule | `src/data/schedule.js` |
| Secretariat | `src/data/team.js` |
| Registration rows, form wording, form endpoint | `src/data/registration.js` |
| Participating schools (not shown while empty) | `src/data/schools.js` |

Anything still unknown is marked `// TODO: replace` in those files. Search for `TODO` to
find them all.

**Committees.** `committees.js` was transcribed word for word from the DY MUN'26 poster.
Do not reword an agenda in place. If one changes, paste in the new official text.
Set `agenda: null` for a committee whose agenda is not announced; the site then shows
"Agenda to be announced". The numbers on the site (17 committees, Grades 3-12) are
counted from this file, so they update themselves.

**Photos.** Drop image files (jpg, png, webp or avif) into `public/gallery/`. They appear
in the Gallery section and on `/gallery` automatically, and the placeholder tiles stop
being used. Team photos go in `public/team/`, with the path set in `team.js`.

**Logo.** Put the file in `public/` and set `logoSrc` in `site.js` (for example
`'/logo.svg'`). The text wordmark is replaced everywhere. `public/favicon.svg` is a
placeholder mark too.

**Registration form.** Replace `REGISTER_ENDPOINT` in `registration.js` with the real
form endpoint. Until then the form checks the fields but sends nothing, and tells the
visitor that registration is not open yet. The form collects students' names, schools
and email addresses, so agree with the school where that data goes before switching it on.

## Needs from the team

- [ ] Conference date (`site.date`)
- [ ] Venue confirmation (`site.venue`)
- [ ] Logo file (`site.logoSrc`) and favicon
- [ ] Fees and what each covers (`registrationTiers`)
- [ ] Photos (`public/gallery/`)
- [ ] Secretariat names, roles and photos (`team.js`)
- [ ] Schedule: order of events and timings (`schedule.js`)
- [ ] Contact email and phone, social links (`site.contact`, `site.socials`)
- [ ] Registration endpoint (`REGISTER_ENDPOINT`)
- [ ] Confirm the spelling COPUOS (the poster prints "COPOUS")
- [ ] Full committee names, if you want them shown beside the abbreviations
- [ ] Real quotes from past delegates or chairs, if you want a Voices section
- [ ] A 1200 x 630 share image (`public/og.png`, then add the tag noted in `index.html`)

## How it is put together

```
src/
  data/         all content
  lib/          committees.ts (counts and grade range), gallery.ts (photo list)
  hooks/        device profile, active section, page title
  components/
    ui/         the Aceternity components, adapted (see below)
    hero/ about/ committees/ schedule/ gallery/ team/ register/
    Section.tsx Reveal.tsx Logo.tsx Preloader.tsx Dock.tsx Footer.tsx
  pages/        Home, plus /committees /team /gallery /contact and not found
  index.css     colour tokens, type utilities, grain
```

**Colours** are defined once, in `src/index.css`. Tailwind's default palette is switched
off there, so only the DYMUN colours exist. Sections are either `dark` or `cream`
(`<Section tone="...">`), and text, accents and hairlines follow the section they sit in.

**Outline type.** Inter's letter shapes overlap inside, so a plain text stroke shows
stray lines. The `text-outline` utility strokes first and then paints the fill over it
in the section's background colour, which leaves a clean outline.

**Slower devices.** `useDeviceProfile` (in `src/hooks/use-device.ts`) reports phones,
low-power devices and the reduced-motion setting. On those the 3D globe becomes a still
SVG, the lined "DYMUN" word becomes plain outline type, cursor effects are off, the
committees are a simple stacked list and looping animation stops.

## Aceternity components

Installed with `npx shadcn@latest add @aceternity/<name>-demo`, then adapted: demo
content removed, colours remapped to the palette, and `"use client"` dropped. Each has a
note at the top saying what changed. Re-running `shadcn add` for one would overwrite
those changes.

| Component | Where |
| --- | --- |
| loader (Loader One) | Preloader |
| floating-dock | Navigation |
| dotted-glow-background | Hero backdrop |
| text-hover-effect | Hero and footer wordmarks |
| container-text-flip | Hero headline |
| magnetic-button, moving-border | Register button in the hero |
| 3d-globe, canvas-text | About |
| sticky-scroll-reveal | Committees |
| timeline | Schedule |
| 3d-marquee | Gallery |
| focus-cards | Team |
| stateful-button, cover | Register |
| noise-background | Texture of the cream sections |
| carousel | Installed and recoloured, not shown (it is for the Voices section) |

`loader-one` itself is a paid Aceternity component. The free `@aceternity/loader` entry
provides the same `LoaderOne`, which is what the site uses.

## Deploy

`vercel.json` sets the build and sends every address to the app, so `/committees` and
the other pages work when opened directly.

```bash
npx vercel login
npx vercel --prod
```
