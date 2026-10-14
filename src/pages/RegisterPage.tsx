import { Register } from '@/components/register/Register'
import { usePageMeta } from '@/hooks/use-page-meta'

/** /register: the ways to attend and the enquiry form. */
export default function RegisterPage() {
  usePageMeta('register')
  return <Register headingLevel={1} />
}
