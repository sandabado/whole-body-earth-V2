"use client";

import Link from "next/link";
import FloatingQuincunxDome from "../../foundation/components/models/FloatingQuincunxDome";
import styles from "./element-zones.module.css";
import { useZoneData } from "./use-zone-data";

type EarthData = {
  summary: string;
  location: string;
  phase: string;
  phases: Array<{ index: string; title: string; status: string; href: string }>;
};

export function EarthZone({ active }: { active: boolean }) {
  const { data, error } = useZoneData<EarthData>("/api/foundation/status");

  return (
    <article className={`${styles.zone} ${styles.earth}`} data-element-zone data-active={active} aria-labelledby="earth-zone-title">
      <div className={styles.blueprintLines} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.zoneFrame}>
        <header className={styles.zoneHeading}>
          <span className={styles.symbol} aria-hidden="true">🜃</span>
          <div><small>04 / EARTH · FOUNDATION</small><h2 id="earth-zone-title">Build what can hold a body.</h2></div>
        </header>
        <div className={styles.zoneBody}>
          <div className={styles.zoneLead}>
            {data ? <p className={styles.liveLine}><i />{data.summary}</p> : <div className={styles.skeleton} aria-label="Loading Foundation activity" />}
            <p>Land, water, shelter, and gathering infrastructure designed in a sequence the ground can support.</p>
            <div className={styles.actions}>
              <Link href="/foundation/the-build">View Blueprint →</Link>
              <Link href="/foundation/apply">Join Waitlist →</Link>
            </div>
            {error && <small className={styles.feedError}>Foundation feed is reconnecting.</small>}
          </div>
          <div className={styles.earthField}>
            <div className={styles.phaseList}>
              {data ? data.phases.map((phase) => <Link href={phase.href} key={phase.index}><small>{phase.index}</small><b>{phase.title}</b><span>{phase.status}</span></Link>) : <div className={styles.skeleton} />}
            </div>
            <div className={styles.earthDome}>{active && <FloatingQuincunxDome compact height="100%" />}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
