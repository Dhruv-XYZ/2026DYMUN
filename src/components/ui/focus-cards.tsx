import { memo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

export type FocusCard = {
  title: string;
  subtitle?: string;
  /** Photo. Without one, the tile shows `placeholder` on a dark gold gradient. */
  src?: string;
  /** Short text for a tile with no photo, for example initials. */
  placeholder?: string;
};

/**
 * Aceternity "Focus Cards": hover one tile and the others blur and step back.
 * Changed for DYMUN: the name and role sit under the tile as free text instead of
 * inside a dark overlay, a tile without a photo shows initials on a dark gold
 * gradient, and the colours come from the palette.
 */
export const Card = memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: FocusCard;
    index: number;
    hovered: number | null;
    setHovered: Dispatch<SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "scale-[0.98] blur-sm",
      )}
    >
      <div className="relative h-60 w-full overflow-hidden bg-ink-raised md:h-96">
        {card.src ? (
          <img
            src={card.src}
            alt={card.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
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
              }}
            >
              {card.placeholder}
            </span>
          </div>
        )}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 ring-1 ring-gold/0 transition duration-300 ring-inset",
            hovered === index && "ring-gold/80",
          )}
        />
      </div>

      <p className="mt-4 text-lg leading-tight font-extrabold tracking-[-0.02em] text-fg uppercase md:text-xl">
        {card.title}
      </p>
      {card.subtitle && (
        <p className="label mt-1.5 text-fg-muted">{card.subtitle}</p>
      )}
    </div>
  ),
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: FocusCard[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid w-full grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-10">
      {cards.map((card, index) => (
        <Card
          key={index}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
