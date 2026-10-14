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
| Secretariat (name, role, photo, bio; shown in the hover card, with a skeleton for anything missing) | `src/data/team.js` |
| Registration rows (Executive Board, Delegate), fees, and the registration button links | `src/data/registration.js` |
| Each committee's own page (/committees/uncsa, ...): description and its two chairs (name, photo, bio, message) | `src/data/committeeDetails.js` (wording in `committeePage`, `src/data/site.js`) |
| School logo dropdown (address, website link) | `schoolUrl`, `schoolAddress` in `src/data/site.js`, wording in `schoolCard` |
| Participating schools (not shown while empty) | `src/data/schools.js` |

Anything still unknown is marked `// TODO: replace` in those files. Search for `TODO` to
find them all.

**Committees.** `committees.js` was transcribed word for word from the DY MUN'26 poster.
Do not reword an agenda in place. If one changes, paste in the new official text.
Set `agenda: null` for a committee whose agenda is not announced; the site then shows
"Agenda to be announced". The numbers on the site (17 committees, Grades 3-12) are
counted from this file, so they update themselves.

**Photos.** Drop image files (jpg, png, webp or avif) into `public/gallery/`. They appear
in the photo carousel on the home page automatically, and the placeholder tiles stop
being used. Team photos go in `public/team/`, with the path set in `team.js`.

**Logo.** Put the file in `public/` and set `logoSrc` in `site.js` (for example
`'/logo.svg'`). The text wordmark is replaced everywhere. `public/favicon.svg` is a
placeholder mark too.

## Needs from the team

- [ ] Conference date (`site.date`)
- [ ] Venue confirmation (`site.venue`)
- [ ] Logo file (`site.logoSrc`) and favicon
- [ ] Fees and what each covers, and the Executive Board and Delegate registration links (`registrationTiers` in `src/data/registration.js`)
- [ ] Photos (`public/gallery/`)
- [ ] Secretariat names, roles and photos (`team.js`)
- [ ] Contact email and phone, social links (`site.contact`, `site.socials`)
- [ ] Full committee names, if you want them shown beside the abbreviations
- [ ] Real quotes from past delegates or chairs, if you want a Voices section
- [ ] A better share image if wanted (a generated one is at `public/og.png`)
- [ ] Domain name, and the Google Search Console token (see SEO below)

## How it is put together

```
src/
  data/         all content
  lib/          committees.ts (counts and grade range), gallery.ts (photo list)
  hooks/        device profile, active section, page title
  components/
    ui/         the Aceternity components, adapted (see below)
    hero/ about/ committees/ team/ register/
    Section.tsx Reveal.tsx Logo.tsx Preloader.tsx Dock.tsx Footer.tsx
  pages/        Home, plus /about /committees /team /register /contact and not found
  index.css     colour tokens, type utilities, grain
```

**Colours** are defined once, in `src/index.css`. Tailwind's default palette is switched
off there, so only the DYMUN colours exist. Sections are either `dark` or `cream`
(`<Section tone="...">`), and text, accents and hairlines follow the section they sit in.

**Outline type.** Inter's letter shapes overlap inside, so a plain text stroke shows
stray lines. The `text-outline` utility strokes first and then paints the fill over it
in the section's background colour, which leaves a clean outline.

**Slower devices.** `useDeviceProfile` (in `src/hooks/use-device.ts`) reports phones,
low-power devices and the reduced-motion setting. On those the committees are a simple
stacked list and looping animation stops.

## SEO

What is in place, and what only you can do.

**Done in code** (all generated from `seo` in `src/data/site.js`, so wording lives in one place):

- A unique title (50 to 55 characters) and description (about 150) for every page, a single
  `h1` per page with no skipped heading levels, and a canonical address on each page.
- Share tags and a 1200 x 630 share image (`public/og.png`), `twitter:card` set to large image.
- `sitemap.xml` and `robots.txt` written at build time, plus JSON-LD structured data
  (`WebSite` and `Organization`). The address used is `SITE_URL`, or on Vercel the production
  address Vercel provides automatically. With neither, no sitemap or canonical is written
  rather than a wrong one, and the build prints a warning.
- No page is `noindex`, except the not-found page, which should be. Unknown addresses return
  the app with a 200 status on a single-page site, so that tag keeps them out of search.
- HTTPS enforced with an HSTS header, plus basic security headers (`vercel.json`). Vercel also
  redirects http to https by itself.
- Every image has `alt` text (decorative ones have an empty one on purpose), and
  links between pages use descriptive text.
- Internal links: Home to Committees and Team pages; Register to Committees and
  Contact; the footer links to every page.

**Still to do once the site is live**

1. **Set the domain.** On Vercel, add the custom domain; the sitemap and canonical use it
   automatically on the next build. Elsewhere, build with `SITE_URL=https://your-domain`.
2. **Verify Google Search Console.** Add the site at search.google.com/search-console, choose
   the "HTML tag" method, copy the token from the tag it shows, and set it as the
   `GOOGLE_SITE_VERIFICATION` environment variable. Redeploy, press Verify, then submit
   `https://your-domain/sitemap.xml`. Do the same in Bing Webmaster Tools if you like.
3. **Event structured data.** Once the dates are confirmed, add an `Event` block (name, start
   and end date, venue, organiser) in `seoFiles` in `vite.config.ts`. It is left out now because
   Google needs a real start date and none is known yet.

**Backlink strategy.** For a school conference the best links come from people who already
know it exists, so ask for them directly and keep each one specific:

- The school's own website: a link to the DYMUN site from the main page and the news page.
- Participating schools: link from their newsletters and event pages when they register.
- MUN directories and calendars: submit the conference to the Model UN listings used in India.
- Local press and school-news pages: send the post-event photos and results with the link.
- Student and alumni social profiles: the Instagram and LinkedIn links in `site.js` should point
  back to the site, and the site should link out to them once they exist.

Avoid bought or swapped links. They do harm.

## Aceternity components

Installed with `npx shadcn@latest add @aceternity/<name>-demo`, then adapted: demo
content removed, colours remapped to the palette, and `"use client"` dropped. Each has a
note at the top saying what changed. Re-running `shadcn add` for one would overwrite
those changes.

| Component | Where |
| --- | --- |
| loader (Loader One) | Preloader |
| floating-dock | Navigation |
| text-hover-effect | Hero and footer wordmarks |
| focus-cards, tooltip-card | Team (the hover card follows the cursor) |
| noise-background | Texture of the cream sections |
| vortex | A very faint field of orange and gold streaks fixed behind the whole page (`components/PageVortex.tsx`) |
| wavy-background, sparkles | The orange and gold statement between Team and Register (`components/interlude/`; its words are `sections.interlude` in `site.js`) |
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
