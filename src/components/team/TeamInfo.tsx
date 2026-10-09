import { Skeleton } from '@/components/ui/skeleton'

export interface TeamMember {
  name: string
  role: string
  photo?: string
  bio?: string
}

/** A detail counts as not filled in yet when it is empty or a "... TBA" placeholder. */
const pending = (value?: string) => !value || /\bTBA$/i.test(value.trim())

/**
 * What the team card shows on hover: photo, name, role and a short bio. Anything that is
 * not filled in yet in src/data/team.js shows as a shimmering skeleton instead, so the
 * card already has its final shape and fills in as details are added.
 */
export function TeamInfo({ member }: { member: TeamMember }) {
  return (
    <div className="w-full">
      {member.photo ? (
        <img
          src={member.photo}
          alt={member.name}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      ) : (
        <Skeleton className="aspect-square w-full" />
      )}

      <div className="mt-4 space-y-3">
        {pending(member.name) ? (
          <Skeleton className="h-6 w-3/4" />
        ) : (
          <p className="text-lg leading-tight font-extrabold tracking-[-0.02em] uppercase">
            {member.name}
          </p>
        )}

        {pending(member.role) ? (
          <Skeleton className="h-4 w-1/2" />
        ) : (
          <p className="text-sm font-semibold text-gold-light">{member.role}</p>
        )}

        {pending(member.bio) ? (
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-text-muted">{member.bio}</p>
        )}
      </div>
    </div>
  )
}
