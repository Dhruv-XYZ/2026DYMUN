import { Committees } from '@/components/committees/Committees'
import { Hero } from '@/components/hero/Hero'

/** The landing page. `ready` is false while the preloader is still on screen. */
export default function Home({ ready = true }: { ready?: boolean }) {
  return (
    <>
      <Hero ready={ready} />
      <Committees />
    </>
  )
}
