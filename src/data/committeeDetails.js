/**
 * What each committee's own page shows beyond its name and agenda (those are in
 * committees.js). Add an entry under the committee's `id`. Anything left empty shows
 * the "to be announced" wording from `committeePage` in site.js.
 *
 * Every committee has its `about` text. TODO: the chairs are still placeholders. For one
 * committee, add them like this:
 *
 *   uncsa: {
 *     about: 'Two or three sentences about the committee.',
 *     chairs: [
 *       { name: 'Full name', role: 'Chair', photo: '/chairs/name.jpg', bio: 'About the chair.', message: 'Their message to delegates.' },
 *       { name: 'Full name', role: 'Co-Chair', photo: '', bio: '', message: '' },
 *     ],
 *   },
 *
 * `photo` is a file in /public (for example '/chairs/name.jpg'); without one the page
 * shows the chair's initials.
 */
const placeholderChair = { name: '', role: '', photo: '', bio: '', message: '' }

export const committeeDetails = {
  // Grade 3-5
  uncsa: {
    about:
      'A council of the world’s superheroes, meeting when the multiverse itself is at risk. Delegates speak for heroes and nations, weigh the power to change history against the lives it could cost, and agree on rules for when, and whether, that power should ever be used.',
  },
  'harry-potter': {
    about:
      'The wizarding world gathers to settle a hard question: is breaking the law ever right when lives are on the line? Delegates take on the roles of the characters and institutions of the Harry Potter books and debate where rules should bend, and who gets to decide.',
  },
  'sdg-11': {
    about:
      'Built around two Sustainable Development Goals, Sustainable Cities and Communities (SDG 11) and Climate Action (SDG 13). Delegates look at how cities can grow and use new technology without harming the people who live in them or the planet they share.',
  },
  'sdg-4': {
    about:
      'Built around the Sustainable Development Goal for Quality Education. Delegates work out how every child can benefit from artificial intelligence in the classroom, fairly and safely, while keeping learning meaningful and students’ information private.',
  },
  'sdg-15': {
    about:
      'Built around two Sustainable Development Goals, Life Below Water (SDG 14) and Life on Land (SDG 15). Delegates look for ways to protect plants, animals and their homes, on land and in the water, before more of them are lost for good.',
  },

  // Grade 6-8
  unhrc: {
    about:
      'The United Nations body responsible for promoting and protecting human rights around the world. Its 47 member states review abuses, speak up for people at risk and recommend action, making it the place where the world holds governments to account for how they treat their people.',
  },
  disec: {
    about:
      'The First Committee of the UN General Assembly, where every member state has a seat. It deals with disarmament and threats to international peace, from nuclear weapons to new technologies that are changing how wars are fought.',
  },
  unodc: {
    about:
      'The UN’s lead office against illicit drugs, organised crime, corruption and terrorism. It helps states build laws, share intelligence and work across borders against criminal networks that no single country can tackle alone.',
  },
  isc: {
    about:
      'A committee of scientists, ethicists and policymakers that looks at where scientific progress meets moral responsibility. Delegates weigh the promise of new research against its risks and set out how discoveries should be governed.',
  },
  fifa: {
    about:
      'The international governing body of football, made up of national associations from around the world. Beyond running the World Cup, it shapes how the game is organised, funded and played, and how politics and money touch the sport.',
  },
  copous: {
    about:
      'The UN committee set up in 1959 to govern the exploration and use of outer space for the benefit of all countries. It drafted the treaties that underpin space law today and now faces the questions raised by private companies and new space powers.',
  },

  // Grade 9-12
  icj: {
    about:
      'The principal judicial organ of the United Nations, sitting at the Peace Palace in The Hague. It settles legal disputes between states and gives advisory opinions, and in this committee delegates act as judges and advocates arguing a real case.',
  },
  unsc: {
    about:
      'The UN body with primary responsibility for international peace and security. Its five permanent members hold a veto, and it is the only UN organ whose decisions member states are obliged to carry out, from sanctions to peacekeeping.',
  },
  ccc: {
    about:
      'A fast-moving crisis committee in which events unfold in real time. Delegates react to updates as they arrive, make decisions under pressure and see the consequences play out as the crisis develops session by session.',
  },
  aippm: {
    about:
      'A meeting of India’s political parties, with delegates speaking as leading national figures. They debate the country’s most pressing questions as its politicians would, balancing party lines with the national interest.',
  },
  ecosoc: {
    about:
      'One of the six principal organs of the United Nations, coordinating the UN’s economic, social and environmental work. It brings together governments and agencies to shape policy on development, trade and finance.',
  },
  'international-press': {
    about:
      'The conference’s newsroom. Journalists and photographers move between committees, report on the debates as they happen and publish coverage of DYMUN ’26 through the two days.',
  },
}

/** The details for one committee, with placeholders filling anything not written yet. */
export function detailsFor(id) {
  const entry = committeeDetails[id] ?? {}
  const chairs = [0, 1].map((position) => ({ ...placeholderChair, ...(entry.chairs?.[position] ?? {}) }))
  return { about: entry.about ?? '', chairs }
}
