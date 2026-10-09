/**
 * Everything about the conference that is likely to change lives in this file.
 * Anything marked TODO is a placeholder: replace it when the real value is known.
 */
export const site = {
  name: "DYMUN '26",
  shortName: 'DYMUN',
  edition: "'26",

  /** Logo file in /public, for example '/logo.svg'. While empty, the text wordmark shows. */
  logoSrc: '', // TODO: replace with the real logo file

  tagline:
    'Join us for two days of diplomacy, debate and bold ideas, where the leaders of tomorrow take on the challenges of today.',

  school: 'D Y Patil International School',
  schoolShort: 'DYPIS',
  city: 'Navi Mumbai',
  venue: 'D Y Patil International School, Navi Mumbai', // TODO: replace once the venue is confirmed

  date: 'TBA', // TODO: replace with the conference dates
  days: 2,
  duration: 'Two days',

  contact: {
    email: '', // TODO: replace
    phone: '', // TODO: replace
  },

  socials: {
    instagram: '', // TODO: replace with the full profile link
    linkedin: '', // TODO: replace with the full profile link
  },
}

/**
 * What search engines and link previews show for each page.
 * Titles aim for 50 to 60 characters, descriptions for 120 to 160. `path` is the page's
 * address; the site's own domain is added automatically. Every page has its own title
 * and description so no two pages look like duplicates.
 */
export const seo = {
  home: {
    path: '/',
    title: "DYMUN '26 | D Y Patil International School, Navi Mumbai",
    description:
      'DYMUN 2026 is a two-day Model UN conference at D Y Patil International School, Navi Mumbai, for Grades 3 to 12: 17 committees, from Primary to High School.',
  },
  committees: {
    path: '/committees',
    title: "All 17 Committees and Agendas | DYMUN '26 Model UN",
    description:
      'Every DYMUN 2026 committee and its agenda: Primary (Grades 3-5), Middle School (Grades 6-8) and High School (Grades 9-12), at D Y Patil International School.',
  },
  team: {
    path: '/team',
    title: "The Secretariat | DYMUN '26 Model UN, Navi Mumbai",
    description:
      'Meet the secretariat behind DYMUN 2026, the two-day Model UN conference at D Y Patil International School, Navi Mumbai, for students in Grades 3 to 12.',
  },
  gallery: {
    path: '/gallery',
    title: "Gallery | DYMUN '26 Model UN Conference, Navi Mumbai",
    description:
      'Photos from DYMUN, the Model UN conference at D Y Patil International School, Navi Mumbai: delegates, committees and ceremonies.',
  },
  contact: {
    path: '/contact',
    title: "Contact the DYMUN '26 Team | Model UN, Navi Mumbai",
    description:
      'How to reach the DYMUN 2026 team at D Y Patil International School, Navi Mumbai, for questions about committees, registration and the conference.',
  },
  notFound: {
    path: '/404',
    title: "Page not found | DYMUN '26",
    description: 'This page does not exist. Go back to the DYMUN 2026 home page.',
  },
}

/** Small words in the footer. The "pending" lines show until contact details are filled in above. */
export const footer = {
  menu: 'Explore',
  emailPending: 'Email TBA', // TODO: replace by setting site.contact.email
  phonePending: 'Phone TBA', // TODO: replace by setting site.contact.phone
  credit: 'Made with love, from Om',
}

/** Navigation. `id` is the section on the home page, `path` its own page if it has one. */
export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'committees', label: 'Committees', path: '/committees' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'gallery', label: 'Gallery', path: '/gallery' },
  { id: 'team', label: 'Team', path: '/team' },
  { id: 'register', label: 'Register' },
]

export const hero = {
  lead: 'Where',
  /** The word that flips. */
  words: ['Diplomacy', 'Debate', 'Delegates', 'Resolutions'],
  close: 'Begin.',
  /** What screen readers hear instead of a word changing every few seconds. */
  spoken: 'Where diplomacy, debate, delegates and resolutions begin.',
  primaryCta: 'Register',
  secondaryCta: 'Explore committees',
}

/**
 * Section headings and short copy. In `body`, {days}, {count} and {grades} are filled in
 * from this file and from committees.js, so the numbers can never drift.
 */
export const sections = {
  about: {
    label: 'About',
    lead: 'What is',
    accent: 'DYMUN',
    body: [
      'DYMUN is the Model United Nations conference of D Y Patil International School, Navi Mumbai.',
      'For {days} days, delegates from Grade {grades} debate the agendas of {count} committees.',
      'Diplomacy, debate and bold ideas, where the leaders of tomorrow take on the challenges of today.',
    ],
    stats: { days: 'Days', committees: 'Committees', grades: 'Grades' },
    /** The text beside the globe. */
    globe: {
      country: 'India',
      caption: 'Delegates, chairs and ideas from every corner. Drag the globe to look around.',
      hint: 'Drag to spin',
      enable: 'Spin the globe',
    },
  },
  committees: {
    label: 'Committees',
    lead: 'Choose your',
    accent: 'committee',
    agendaPending: 'Agenda to be announced',
    allLink: 'See all committees',
  },
  schedule: {
    label: 'Schedule',
    lead: 'Two days,',
    accent: 'one agenda',
    note: 'Timings will be announced.', // TODO: replace once the programme is final
  },
  gallery: {
    label: 'Gallery',
    lead: 'DYMUN in',
    accent: 'pictures',
  },
  team: {
    label: 'Team',
    lead: 'The',
    accent: 'secretariat',
  },
  /** The statement over the waves, from the tagline. `lines[1]` is the serif accent. */
  interlude: {
    label: "DYMUN '26",
    lines: ['The leaders of', 'tomorrow', 'take on the challenges of today.'],
  },
  register: {
    label: 'Register',
    lead: 'Take your',
    accent: 'seat.',
  },
  contact: {
    label: 'Contact',
    lead: 'Get in',
    accent: 'touch',
    pending: 'Contact details will be announced.', // TODO: replace once contact details are set
  },
}

/** Words used only on the separate pages (/committees, /gallery, /contact, not found). */
export const pages = {
  committees: {
    lead: 'All',
    accent: 'committees',
    registerLink: 'Register for a committee',
  },
  gallery: {
    link: 'Open the gallery',
  },
  team: {
    link: 'Meet the team',
  },
  contact: {
    email: 'Email',
    phone: 'Phone',
    venue: 'Venue',
    pendingValue: 'TBA', // shown until the matching value is set in `site.contact`
  },
  notFound: {
    label: 'Error 404',
    lead: 'Page',
    accent: 'not found',
    back: 'Back to the home page',
  },
}
