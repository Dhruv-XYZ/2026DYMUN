/**
 * Ways to register, shown as two rows in the Register section. Each row opens a dropdown
 * with a registration button.
 *
 * TODO: replace. For each row set `registerUrl` to the registration form link, for example
 * 'https://forms.gle/abc123'. Until it is set the button is shown but does nothing. Fees
 * and details are placeholders too. The enquiry form under the rows is separate: see
 * src/data/enquiry.js.
 */
export const registrationTiers = [
  {
    id: 'executive-board',
    name: 'Executive Board',
    fee: 'TBA', // TODO: replace
    details: 'Fee and inclusions to be announced.', // TODO: replace
    registerUrl: '', // TODO: replace with the Executive Board registration link
  },
  {
    id: 'delegate',
    name: 'Delegate',
    fee: 'TBA', // TODO: replace
    details: 'Fee and inclusions to be announced.', // TODO: replace
    registerUrl: '', // TODO: replace with the Delegate registration link
  },
]

/** Words on the registration button inside each dropdown. */
export const registrationButton = 'Register now'
