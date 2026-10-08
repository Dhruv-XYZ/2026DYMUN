/**
 * Where the registration form is sent.
 *
 * TODO: replace with the real form endpoint (for Formspree it looks like
 * https://formspree.io/f/abcdwxyz). Until then the form does not send anything
 * and tells the visitor that registration is not open yet.
 */
export const REGISTER_ENDPOINT = 'https://formspree.io/f/your-form-id'

/** True once REGISTER_ENDPOINT above has been replaced. */
export const isRegistrationOpen = !REGISTER_ENDPOINT.includes('your-form-id')

/** Ways to attend. Fees and details are placeholders. */
export const registrationTiers = [
  { id: 'delegate', name: 'Delegate', fee: 'TBA', details: 'Fee and inclusions to be announced.' }, // TODO: replace
  { id: 'delegation', name: 'Delegation', fee: 'TBA', details: 'Fee and inclusions to be announced.' }, // TODO: replace
  { id: 'observer', name: 'Observer', fee: 'TBA', details: 'Fee and inclusions to be announced.' }, // TODO: replace
]

/** The words used by the registration form. */
export const registrationForm = {
  title: 'Registration form',
  fields: {
    name: 'Full name',
    grade: 'Grade',
    school: 'School',
    email: 'Email',
    committee: 'Committee preference',
    experience: 'Experience',
  },
  choose: 'Choose',
  submit: 'Send registration',
  errors: {
    name: 'Enter your full name.',
    grade: 'Choose your grade.',
    school: 'Enter the name of your school.',
    email: 'Enter your email address.',
    emailFormat: 'Enter an email address like name@example.com.',
    committee: 'Choose a committee.',
    experience: 'Choose your experience.',
  },
}

/** Choices for the "experience" field of the form. */
export const experienceLevels = [
  'This will be my first conference',
  '1 or 2 conferences',
  '3 or more conferences',
]
