/**
 * Secretariat, in the order they appear on the team page.
 *
 * For each person, `photo` is a file in /public/team (for example '/team/mahi-singh.jpg')
 * and `bio` is a few sentences, shown on their own page. Without a photo the tile shows
 * the person's initials; without a bio their page says one will be added.
 *
 * `id` is the end of the person's page address (/team/<id>). Use lowercase words joined
 * by hyphens, such as 'mahi-singh', and keep each one unique.
 *
 * The team page shows them in rows of 4, 1, 2 and 4 (`teamRows` below), filled in this
 * order. Anything left over after those rows goes into further rows of 4.
 */
export const teamRows = [4, 1, 2, 4]

export const team = [
  { id: 'delisha-tushar-goshar', name: 'Delisha Tushar Goshar', role: 'Secretary General', photo: '', bio: '' },
  { id: 'mahi-singh', name: 'Mahi Singh', role: 'Director General', photo: '', bio: '' },
  { id: 'aditya-abhijit-kadam', name: 'Aditya Abhijit Kadam', role: 'Joint Secretary General', photo: '', bio: '' },
  { id: 'areev-anand-shah', name: 'Areev Anand Shah', role: 'Joint Director General', photo: '', bio: '' },
  { id: 'kavish-nikhil-thakkar', name: 'Kavish Nikhil Thakkar', role: 'Advisor-in-Chief', photo: '', bio: '' },
  { id: 'rida-parvez-khalfay', name: 'Rida Parvez Khalfay', role: "Chargé d'Affaires", photo: '', bio: '' },
  { id: 'dyuti-bhatt', name: 'Dyuti Bhatt', role: "Chargé d'Affaires", photo: '', bio: '' },
  { id: 'druv-raina', name: 'Druv Raina', role: 'Director of Technology', photo: '', bio: '' },
  { id: 'saksham-agarwal', name: 'Saksham Agarwal', role: 'Director of Technology', photo: '', bio: '' },
  { id: 'mokshitaa-gujjarlapudi', name: 'Mokshitaa Gujjarlapudi', role: 'Director of Logistics', photo: '', bio: '' },
  { id: 'sharvari-sachin-mhatre', name: 'Sharvari Sachin Mhatre', role: 'Director of Logistics', photo: '', bio: '' },
]
