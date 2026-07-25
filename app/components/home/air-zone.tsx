"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./element-zones.module.css";
import { useZoneData } from "./use-zone-data";

type AirData = {
  summary: string;
  volumes: Array<{ title: string; subtitle?: string; glyph: string; folio: string; tone: string; status: string; href: string }>;
};

export function AirZone({ active }: { active: boolean }) {
  const { data, error } = useZoneData<AirData>("/api/press/status");

  return (
    <article className={`${styles.zone} ${styles.air}`} data-element-zone data-active={active} aria-labelledby="air-zone-title">
      <div className={styles.floatingPages} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.zoneFrame}>
        <header className={styles.zoneHeading}>
          <span className={styles.symbol} aria-hidden="true">🜁</span>
          <div><small>02 / AIR · PRESS</small><h2 id="air-zone-title">Ideas given durable form.</h2></div>
        </header>
        <div className={styles.zoneBody}>
          <div className={styles.zoneLead}>
            {data ? <p className={styles.liveLine}><i />{data.summary}</p> : <div className={styles.skeleton} aria-label="Loading Press activity" />}
            <p>Books, field notes, and working knowledge made to be carried, marked, and shared.</p>
            <div className={styles.actions}>
              <Link href="/press/catalog">Browse Codex →</Link>
              <Link href="/press/submit">Submit Manuscript →</Link>
            </div>
            {error && <small className={styles.feedError}>Press feed is reconnecting.</small>}
          </div>
          <div className={styles.coverDeck}>
            {data ? data.volumes.map((volume, index) => (
              <Link className={styles.coverFlip} href={volume.href} key={volume.href} style={{ "--cover-index": index } as CSSProperties}>
                <span className={styles.coverFront}><small>{volume.folio}</small><b>{volume.glyph}</b><strong>{volume.title}</strong></span>
                <span className={styles.coverBack}><small>{volume.status}</small><strong>{volume.title}</strong><em>{volume.subtitle}</em><i>OPEN VOLUME ↗</i></span>
              </Link>
            )) : [0, 1, 2].map((index) => <div className={`${styles.coverFlip} ${styles.cardSkeleton}`} key={index} />)}
          </div>
        </div>
      </div>
    </article>
  );
}
