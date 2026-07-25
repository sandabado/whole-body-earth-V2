"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { WholeBodyFooter } from "../WholeBodyFooter";
import HeroEngine from "../HeroEngine/HeroEngine";
import HermeticCrest from "../hermetic-crest/HermeticCrest";
import { ElementZones } from "./ElementZones";

const activity = [
  { symbol: "🜂", message: "Presence Circle opened twelve seats for the August gathering.", time: "2m", tone: "presence", live: true },
  { symbol: "🜁", message: "Press moved Living Earth Vol. III into editorial review.", time: "1h", tone: "press", live: true },
  { symbol: "🜄", message: "Studios completed the latest Feed First artist payout.", time: "3h", tone: "studios", live: true },
  { symbol: "🜃", message: "Foundation added the Glory Peak site survey to the build record.", time: "6h", tone: "foundation", live: true },
  { symbol: "⊙", message: "Guardian completed a constellation coherence check.", time: "1d", tone: "guardian", live: false },
] as const;

const events = [
  { date: "Aug 03", title: "Presence Circle", meta: "Virtual · 7pm", href: "/presence/events", symbol: "🜂", tone: "presence" },
  { date: "Aug 07", title: "Ground vinyl preorder", meta: "Worldwide · Midnight", href: "/studios/catalog", symbol: "🜄", tone: "studios" },
  { date: "Aug 12", title: "Vol. III review opens", meta: "Reading room · 9am", href: "/press/events", symbol: "🜁", tone: "press" },
  { date: "Aug 19", title: "Glory Peak site survey", meta: "Morongo Valley · 8am", href: "/foundation/the-land", symbol: "🜃", tone: "foundation" },
  { date: "Aug 22", title: "Guardian consultation", meta: "Private session", href: "/guardian", symbol: "⊙", tone: "guardian" },
] as const;

const releases = [
  { title: "Living Earth Vol. 1", meta: "Digital + vinyl", href: "/studios/catalog", symbol: "🜄", tone: "studios" },
  { title: "The Living Earth Codex", meta: "Five-volume collection", href: "/press/catalog", symbol: "🜁", tone: "press" },
  { title: "Glory Peak Blueprint", meta: "Phase one release", href: "/foundation/the-build", symbol: "🜃", tone: "foundation" },
] as const;

const pillars = [
  { name: "Presence", symbol: "🜂", href: "/presence", tone: "presence" },
  { name: "Press", symbol: "🜁", href: "/press", tone: "press" },
  { name: "Studios", symbol: "🜄", href: "/studios", tone: "studios" },
  { name: "Foundation", symbol: "🜃", href: "/foundation", tone: "foundation" },
  { name: "Guardian", symbol: "⊙", href: "/guardian", tone: "guardian" },
] as const;

export function EpicHomeExperience() {
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = homeRef.current;
    if (!root) return;

    root.dataset.motionReady = "true";
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-home-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let observer: IntersectionObserver | null = null;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.dataset.visible = "true";
      });
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            (entry.target as HTMLElement).dataset.visible = "true";
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
      );
      elements.forEach((element) => observer?.observe(element));
    }

    const parallaxCleanups: Array<() => void> = [];
    if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      root.querySelectorAll<HTMLElement>(".epic-home-layer").forEach((tile) => {
        let frame = 0;
        const reset = () => {
          tile.style.setProperty("--parallax-x", "0deg");
          tile.style.setProperty("--parallax-y", "0deg");
        };
        const move = (event: PointerEvent) => {
          window.cancelAnimationFrame(frame);
          frame = window.requestAnimationFrame(() => {
            const rect = tile.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            tile.style.setProperty("--parallax-x", `${(-y * 2.4).toFixed(2)}deg`);
            tile.style.setProperty("--parallax-y", `${(x * 2.4).toFixed(2)}deg`);
          });
        };
        tile.addEventListener("pointermove", move);
        tile.addEventListener("pointerleave", reset);
        parallaxCleanups.push(() => {
          window.cancelAnimationFrame(frame);
          tile.removeEventListener("pointermove", move);
          tile.removeEventListener("pointerleave", reset);
        });
      });
    }

    return () => {
      observer?.disconnect();
      parallaxCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div ref={homeRef} className="epic-home">
      <main>
        <HeroEngine autoRotate siteSlug="studios" ariaLabel="Whole Body — five elements moving as one living system">
          <div className="epic-home-vignette" aria-hidden="true" />
          <div className="epic-home-hero-copy">
            <div className="epic-home-hero-content">
              <h1 id="epic-home-title">WHOLE BODY</h1>
              <p>Five elements. One body. Living now.</p>
              <Link href="#reading">Take the Reading <span aria-hidden="true">→</span></Link>
            </div>
            <HermeticCrest className="epic-home-key" size={720} />
          </div>
        </HeroEngine>

        <ElementZones />

        <section className="epic-home-section epic-home-activity" data-divider="✦" aria-labelledby="activity-title">
          <div className="epic-home-inner" data-home-reveal>
            <header className="epic-home-section-heading">
              <div>
                <span className="epic-home-live"><i /> System active</span>
                <h2 id="activity-title">What&apos;s happening in the constellation</h2>
              </div>
              <Link href="/media">View all activity <span aria-hidden="true">→</span></Link>
            </header>
            <div className="epic-home-feed">
              {activity.map((item) => (
                <div key={item.message}>
                  <i className="wb-glyph" data-pillar={item.tone} aria-hidden="true">{item.symbol}</i>
                  <p>{item.message}</p>
                  <span className="epic-home-feed-status" aria-label={item.live ? "Live update" : "Awaiting refresh"}>
                    <i data-status={item.live ? "live" : "delayed"} aria-hidden="true" />
                    <time>{item.time}</time>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="epic-home-section epic-home-layers" data-divider="⊙" aria-labelledby="layers-title">
          <div className="epic-home-inner" data-home-reveal>
            <h2 id="layers-title" className="epic-home-sr-only">Shared layers</h2>
            <div className="epic-home-layer-grid">
              <article className="epic-home-layer">
                <header><span>Calendar</span><small>Next 5 events</small></header>
                <div className="epic-home-event-list">
                  {events.map((event) => (
                    <Link key={`${event.date}-${event.title}`} href={event.href}>
                      <time>{event.date}</time>
                      <i className="wb-glyph" data-pillar={event.tone} aria-hidden="true">{event.symbol}</i>
                      <span><b>{event.title}</b><small>{event.meta}</small></span>
                      <em aria-hidden="true">↗</em>
                    </Link>
                  ))}
                </div>
                <Link className="epic-home-layer-action" href="/calendar">View Full Calendar →</Link>
              </article>

              <article className="epic-home-layer">
                <header><span>Store</span><small>New releases</small></header>
                <div className="epic-home-release-list">
                  {releases.map((release) => (
                    <Link key={release.title} href={release.href}>
                      <i className="wb-glyph" data-pillar={release.tone} aria-hidden="true">{release.symbol}</i>
                      <span><b>{release.title}</b><small>{release.meta}</small></span>
                      <em aria-hidden="true">↗</em>
                    </Link>
                  ))}
                </div>
                <Link className="epic-home-layer-action" href="/store">Shop All →</Link>
              </article>
            </div>
          </div>
        </section>

        <section id="reading" className="epic-home-section epic-home-reading" data-divider="◇" aria-labelledby="reading-title">
          <div className="epic-home-reading-inner" data-home-reveal>
            <span className="epic-home-reading-mark" aria-hidden="true">⊙</span>
            <h2 id="reading-title">Which House Are You?</h2>
            <p>60 seconds. No email required.</p>
            <Link href="/apply?path=reading">Get Your Whole Body Design Reading →</Link>
          </div>
        </section>

        <nav className="epic-home-section epic-home-pillar-nav" data-divider="·" aria-label="Explore the five pillars">
          <div className="epic-home-pillar-row" data-home-reveal>
            {pillars.map((pillar) => (
              <Link key={pillar.name} href={pillar.href} data-pillar={pillar.tone} aria-label={pillar.name}>
                <i className="wb-glyph" aria-hidden="true">{pillar.symbol}</i>
                <span>{pillar.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </main>
      <WholeBodyFooter />
    </div>
  );
}
