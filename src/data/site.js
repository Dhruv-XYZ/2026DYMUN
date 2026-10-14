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
  /** The school's logo, top right of every page. A shield and the D Y Patil wordmark on a transparent background. */
  schoolLogoSrc: '/logos/dypis.webp',
  /** The DYMUN emblem, shown large on the right of the home screen. */
  munLogoSrc: '/logos/dymun.webp',

  tagline:
    'Join us for two days of diplomacy, debate and bold ideas, where the leaders of tomorrow take on the challenges of today.',

  school: 'D Y Patil International School',
  schoolShort: 'DYPIS',
  /** The school's own website (checked: https://dypisnerul.in/ is the D Y Patil International School site). */
  schoolUrl: 'https://dypisnerul.in/',
  /** As printed on the school's website. */
  schoolAddress: 'D Y Patil Vidhyanagar, Sector 7, Nerul, Navi Mumbai 400706',
  city: 'Navi Mumbai',
  venue: 'D Y Patil International School, Navi Mumbai', // TODO: replace once the venue is confirmed

  date: '4 & 5 December',
  /** The short venue line on the home page. */
  venueLine: 'DYPIS Nerul',
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
    title: "The Team | DYMUN '26 Model UN, Navi Mumbai",
    description:
      'Meet the team behind DYMUN 2026, the two-day Model UN conference at D Y Patil International School, Navi Mumbai, for students in Grades 3 to 12.',
  },
  about: {
    path: '/about',
    title: "About DYMUN '26 | Model UN, D Y Patil International School",
    description:
      'What DYMUN is: the two-day Model UN conference at D Y Patil International School, Navi Mumbai, for Grades 3 to 12, with 17 committees from Primary to High School.',
  },
  register: {
    path: '/register',
    title: "Register for DYMUN '26 | Executive Board and Delegates",
    description:
      'Register for DYMUN 2026, the Model UN conference at D Y Patil International School, Navi Mumbai: join as an Executive Board member or as a delegate, with fees and how to register.',
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
  photoCredit: 'Hero photo: United Nations General Assembly Hall, Basil D Soufi, CC BY-SA 3.0, via Wikimedia Commons',
}

/** Navigation. Every item is its own page; only the home page loads at first. */
export const nav = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'committees', label: 'Committees', path: '/committees' },
  { id: 'team', label: 'Team', path: '/team' },
  { id: 'register', label: 'Register', path: '/register' },
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
  },
  committees: {
    label: 'Committees',
    lead: 'Choose your',
    accent: 'committee',
    agendaPending: 'Agenda to be announced',
    allLink: 'See all committees',
  },
  team: {
    label: 'Team',
    lead: 'The',
    accent: 'team',
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

/** The dropdown that opens when the school's logo (top right) is hovered or tapped. */
export const schoolCard = {
  intro: "The school hosting DYMUN '26.",
  button: 'School website',
}

/**
 * Words on each committee's own page (/committees/uncsa and so on). The committee's
 * name and agenda come from committees.js; chairs and descriptions come from
 * committeeDetails.js, and show the "pending" wording below until they are filled in.
 */
export const committeePage = {
  back: 'All committees',
  agenda: 'Agenda',
  about: 'About the committee',
  aboutPending: 'A short description of this committee will be added here.',
  chairs: 'Chairs',
  chairRole: 'Chair',
  chairNamePending: 'Chair to be announced',
  chairBioPending: 'Information about this chair will be added here.',
  messageTitle: 'Message from the chair',
  messagePending: 'A message from the chair will be added here.',
  previous: 'Previous committee',
  next: 'Next committee',
  register: 'Register for this committee',
  view: 'View committee',
}

/** Words used only on the separate pages (/committees, /contact, not found). */
export const pages = {
  committees: {
    lead: 'All',
    accent: 'committees',
    registerLink: 'Register for a committee',
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
