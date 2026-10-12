# 2026DYMUN

A DYMUN conference website built with React and Vite. It presents the event in a polished Model United Nations style with committee details, delegate positioning, OC/EB information, and a registration call to action.

## What's Included

- UN-inspired contemporary information design
- Theme switcher for classic, midnight, and ivory modes
- Responsive layout for phones, tablets, and desktops
- Dedicated pages for About, Details, Committees, OC & EB, and Registration
- Registration CTA linking to the official registration form URL
- Updated footer, navigation, and conference information sections

## Run Locally

Install Node.js 22 or later, then run:

```sh
git clone https://github.com/Dhruv-XYZ/2026DYMUN.git
cd 2026DYMUN
npm install
npm run dev
```

Open the local URL printed in the terminal. The project uses Vite for local development and production builds.

## Registration

Registration is not open yet. The site’s registration links lead to a placeholder page with a disabled preview of the form. Replace the preview with the official form when registration opens.

## Deploy to GitHub Pages

The GitHub Actions workflow builds and deploys the app whenever changes are pushed to `main`. In the repository, open **Settings > Pages** and set **Build and deployment > Source** to **GitHub Actions**. After the workflow completes, the site will be available at:

https://dhruv-xyz.github.io/2026DYMUN/

## Release Notes

```text
0.0.3
- Added a theme switcher with classic, midnight, and ivory modes.
- Expanded the site into a multi-page conference experience.
- Added dedicated Details and OC & EB pages for more complete event information.
- Included a link to the registration form in the navigation and registration flow.
- Improved responsiveness for phones and tablet-sized screens.
- Updated the visual language to feel more MUN-like and institutional.
- Added a conference agenda and highlight section to frame the event experience.
- Introduced a stats grid to present delegate, committee, and event scale information.
- Refined the top-level navigation to include the agenda and keep the homepage more complete for public-facing use.
- Updated the project version metadata to reflect the current release milestone.
```

```text
0.0.2
- Replaced the default Vite screen with a DYMUN conference homepage.
- Added responsive desktop navigation and an interactive mobile menu.
- Added conference introduction, delegate benefits, and research/debate/resolution sections.
- Added a photographic hero, registration/contact calls to action, and an updated footer.
- Updated the README to describe the homepage and local setup.
```

```text
0.0.1
- Set up a React project with Vite.
- Added JavaScript and ESLint.
```
