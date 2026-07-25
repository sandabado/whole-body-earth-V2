import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "../PillarShelf.module.css";

export type ShelfId =
  | "presence"
  | "press"
  | "studios"
  | "foundation"
  | "guardian"
  | "whole";

export type ActivePillar = ShelfId | "none";

export type ShelfStat = {
  label: string;
  value: string;
};

export const SHELF_ACCENTS: Record<ShelfId, string> = {
  presence: "#FF6B35",
  press: "#A8D8EA",
  studios: "#2E86AB",
  foundation: "#8B6F47",
  guardian: "#6D4AFF",
  whole: "#FF3366",
};

type ShelfContentProps = {
  id: Exclude<ShelfId, "whole">;
  symbol: string;
  title: string;
  geometry: string;
  about: string;
  stats: readonly ShelfStat[];
  href: string;
  cta: string;
};

type AccentProperties = CSSProperties & {
  "--shelf-accent": string;
};

export function ShelfContent({
  id,
  symbol,
  title,
  geometry,
  about,
  stats,
  href,
  cta,
}: ShelfContentProps) {
  const accentStyle = {
    "--shelf-accent": SHELF_ACCENTS[id],
  } as AccentProperties;

  return (
    <section className={styles.pillarContent} style={accentStyle} data-shelf-content={id}>
      <header className={styles.identity}>
        <span className={styles.identitySymbol} aria-hidden="true">
          {symbol}
        </span>
        <div>
          <h2 id="pillar-shelf-heading">{title}</h2>
          <p>{geometry}</p>
        </div>
      </header>

      <p className={styles.about}>{about}</p>

      <dl className={styles.stats} aria-label={`${title} live statistics`}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>

      <Link className={styles.pillarCta} href={href}>
        {cta} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
