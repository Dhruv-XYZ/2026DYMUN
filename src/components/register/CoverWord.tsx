import type { ReactNode } from 'react'
import { Cover } from '@/components/ui/cover'

/**
 * One headline word wrapped in the warp-speed hover effect. Its own file so the
 * particle library behind it loads separately, and only on devices with a cursor.
 */
export default function CoverWord({ children }: { children: ReactNode }) {
  return <Cover>{children}</Cover>
}
