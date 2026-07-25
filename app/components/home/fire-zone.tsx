"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./element-zones.module.css";
import { useZoneData } from "./use-zone-data";

type FireData = {
  summary: string;
  nearest: null | { title: string; date: string; location: string; href: string; startsAt: string };
  events: Array<{ title: string; kind: string; date: string; location: string; availability: string; image: string; href: string }>;
};

function Countdown({ startsAt }: { startsAt: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const update = () => {
      const distance = Math.max(0, new Date(startsAt).getTime() - Date.now());
      const days = Math.floor(distance / 86_400_000);
      const hours = Math.floor((distance % 86_400_000) / 3_600_000);
      setRemaining(distance > 0 ? `${days}D ${hours}H` : "GATHERING NOW");
    };
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [startsAt]);

  return <span>{remaining || "CALIBRATING"}</span>;
}

export function FireZone({ active }: { active: boolean }) {
  const { data, error } = useZoneData<FireData>("/api/presence/events");

  return (
    <article className={`${styles.zone} ${styles.fire}`} data-element-zone data-active={active} aria-labelledby="fire-zone-title">
      <div className={styles.fireGlow} aria-hidden="true" />
      <div className={styles.zoneFrame}>
        <header className={styles.zoneHeading}>
          <span className={styles.symbol} aria-hidden="true">🜂</span>
          <div><small>01 / FIRE · PRESENCE</small><h2 id="fire-zone-title">Gather around what is real.</h2></div>
        </header>

        <div className={styles.zoneBody}>
          <div className={styles.zoneLead}>
            {data ? <p className={styles.liveLine}><i />{data.summary}</p> : <div className={styles.skeleton} aria-label="Loading Presence activity" />}
            <p>Embodied practice, open fire, and gatherings built for integration—not performance.</p>
            <div className={styles.actions}>
              <Link href="/presence/events">Join Circle →</Link>
              <Link href="/presence/events/desert-fire-retreat">View Retreats →</Link>
            </div>
            {error && <small className={styles.feedError}>Presence feed is reconnecting.</small>}
          </div>

          <div className={styles.fireField}>
            <div className={styles.eventRail}>
              {data ? data.events.map((event) => (
                <Link href={event.href} className={styles.eventCard} key={event.href}>
                  <span style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(5,5,5,.94)), url(${event.image})` }} />
                  <small>{event.kind} · {event.date}</small>
                  <b>{event.title}</b>
                  <em>{event.location}</em>
                </Link>
              )) : [0, 1, 2].map((index) => <div className={`${styles.eventCard} ${styles.cardSkeleton}`} key={index} />)}
            </div>
            {data?.nearest && (
              <Link href={data.nearest.href} className={styles.revealPanel}>
                <small>NEAREST GATHERING / COUNTDOWN</small>
                <strong>{data.nearest.title}</strong>
                <span>{data.nearest.location} · <Countdown startsAt={data.nearest.startsAt} /></span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
