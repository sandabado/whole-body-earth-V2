"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import HeroEngine from "../HeroEngine/HeroEngine";
import styles from "./element-zones.module.css";
import { useZoneData } from "./use-zone-data";

type WaterData = {
  summary: string;
  release: { title: string; artist: string; date: string; status: string; href: string };
  streamUrl: string;
};

export function WaterZone({ active }: { active: boolean }) {
  const { data, error } = useZoneData<WaterData>("/api/studios/releases");

  return (
    <article className={`${styles.zone} ${styles.water}`} data-element-zone data-active={active} aria-labelledby="water-zone-title">
      <div className={styles.waterCanvas} aria-hidden="true">
        {active && <HeroEngine autoRotate siteSlug="studios" ariaLabel="Living water field"><span /></HeroEngine>}
      </div>
      <div className={styles.zoneFrame}>
        <header className={styles.zoneHeading}>
          <span className={styles.symbol} aria-hidden="true">🜄</span>
          <div><small>03 / WATER · STUDIOS</small><h2 id="water-zone-title">The signal stays with the artist.</h2></div>
        </header>
        <div className={styles.zoneBody}>
          <div className={styles.zoneLead}>
            {data ? <p className={styles.liveLine}><i />{data.summary}</p> : <div className={styles.skeleton} aria-label="Loading Studios activity" />}
            <p>Records, films, and campaigns finished inside an artist-owned production system.</p>
            <div className={styles.actions}>
              {data ? <a href={data.streamUrl} target="_blank" rel="noreferrer">Listen ↗</a> : <Link href="/studios/catalog">Listen →</Link>}
              <Link href="/media">Watch →</Link>
              <Link href="/studios/catalog">Preorder Vinyl →</Link>
            </div>
            {error && <small className={styles.feedError}>Studios feed is reconnecting.</small>}
          </div>
          <div className={styles.waveStage}>
            <div className={styles.waveform} aria-hidden="true">
              {Array.from({ length: 32 }, (_, index) => <i key={index} style={{ "--wave-index": index } as CSSProperties} />)}
            </div>
            {data ? <Link href={data.release.href} className={styles.releasePlate}>
              <small>WBS-001 / ACTIVE TRANSMISSION</small>
              <strong>{data.release.title}</strong>
              <span>{data.release.artist} · {data.release.date}</span>
            </Link> : <div className={`${styles.releasePlate} ${styles.cardSkeleton}`} />}
          </div>
        </div>
      </div>
    </article>
  );
}
