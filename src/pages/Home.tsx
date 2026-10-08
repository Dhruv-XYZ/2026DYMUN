import { About } from '@/components/about/About'
import { Committees } from '@/components/committees/Committees'
import { Gallery } from '@/components/gallery/Gallery'
import { Hero } from '@/components/hero/Hero'
import { Register } from '@/components/register/Register'
import { Schedule } from '@/components/schedule/Schedule'
import { Team } from '@/components/team/Team'

/**
 * The landing page. Sections alternate dark and cream:
 * hero (dark), about (cream), committees (dark), schedule (cream), gallery (dark),
 * team (dark), register (cream), then the dark footer.
 * `ready` is false while the preloader is still on screen.
 */
export default function Home({ ready = true }: { ready?: boolean }) {
  return (
    <>
      <Hero ready={ready} />
      <About />
      <Committees />
      <Schedule />
      <Gallery />
      <Team />
      <Register />
    </>
  )
}
