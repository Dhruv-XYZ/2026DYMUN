import { useEffect } from 'react'
import { About } from '@/components/about/About'
import { Committees } from '@/components/committees/Committees'
import { Welcome } from '@/components/hero/Welcome'
import { Gallery } from '@/components/gallery/Gallery'
import { Register } from '@/components/register/Register'
import { Schedule } from '@/components/schedule/Schedule'
import { Team } from '@/components/team/Team'

/**
 * Everything on the landing page below the hero. One file so the hero can load and
 * paint first, and this follows as its own chunk (see Home.tsx).
 */
export default function HomeSections() {
  // A link such as /#register arrives before these sections exist; go there now they do.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <>
      <Welcome />
      <About />
      <Committees />
      <Schedule />
      <Gallery />
      <Team />
      <Register />
    </>
  )
}
