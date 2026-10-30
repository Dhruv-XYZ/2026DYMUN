/**
 * DYMUN '26 committees, transcribed from the official DY MUN'26 poster.
 *
 * Agenda text is copied word for word from the poster. Do not reword, shorten or
 * tidy it here. If an agenda changes, paste in the new official wording.
 *
 * `agenda: null` means the agenda has not been announced yet. The site then shows
 * "Agenda to be announced".
 *
 * The last Middle School committee is spelled COPOUS, exactly as on the poster.
 *
 * `noAgenda: true` marks a committee that has no agenda at all (International Press).
 * The site then shows no agenda text for it, instead of "Agenda to be announced".
 */
export const committeeGroups = [
  {
    id: 'primary',
    name: 'Primary',
    grades: 'Grade 3-5',
    committees: [
      {
        id: 'uncsa',
        fullName: 'United Nations Council on Superhuman Activities',
        name: 'UNCSA',
        agenda:
          'With the multiverse collapsing, should superheroes be allowed to travel through time to alter events or sacrifice them to save millions elsewhere?',
      },
      {
        id: 'harry-potter',
        name: 'Harry Potter',
        agenda: 'Should Students Be Allowed to Break Wizarding Laws to Save Lives?',
      },
      {
        id: 'sdg-11',
        fullName: 'Sustainable Cities and Communities & Climate Action',
        name: 'SDG 11 & 13',
        agenda:
          'Discussing solutions for the environmental and public impact of the construction of AI data centres',
      },
      {
        id: 'sdg-4',
        fullName: 'Quality Education',
        name: 'SDG 4',
        agenda:
          'Ensuring Equitable Access to Artificial Intelligence in Education While Protecting Educational Quality and Student Privacy.',
      },
      {
        id: 'sdg-15',
        fullName: 'Life Below Water & Life on Land',
        name: 'SDG 14 & 15',
        agenda:
          'Addressing the depletion and extinction of living organisms and biodiversity on land and water and discussing sustainable solutions for preserving vulnerable populations and their habitats.',
      },
    ],
  },
  {
    id: 'middle',
    name: 'Middle School',
    grades: 'Grade 6-8',
    committees: [
      {
        id: 'unhrc',
        fullName: 'United Nations Human Rights Council',
        name: 'UNHRC',
        agenda:
          'Addressing Systematic Human Rights Violations and the Protection of Civilians Amid Myanmar’s Ongoing Political and Armed Conflict.',
      },
      {
        id: 'disec',
        fullName: 'Disarmament and International Security Committee',
        name: 'DISEC',
        agenda:
          'Establishing International Regulations on Lethal Autonomous Weapons Systems and Preventing the Loss of Meaningful Human Control Over the Use of Force.',
      },
      {
        id: 'unodc',
        fullName: 'United Nations Office on Drugs and Crime',
        name: 'UNODC',
        agenda:
          'Countering the Convergence of Drug Trafficking, Organized Crime and Illicit Financial Networks in the Age of Synthetic Drugs',
      },
      {
        id: 'isc',
        name: 'ISC',
        agenda:
          'Balancing Scientific Progress and Bioethical Responsibility in the Development of Human Gene-Editing Technologies',
      },
      {
        id: 'fifa',
        fullName: 'Fédération Internationale de Football Association',
        name: 'FIFA',
        agenda:
          'Deliberating the role of the FIFA presidency and hosting countries in the politicisation and privatisation of the FIFA world cup, and its impact on international football',
      },
      {
        id: 'copous',
        fullName: 'Committee on the Peaceful Uses of Outer Space',
        name: 'COPOUS',
        agenda:
          'Establishing an International Legal Framework for the Extraction and Utilization of Lunar Resources by States and Private Entities.',
      },
    ],
  },
  {
    id: 'high',
    name: 'High School',
    grades: 'Grade 9-12',
    committees: [
      {
        id: 'icj',
        fullName: 'International Court of Justice',
        name: 'ICJ',
        agenda:
          'Application of the definitive settlement of the land boundary dispute between Guyana and Venezuela',
      },
      {
        id: 'unsc',
        fullName: 'United Nations Security Council',
        name: 'UNSC',
        agenda:
          'Combating Terrorism in Cabo Delgado: Forming links between extremism and Transnational Networks',
      },
      {
        id: 'ccc',
        fullName: 'Constant Crisis Committee',
        name: 'CCC',
        agenda:
          'The Saudi War: U.S. Invasion of Saudi Arabia, the Aramco Deal and the Battle for the Gulf',
      },
      {
        id: 'aippm',
        fullName: 'All India Political Parties Meet',
        name: 'AIPPM',
        agenda: 'India’s Strategic Autonomy in an Era of Global Conflict',
      },
      {
        id: 'ecosoc',
        fullName: 'Economic and Social Council',
        name: 'ECOSOC',
        agenda:
          'The Weaponisation of Global Finance: Sanctions, Sovereign Debt and Economic Warfare',
      },
      {
        id: 'international-press',
        name: 'International Press',
        agenda: null,
        noAgenda: true,
      },
    ],
  },
]
