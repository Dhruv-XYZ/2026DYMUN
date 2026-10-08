import { committeeGroups } from '@/data/committees.js'

export interface Committee {
  id: string
  name: string
  /** `null` until the agenda is announced. */
  agenda: string | null
  groupId: string
  /** Position across all committees, starting at 0. Drives each committee's visual. */
  index: number
}

export interface CommitteeGroup {
  id: string
  name: string
  /** As written in the data, for example "Grade 6-8". */
  grades: string
  gradeMin: number
  gradeMax: number
  committees: Committee[]
}

let position = 0

export const groups: CommitteeGroup[] = committeeGroups.map((group) => {
  const numbers = (group.grades.match(/\d+/g) ?? []).map(Number)
  return {
    id: group.id,
    name: group.name,
    grades: group.grades,
    gradeMin: Math.min(...numbers),
    gradeMax: Math.max(...numbers),
    committees: group.committees.map((committee) => ({
      id: committee.id,
      name: committee.name,
      agenda: committee.agenda ?? null,
      groupId: group.id,
      index: position++,
    })),
  }
})

export const allCommittees: Committee[] = groups.flatMap((group) => group.committees)

export const committeeCount = allCommittees.length

export const gradeMin = Math.min(...groups.map((group) => group.gradeMin))
export const gradeMax = Math.max(...groups.map((group) => group.gradeMax))

/** "3-12", worked out from the grade labels in the data. */
export const gradeRange = `${gradeMin}-${gradeMax}`

/** Every grade the conference covers, lowest first. */
export const gradeList = Array.from({ length: gradeMax - gradeMin + 1 }, (_, i) => gradeMin + i)

export function groupForGrade(grade: number): CommitteeGroup | undefined {
  return groups.find((group) => grade >= group.gradeMin && grade <= group.gradeMax)
}
