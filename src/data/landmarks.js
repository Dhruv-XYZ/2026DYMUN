/**
 * United Nations landmarks shown as gold dots on the About globe. Hover or focus a dot
 * and a card opens with a photo and a few lines about the place.
 *
 * Photos are in /public/landmarks. All come from Wikimedia Commons under free licences;
 * `credit` is shown under each photo as the licences require.
 */
export const landmarks = [
  {
    id: 'un-hq',
    name: 'United Nations Headquarters',
    place: 'New York, United States',
    lat: 40.7489,
    lng: -73.968,
    text: 'The home of the General Assembly and the Security Council, on the East River in Manhattan. The complex was built in the early 1950s.',
    image: '/landmarks/un-hq.webp',
    alt: 'The East River and the Manhattan skyline where the United Nations Headquarters stands',
    credit: 'Jakub Hałun, CC BY 4.0',
  },
  {
    id: 'geneva',
    name: 'Palace of Nations',
    place: 'Geneva, Switzerland',
    lat: 46.2267,
    lng: 6.1405,
    text: 'Built between 1929 and 1938 for the League of Nations, it is now the seat of the United Nations Office at Geneva.',
    image: '/landmarks/geneva.webp',
    alt: 'The Palace of Nations in Geneva with its stone colonnade and lawns',
    credit: 'Vassil, CC0',
  },
  {
    id: 'hague',
    name: 'Peace Palace',
    place: 'The Hague, Netherlands',
    lat: 52.0867,
    lng: 4.2957,
    text: 'Opened in 1913, it is the seat of the International Court of Justice, the principal judicial organ of the United Nations.',
    image: '/landmarks/hague.webp',
    alt: 'The Peace Palace in The Hague, a brick palace with a tall clock tower',
    credit: 'Velvet, CC BY-SA 4.0',
  },
  {
    id: 'vienna',
    name: 'Vienna International Centre',
    place: 'Vienna, Austria',
    lat: 48.2336,
    lng: 16.4148,
    text: 'Opened in 1979, it is home to the United Nations Office at Vienna and the International Atomic Energy Agency.',
    image: '/landmarks/vienna.webp',
    alt: 'A curved glass tower of the Vienna International Centre against a blue sky',
    credit: 'Dimitry Anikin, CC0',
  },
  {
    id: 'nairobi',
    name: 'United Nations Office at Nairobi',
    place: 'Nairobi, Kenya',
    lat: -1.2339,
    lng: 36.8153,
    text: 'The United Nations headquarters in Africa. It hosts the UN Environment Programme and UN-Habitat.',
    image: '/landmarks/nairobi.webp',
    alt: 'A garden courtyard inside the UN-Habitat offices in Nairobi',
    credit: 'Kip254, CC BY-SA 4.0',
  },
  {
    id: 'unesco',
    name: 'UNESCO Headquarters',
    place: 'Paris, France',
    lat: 48.8503,
    lng: 2.3063,
    text: 'UNESCO, the United Nations agency for education, science and culture, has been based in Paris since 1958.',
    image: '/landmarks/unesco.webp',
    alt: 'The UNESCO name on the wall at its headquarters in Paris',
    credit: 'Eva Rinaldi, CC BY-SA 2.0',
  },
]
