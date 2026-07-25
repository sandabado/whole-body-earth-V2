"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./element-zones.module.css";
import { useZoneData } from "./use-zone-data";

type EtherData = { summary: string; activeConsultations: number; signals: string[]; status: string };

export function EtherZone({ active }: { active: boolean }) {
  const { data, error } = useZoneData<EtherData>("/api/guardian/status");

  return (
    <article className={`${styles.zone} ${styles.ether}`} data-element-zone data-active={active} aria-labelledby="ether-zone-title">
      <div className={styles.constellation} aria-hidden="true" />
      <div className={styles.zoneFrame}>
        <header className={styles.zoneHeading}>
          <span className={styles.symbol} aria-hidden="true">⊙</span>
          <div><small>05 / ETHER · GUARDIAN</small><h2 id="ether-zone-title">Trust is architecture.</h2></div>
        </header>
        <div className={styles.zoneBody}>
          <div className={styles.zoneLead}>
            {data ? <p className={styles.liveLine}><i />{data.summary}</p> : <div className={styles.skeleton} aria-label="Loading Guardian activity" />}
            <p>Private counsel and agreement design for people building relationships meant to outlast urgency.</p>
            <div className={styles.actions}>
              <Link href="/guardian">Learn About Guardian →</Link>
              <Link href="/apply?path=guardian">Waitlist →</Link>
            </div>
            {error && <small className={styles.feedError}>Guardian feed is reconnecting.</small>}
          </div>
          <div className={styles.trustField} aria-label="An anonymized trust architecture diagram">
            <span className={styles.trustCenter}>⊙</span>
            {["01", "02", "03", "04", "05"].map((node, index) => <i key={node} style={{ "--node-index": index } as CSSProperties}>{node}</i>)}
            <div>{data?.signals.map((signal) => <small key={signal}>{signal}</small>)}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
