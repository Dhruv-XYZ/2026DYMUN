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

/** Small words in the footer. The "pending" lines show until contact details are filled in above. */
export const footer = {
  menu: 'Explore',
  emailPending: 'Email TBA', // TODO: replace by setting site.contact.email
  phonePending: 'Phone TBA', // TODO: replace by setting site.contact.phone
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
  register: {
    label: 'Register',
    lead: 'Take your',
    accent: 'seat.',
    notConnected: 'Registration is not open yet.', // shown until REGISTER_ENDPOINT is set
    success: 'Thank you. Your registration has been received.',
    failure: 'Something went wrong. Please try again.',
  },
  contact: {
    label: 'Contact',
    lead: 'Get in',
    accent: 'touch',
    pending: 'Contact details will be announced.', // TODO: replace once contact details are set
  },
}
