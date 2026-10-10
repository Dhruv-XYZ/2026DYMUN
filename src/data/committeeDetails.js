/**
 * What each committee's own page shows beyond its name and agenda (those are in
 * committees.js). Add an entry under the committee's `id`. Anything left empty shows
 * the "to be announced" wording from `committeePage` in site.js.
 *
 * TODO: replace. Every committee currently has the same two placeholder chairs and no
 * description. For one committee, write for example:
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

export const committeeDetails = {}

/** The details for one committee, with placeholders filling anything not written yet. */
export function detailsFor(id) {
  const entry = committeeDetails[id] ?? {}
  const chairs = [0, 1].map((position) => ({ ...placeholderChair, ...(entry.chairs?.[position] ?? {}) }))
  return { about: entry.about ?? '', chairs }
}
