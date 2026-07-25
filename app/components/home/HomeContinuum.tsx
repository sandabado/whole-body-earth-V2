"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./HomeContinuum.module.css";

const activity = [
  { symbol: "🜂", message: "Presence Circle opened twelve seats for the August gathering.", time: "2m" },
  { symbol: "🜁", message: "Press moved Living Earth Vol. III into editorial review.", time: "1h" },
  { symbol: "🜄", message: "Studios completed the latest Feed First artist payout.", time: "3h" },
  { symbol: "🜃", message: "Foundation added the Glory Peak site survey to the build record.", time: "6h" },
  { symbol: "⊙", message: "Guardian completed a constellation coherence check.", time: "1d" },
] as const;

const events = [
  { date: "Aug 03", title: "Presence Circle", meta: "Virtual · 7pm", href: "/presence/events", symbol: "🜂" },
  { date: "Aug 07", title: "Ground vinyl preorder", meta: "Worldwide · Midnight", href: "/studios/catalog", symbol: "🜄" },
  { date: "Aug 12", title: "Vol. III review opens", meta: "Reading room · 9am", href: "/press/events", symbol: "🜁" },
  { date: "Aug 19", title: "Glory Peak site survey", meta: "Morongo Valley · 8am", href: "/foundation/the-land", symbol: "🜃" },
  { date: "Aug 22", title: "Guardian consultation", meta: "Private session", href: "/guardian", symbol: "⊙" },
] as const;

const releases = [
  { title: "Living Earth Vol. 1", meta: "Digital + vinyl", href: "/studios/catalog", symbol: "🜄" },
  { title: "The Living Earth Codex", meta: "Five-volume collection", href: "/press/catalog", symbol: "🜁" },
  { title: "Glory Peak Blueprint", meta: "Phase one release", href: "/foundation/the-build", symbol: "🜃" },
] as const;

const pillars = [
  { name: "Presence", symbol: "🜂", href: "/presence" },
  { name: "Press", symbol: "🜁", href: "/press" },
  { name: "Studios", symbol: "🜄", href: "/studios" },
  { name: "Foundation", symbol: "🜃", href: "/foundation" },
  { name: "Guardian", symbol: "⊙", href: "/guardian" },
] as const;

export function HomeContinuum() {
  const continuumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = continuumRef.current;
    if (!root) return;

    root.dataset.motionReady = "true";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-home-reveal]"));

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.dataset.visible = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={continuumRef} className={styles.continuum}>
      <section
        className={`${styles.section} ${styles.activitySection}`}
        data-divider="✦"
        aria-labelledby="activity-title"
      >
        <div className={styles.sectionInner} data-home-reveal>
          <header className={styles.sectionHeading}>
            <div>
              <span className={styles.livePulse}><i /> System active</span>
              <h2 id="activity-title">What&apos;s happening in the constellation</h2>
            </div>
            <Link href="/media">View all activity <span aria-hidden="true">→</span></Link>
          </header>

          <div className={styles.activityFeed}>
            {activity.map((item) => (
              <div key={item.message}>
                <i className="wb-glyph" aria-hidden="true">{item.symbol}</i>
                <p>{item.message}</p>
                <time>{item.time}</time>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.layersSection}`}
        data-divider="⊙"
        aria-labelledby="layers-title"
      >
        <div className={styles.sectionInner} data-home-reveal>
          <h2 id="layers-title" className={styles.srOnly}>Shared layers</h2>
          <div className={styles.layerGrid}>
            <article className={styles.layerTile}>
              <header>
                <span>Calendar</span>
                <small>Next 5 events</small>
              </header>
              <div className={styles.eventList}>
                {events.map((event) => (
                  <Link key={`${event.date}-${event.title}`} href={event.href}>
                    <time>{event.date}</time>
                    <i className="wb-glyph" aria-hidden="true">{event.symbol}</i>
                    <span><b>{event.title}</b><small>{event.meta}</small></span>
                    <em aria-hidden="true">↗</em>
                  </Link>
                ))}
              </div>
              <Link className={styles.layerAction} href="/calendar">View Full Calendar →</Link>
            </article>

            <article className={styles.layerTile}>
              <header>
                <span>Store</span>
                <small>New releases</small>
              </header>
              <div className={styles.releaseList}>
                {releases.map((release) => (
                  <Link key={release.title} href={release.href}>
                    <i className="wb-glyph" aria-hidden="true">{release.symbol}</i>
                    <span><b>{release.title}</b><small>{release.meta}</small></span>
                    <em aria-hidden="true">↗</em>
                  </Link>
                ))}
              </div>
              <Link className={styles.layerAction} href="/store">Shop All →</Link>
            </article>
          </div>
        </div>
      </section>

      <section
        id="reading"
        className={`${styles.section} ${styles.readingSection}`}
        data-divider="◇"
        aria-labelledby="reading-title"
      >
        <div className={styles.readingInner} data-home-reveal>
          <span className={styles.readingMark} aria-hidden="true">⊙</span>
          <h2 id="reading-title">Which House Are You?</h2>
          <p>60 seconds. No email required.</p>
          <Link href="/apply?path=reading">Get Your Whole Body Design Reading →</Link>
        </div>
      </section>

      <nav
        className={`${styles.section} ${styles.pillarNav}`}
        data-divider="·"
        aria-label="Explore the five pillars"
      >
        <div className={styles.pillarRow} data-home-reveal>
          {pillars.map((pillar) => (
            <Link key={pillar.name} href={pillar.href}>
              <i className="wb-glyph" aria-hidden="true">{pillar.symbol}</i>
              <span>{pillar.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
