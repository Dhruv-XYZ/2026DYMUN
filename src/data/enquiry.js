/**
 * The enquiry form, sent through Web3Forms (web3forms.com).
 *
 * TODO: replace. Create a free access key at web3forms.com using the inbox that should
 * receive enquiries, then paste it below. Web3Forms access keys are designed to sit in
 * public page code, so this is not a secret. Until it is replaced, the form checks the
 * fields but sends nothing, and tells the visitor enquiries are not open yet.
 */
export const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/** True once the access key above has been replaced. */
export const isEnquiryOpen = !WEB3FORMS_ACCESS_KEY.startsWith('YOUR_')

/**
 * Spam checks. Every field is checked for presence (when required) and for range:
 * a minimum and maximum length, and for the phone number a count of digits.
 * `minFillSeconds` rejects a form sent faster than a person could type it.
 */
export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  phone: { minDigits: 7, maxDigits: 15 }, // optional, checked only when filled in
  school: { max: 120 }, // optional
  message: { min: 10, max: 1000 },
  minFillSeconds: 3,
  /** Give up on a send that takes longer than this, so the form never hangs. */
  requestTimeoutSeconds: 12,
  /** Rate limit per visitor (per browser session): a pause between sends, and a cap. */
  cooldownSeconds: 30,
  maxPerSession: 3,
}

export const enquiryForm = {
  title: 'Enquiry form',
  intro: 'Questions about DYMUN, committees or registration? Send them here.',
  fields: {
    name: 'Full name',
    email: 'Email',
    phone: 'Phone (optional)',
    school: 'School (optional)',
    message: 'Your enquiry',
  },
  submit: 'Send enquiry',
  errors: {
    name: `Enter your full name (${LIMITS.name.min} to ${LIMITS.name.max} characters).`,
    email: 'Enter your email address.',
    emailFormat: 'Enter an email address like name@example.com.',
    emailLong: `That email address is too long (most ${LIMITS.email.max} characters).`,
    phone: `Enter a phone number with ${LIMITS.phone.minDigits} to ${LIMITS.phone.maxDigits} digits, or leave it empty.`,
    school: `Keep the school name under ${LIMITS.school.max} characters.`,
    message: `Write your enquiry (${LIMITS.message.min} to ${LIMITS.message.max} characters).`,
    tooFast: 'That was very quick. Please check your details and send again.',
    wait: `Please wait ${LIMITS.cooldownSeconds} seconds between enquiries.`,
    tooMany: 'You have sent several enquiries already. We will reply to them soon.',
    duplicate: 'That enquiry has already been sent.',
  },
  timeout: 'The enquiry took too long to send. Check your connection and try again.',
  offline: 'You appear to be offline. Check your connection and try again.',
  notConnected: 'Enquiries are not open yet.',
  success: 'Thank you. Your enquiry has been sent.',
  failure: 'Something went wrong. Please try again.',
}
