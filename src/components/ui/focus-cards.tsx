import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@/components/ui/tooltip-card";

/** Wraps a card in the hover tooltip when it has `info`; otherwise leaves it as it is. */
function MaybeTooltip({ info, children }: { info?: ReactNode; children: ReactNode }) {
  if (!info) return <>{children}</>;
  return (
    <Tooltip containerClassName="block w-full" focusable content={info}>
      {children}
    </Tooltip>
  );
}

/** Wraps a card in a link when it has `href`; otherwise leaves it as it is. */
function MaybeLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <Link
      to={href}
      className="block outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
    >
      {children}
    </Link>
  );
}

export type FocusCard = {
  title: string;
  subtitle?: string;
  /** Shown in a card that follows the cursor while the tile is hovered or focused. */
  info?: ReactNode;
  /** Photo. Without one, the tile shows `placeholder` on a dark gold gradient. */
  src?: string;
  /** Which part of the photo to keep when it is cropped (CSS object-position). */
  srcPosition?: string;
  /** Short text for a tile with no photo, for example initials. */
  placeholder?: string;
  /** Makes the whole tile a link to this page. A linked tile has no hover card. */
  href?: string;
};

/**
 * Based on Aceternity "Focus Cards", with its hover blur taken out. The name and role
 * sit under the tile as free text, a tile without a photo shows initials on a dark gold
 * gradient, the colours come from the palette, and a tile can link to its own page.
 */
export function Card({ card, className }: { card: FocusCard; className?: string }) {
  return (
    <div className={className}>
      <MaybeLink href={card.href}>
      <MaybeTooltip info={card.href ? undefined : card.info}>
      <div className="relative h-60 w-full overflow-hidden bg-ink-raised md:h-96">
        {card.src ? (
          <img
            src={card.src}
            alt={card.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: card.srcPosition }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(140deg,var(--color-amber-black),var(--color-amber-deep)_55%,var(--color-gold-dark))] [container-type:size]"
          >
            <span
              className="text-[38cqw] leading-none font-black tracking-[-0.04em] text-amber-black"
              style={{
                WebkitTextStroke: "2px var(--color-gold-light)",
                paintOrder: "stroke fill",
                mixBlendMode: "lighten",
              }}
            >
              {card.placeholder}
            </span>
          </div>
        )}
      </div>

      <p className="mt-4 text-lg leading-tight font-extrabold tracking-[-0.02em] text-fg uppercase md:text-xl">
        {card.title}
      </p>
      {card.subtitle && (
        <p className="label mt-1.5 text-fg-muted">{card.subtitle}</p>
      )}
      </MaybeTooltip>
      </MaybeLink>
    </div>
  );
}

/** Splits the cards into rows of the given sizes; anything left over goes in rows of the last size. */
function toRows(cards: FocusCard[], sizes: number[]) {
  const rows: FocusCard[][] = [];
  let start = 0;
  for (let row = 0; start < cards.length; row++) {
    const size = sizes[Math.min(row, sizes.length - 1)];
    rows.push(cards.slice(start, start + size));
    start += size;
  }
  return rows;
}

/**
 * With `rows` (such as [4, 1, 2, 4]) the tiles sit in centred rows of those sizes, each
 * tile a quarter of the width (half on phones, where a row of 4 wraps into two rows of 2).
 * Without it, a plain grid of 2, or 3 on wider screens.
 */
export function FocusCards({ cards, rows }: { cards: FocusCard[]; rows?: number[] }) {
  if (rows?.length) {
    return (
      <div className="flex w-full flex-col gap-y-12">
        {toRows(cards, rows).map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap justify-center gap-x-5 gap-y-12 md:gap-x-10">
            {row.map((card, index) => (
              <Card
                key={index}
                card={card}
                className="w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-7.5rem)/4)]"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-10">
      {cards.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </div>
  );
}
