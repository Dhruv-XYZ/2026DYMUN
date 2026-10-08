import { site } from '@/data/site.js'
import { cn } from '@/lib/utils'

/**
 * The site's logo, used in the header, preloader and footer.
 *
 * It is a text wordmark until a real logo exists. To swap it in, put the file in
 * /public and set `logoSrc` in src/data/site.js. Nothing else needs to change.
 */
export function Logo({ className }: { className?: string }) {
  if (site.logoSrc) {
    return <img src={site.logoSrc} alt={site.name} className={cn('h-8 w-auto', className)} />
  }

  return (
    <span
      className={cn(
        'text-xl leading-none font-black tracking-[-0.04em] whitespace-nowrap uppercase',
        className,
      )}
    >
      {site.shortName} {site.edition}
    </span>
  )
}
