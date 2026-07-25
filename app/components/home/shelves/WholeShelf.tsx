import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "../PillarShelf.module.css";
import { SHELF_ACCENTS, type ShelfId } from "./ShelfContent";

const upcoming = [
  { date: "Aug 03", symbol: "🜂︎", title: "Presence Circle", meta: "Virtual", pillar: "presence" },
  { date: "Aug 07", symbol: "🜄︎", title: "Ground Drop", meta: "Vinyl", pillar: "studios" },
  { date: "Aug 12", symbol: "🜁︎", title: "Review Opens", meta: "Press", pillar: "press" },
  { date: "Aug 19", symbol: "🜃︎", title: "Site Survey", meta: "Morongo Valley", pillar: "foundation" },
  { date: "Aug 26", symbol: "🜂︎", title: "Retreat Close", meta: "Presence", pillar: "presence" },
] as const satisfies ReadonlyArray<{
  date: string;
  symbol: string;
  title: string;
  meta: string;
  pillar: Exclude<ShelfId, "whole" | "guardian">;
}>;

const activity = [
  { symbol: "🜂︎", message: "Maya joined Circle", time: "2m ago", pillar: "presence" },
  { symbol: "🜄︎", message: "Ground reached 4k plays", time: "1h ago", pillar: "studios" },
  { symbol: "🜁︎", message: "Vol. III entered review", time: "3h ago", pillar: "press" },
  { symbol: "🜃︎", message: "Site report uploaded", time: "6h ago", pillar: "foundation" },
  { symbol: "⊙", message: "Vetting complete", time: "1d ago", pillar: "guardian" },
] as const satisfies ReadonlyArray<{
  symbol: string;
  message: string;
  time: string;
  pillar: Exclude<ShelfId, "whole">;
}>;

type RowAccentProperties = CSSProperties & {
  "--row-accent": string;
};

function rowAccent(pillar: Exclude<ShelfId, "whole">): RowAccentProperties {
  return { "--row-accent": SHELF_ACCENTS[pillar] };
}

export function WholeShelf() {
  return (
    <section className={styles.wholeContent} data-shelf-content="whole">
      <header className={styles.wholeIdentity}>
        <span aria-hidden="true">⏺</span>
        <div>
          <h2 id="pillar-shelf-heading">Whole Body Earth</h2>
          <p>LIVE CONSTELLATION · SHARED SIGNAL</p>
        </div>
      </header>

      <div className={styles.wholeGrid}>
        <section className={styles.signalColumn} aria-labelledby="whole-upcoming-title">
          <h3 id="whole-upcoming-title">UPCOMING</h3>
          <ol className={styles.signalList}>
            {upcoming.map((item) => (
              <li key={`${item.date}-${item.title}`} style={rowAccent(item.pillar)}>
                <time>{item.date}</time>
                <i aria-hidden="true">{item.symbol}</i>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.meta}</small>
                </span>
              </li>
            ))}
          </ol>
          <Link className={styles.signalLink} href="/calendar">
            Full Calendar <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className={styles.signalColumn} aria-labelledby="whole-pulse-title">
          <h3 id="whole-pulse-title" className={styles.pulseTitle}>
            <i aria-hidden="true">⏺</i> LIVE PULSE
          </h3>
          <ol className={styles.signalList}>
            {activity.map((item) => (
              <li key={item.message} style={rowAccent(item.pillar)}>
                <i aria-hidden="true">{item.symbol}</i>
                <span>
                  <strong>{item.message}</strong>
                </span>
                <time>{item.time}</time>
              </li>
            ))}
          </ol>
          <Link className={styles.signalLink} href="/media">
            Full Activity <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </section>
  );
}

export default WholeShelf;
