import { About } from '@/components/about/About'
import { usePageMeta } from '@/hooks/use-page-meta'

/** /about: what DYMUN is. */
export default function AboutPage() {
  usePageMeta('about')
  return <About headingLevel={1} />
}
