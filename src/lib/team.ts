import { team } from '@/data/team.js'

export interface TeamMember {
  id: string
  name: string
  role: string
  photo?: string
  /** Which part of the photo to keep when a tile crops it, as CSS object-position. */
  photoPosition?: string
  bio?: string
}

export const members: TeamMember[] = team

/** A detail counts as not filled in yet when it is empty or a "... TBA" placeholder. */
export const isPending = (value?: string) => !value || /\bTBA$/i.test(value.trim())

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** What a tile without a photo shows: the initials, or the slot number while there is no name yet. */
export function placeholderFor(member: TeamMember): string {
  return isPending(member.name) ? String(members.indexOf(member) + 1).padStart(2, '0') : initialsOf(member.name)
}

export const memberPath = (member: TeamMember) => `/team/${member.id}`
