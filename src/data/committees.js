/**
 * DYMUN '26 committees, transcribed from the official DY MUN'26 poster.
 *
 * Agenda text is copied word for word from the poster. Do not reword, shorten or
 * tidy it here. If an agenda changes, paste in the new official wording.
 *
 * `agenda: null` means the agenda has not been announced yet. The site then shows
 * "Agenda to be announced".
 *
 * TODO: confirm. The poster prints the last Middle School committee as "COPOUS".
 * The site uses COPUOS, the usual abbreviation. Change `name` below if that is wrong.
 */
export const committeeGroups = [
  {
    id: 'primary',
    name: 'Primary',
    grades: 'Grade 3-5',
    committees: [
      {
        id: 'uncsa',
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
        name: 'SDG 11',
        agenda:
          'Discussing solutions for the environmental and public impact of the construction of AI data centres',
      },
      {
        id: 'sdg-4',
        name: 'SDG 4',
        agenda:
          'Ensuring Equitable Access to Artificial Intelligence in Education While Protecting Educational Quality and Student Privacy.',
      },
      {
        id: 'sdg-15',
        name: 'SDG 15',
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
        name: 'UNHRC',
        agenda:
          'Addressing Systematic Human Rights Violations and the Protection of Civilians Amid Myanmar’s Ongoing Political and Armed Conflict.',
      },
      {
        id: 'disec',
        name: 'DISEC',
        agenda:
          'Establishing International Regulations on Lethal Autonomous Weapons Systems and Preventing the Loss of Meaningful Human Control Over the Use of Force.',
      },
      {
        id: 'unodc',
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
        name: 'FIFA',
        agenda:
          'Deliberating the role of the FIFA presidency and hosting countries in the politicisation and privatisation of the FIFA world cup, and its impact on international football',
      },
      {
        id: 'copuos',
        name: 'COPUOS',
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
        name: 'ICJ',
        agenda:
          'Application of the definitive settlement of the land boundary dispute between Guyana and Venezuela',
      },
      {
        id: 'unsc',
        name: 'UNSC',
        agenda:
          'Combating Terrorism in Cabo Delgado: Forming links between extremism and Transnational Networks',
      },
      {
        id: 'ccc',
        name: 'CCC',
        agenda:
          'The Saudi War: U.S. Invasion of Saudi Arabia, the Aramco Deal and the Battle for the Gulf',
      },
      {
        id: 'aippm',
        name: 'AIPPM',
        agenda: 'India’s Strategic Autonomy in an Era of Global Conflict',
      },
      {
        id: 'ecosoc',
        name: 'ECOSOC',
        agenda:
          'The Weaponisation of Global Finance: Sanctions, Sovereign Debt and Economic Warfare',
      },
      {
        id: 'international-press',
        name: 'International Press',
        agenda: null,
      },
    ],
  },
]
