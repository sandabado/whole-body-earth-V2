"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState, type CSSProperties } from "react";
import styles from "./HomeContinuum.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    id: "presence",
    name: "Presence",
    symbol: "🜂",
    element: "Fire",
    geometry: "Tetrahedron",
    faces: "4 faces",
    color: "#FF6B35",
    href: "/presence",
    title: "The shape of ignition.",
    copy: ["Weekly gatherings. Monthly retreats. Rites of passage.", "No hierarchy. No guru. Just belonging."],
    stats: [["Next gather", "Aug 3 · 7pm", "Virtual"], ["Members", "12 active", "4 mentors"], ["This month", "3 events", "1 retreat"]],
    status: "12 members gathering · 3 events this month",
  },
  {
    id: "press",
    name: "Press",
    symbol: "🜁",
    element: "Air",
    geometry: "Octahedron",
    faces: "8 faces",
    color: "#A8D8EA",
    href: "/press",
    title: "The shape that expands.",
    copy: ["Words carried outward. Manuscripts shaped. The Living Earth Codex.", "Knowledge that breathes."],
    stats: [["Latest", "Vol. III", "In review"], ["Library", "5 volumes", "2 free chapters"], ["Pipeline", "2 manuscripts", "4 essays queued"]],
    status: "4 publications live · 2 manuscripts in review",
  },
  {
    id: "studios",
    name: "Studios",
    symbol: "🜄",
    element: "Water",
    geometry: "Icosahedron",
    faces: "20 faces",
    color: "#2E86AB",
    href: "/studios",
    title: "The shape that remembers.",
    copy: ["Music is infrastructure. The artist eats first.", "Twelve tracks. Twelve Houses. Each tuned to a room in the dodecahedron."],
    stats: [["Now streaming", "Ground · Track 01", "4,210 plays"], ["Artist payouts", "$2,340 this quarter", "Feed First enforced"], ["Catalog", "24 tracks", "2 albums · 1 vinyl"]],
    status: "24 tracks streaming · $2,340 in artist payouts",
  },
  {
    id: "foundation",
    name: "Foundation",
    symbol: "🜃",
    element: "Earth",
    geometry: "Hexahedron",
    faces: "6 faces",
    color: "#C18C2B",
    href: "/foundation",
    title: "The shape that endures.",
    copy: ["Rammed earth. Off-grid. Carbon negative.", "Sacred geometry as structural engineering."],
    stats: [["Glory Peak", "Phase 1", "3 structures planned"], ["Location", "Morongo Valley", "California"], ["Timeline", "Quincunx dome", "Weeks 5–8"]],
    status: "Glory Peak Phase 1 · 3 structures planned",
  },
  {
    id: "guardian",
    name: "Guardian",
    symbol: "⊙",
    element: "Ether",
    geometry: "Dodecahedron",
    faces: "12 faces",
    color: "#6D4AFF",
    href: "/guardian",
    title: "The shape that holds.",
    copy: ["Sovereign systems. Trust architecture. Asset protection.", "For creators with something real to protect."],
    stats: [["Access", "Referral only", "Private by design"], ["Engagements", "Active", "Details protected"], ["Services", "Trust architecture", "Succession · IP shielding"]],
    status: "Sovereign engagements active · vettings in progress",
  },
] as const;

type PillarId = (typeof pillars)[number]["id"];
type CalendarFilter = "all" | PillarId;
type CalendarMode = "month" | "week" | "flow";

const events: Array<{ day: number; pillar: PillarId; date: string; title: string; meta: string }> = [
  { day: 3, pillar: "presence", date: "Aug 03", title: "Presence Circle — The Tetrahedron Test", meta: "Virtual · 7pm" },
  { day: 7, pillar: "studios", date: "Aug 07", title: "Studios Drop — Ground vinyl preorders", meta: "Worldwide · Midnight" },
  { day: 12, pillar: "press", date: "Aug 12", title: "Vol. III manuscript review opens", meta: "Reading room · 9am" },
  { day: 19, pillar: "foundation", date: "Aug 19", title: "Glory Peak site survey", meta: "Morongo Valley · 8am" },
  { day: 22, pillar: "guardian", date: "Aug 22", title: "Guardian consultation", meta: "Private session" },
  { day: 26, pillar: "presence", date: "Aug 26", title: "Quarterly retreat registration closes", meta: "Presence · 6pm" },
];

const pulse = [
  ["presence", "Maya joined Presence Circle", "2m ago"],
  ["studios", "Ground crossed 4,000 streams", "1h ago"],
  ["press", "Vol. III received its second review", "3h ago"],
  ["foundation", "Glory Peak surveyor report uploaded", "6h ago"],
  ["guardian", "Guardian vetting completed — partner accepted", "1d ago"],
  ["presence", "Weekly Circle concluded: 9 attended", "1d ago"],
  ["studios", "Artist payout processed: $420", "2d ago"],
  ["press", "New essay published: The Living Spiral", "3d ago"],
] as const satisfies ReadonlyArray<readonly [PillarId, string, string]>;

const storeItems = [
  { pillar: "studios", eyebrow: "Living Earth", title: "Vol. 1", lines: ["Digital · $25", "Vinyl · $150"], href: "/catalog" },
  { pillar: "press", eyebrow: "The Codex", title: "Five Volumes", lines: ["Bundle · $111", "Physical · $333"], href: "/press/catalog" },
  { pillar: "foundation", eyebrow: "Glory Peak", title: "Blueprint", lines: ["Waitlist · No cost", "Phase 1 release"], href: "/foundation/the-build" },
] as const satisfies ReadonlyArray<{ pillar: PillarId; eyebrow: string; title: string; lines: readonly string[]; href: string }>;

const roles = [
  ["presence", "Circle Keeper", "Remote", "Stipend"],
  ["studios", "Mix Engineer", "LA preferred", "Per project"],
  ["press", "Editorial Reader", "Remote", "Per manuscript"],
  ["foundation", "Site Surveyor", "Morongo Valley", "Contract"],
  ["guardian", "Trust Associate", "Referral only", "Private"],
] as const satisfies ReadonlyArray<readonly [PillarId, string, string, string]>;

const reveal = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.85, ease: EASE },
};

function getPillar(id: PillarId) {
  return pillars.find((pillar) => pillar.id === id) ?? pillars[0];
}

export function HomeContinuum() {
  const [activePillar, setActivePillar] = useState<PillarId>("guardian");
  const [calendarFilter, setCalendarFilter] = useState<CalendarFilter>("all");
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  const visibleEvents = useMemo(
    () => events.filter((event) => calendarFilter === "all" || event.pillar === calendarFilter),
    [calendarFilter],
  );

  return (
    <div className={styles.continuum}>
      <section id="system" className={styles.geometrySection} aria-labelledby="geometry-title">
        <motion.header {...reveal} className={styles.sectionHeader}>
          <p>01 · The constellation</p>
          <h2 id="geometry-title">Feel the shape.</h2>
          <span>Live coherence across five dimensions. Every point is a door.</span>
        </motion.header>
        <div className={styles.geometryLayout}>
          <motion.div {...reveal} className={styles.geometryMap} onPointerLeave={() => setActivePillar("guardian")}>
            {Array.from({ length: 10 }, (_, index) => <i key={index} className={`${styles.geometryEdge} ${styles[`geometryEdge${index + 1}`]}`} aria-hidden="true" />)}
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className={`${styles.geometryNode} ${styles[pillar.id]}`}
                style={{ "--wb-accent": pillar.color } as CSSProperties}
                onPointerEnter={() => setActivePillar(pillar.id)}
                onFocus={() => setActivePillar(pillar.id)}
                aria-label={`${pillar.name}: ${pillar.status}`}
              >
                <i className="wb-glyph" aria-hidden="true">{pillar.symbol}</i>
                <span>{pillar.name}</span>
              </Link>
            ))}
            <div className={styles.geometryCore} aria-hidden="true">✦</div>
          </motion.div>
          <motion.div {...reveal} className={styles.livePanel}>
            <div className={styles.liveHead}><span><i /> Coherence signal</span><b>ACTIVE</b></div>
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className={activePillar === pillar.id ? styles.activeStatus : ""}
                style={{ "--wb-accent": pillar.color } as CSSProperties}
                onPointerEnter={() => setActivePillar(pillar.id)}
                onFocus={() => setActivePillar(pillar.id)}
              >
                <i className="wb-glyph" aria-hidden="true">{pillar.symbol}</i>
                <span><b>{pillar.name}</b><small>{pillar.status}</small></span>
                <em>↗</em>
              </Link>
            ))}
            <p>Prototype signal layer · representative operating data</p>
          </motion.div>
        </div>
      </section>

      <motion.section {...reveal} className={styles.readingCall} aria-labelledby="reading-title">
        <i className="wb-glyph" aria-hidden="true">✦</i>
        <div>
          <p>02 · Your coordinates</p>
          <h2 id="reading-title">Not sure where you belong?</h2>
          <span>The Whole Body Reading maps your elemental resonance to the constellation&apos;s geometry.</span>
          <small>90 seconds · No cost · Early access</small>
        </div>
        <Link href="/apply?path=reading">Request your reading →</Link>
      </motion.section>

      <div className={styles.pillarChapters}>
        {pillars.map((pillar, index) => (
          <motion.section
            key={pillar.id}
            {...reveal}
            className={styles.pillarSection}
            style={{ "--wb-accent": pillar.color } as CSSProperties}
            aria-labelledby={`pillar-${pillar.id}`}
          >
            <div className={styles.pillarInner}>
              <i className={`${styles.pillarGlyph} wb-glyph`} aria-hidden="true">{pillar.symbol}</i>
              <p className={styles.chapterIndex}>{String(index + 3).padStart(2, "0")} · {pillar.element} / {pillar.geometry}</p>
              <h2 id={`pillar-${pillar.id}`}>{pillar.name}</h2>
              <p className={styles.pillarGeometry}>{pillar.element} · {pillar.geometry} · {pillar.faces}</p>
              <h3>{pillar.title}</h3>
              <div className={styles.pillarCopy}>{pillar.copy.map((line) => <p key={line}>{line}</p>)}</div>
              <dl className={styles.pillarStats}>
                {pillar.stats.map(([label, value, note]) => <div key={label}><dt>{label}</dt><dd>{value}</dd><small>{note}</small></div>)}
              </dl>
              <Link className={styles.pillarLink} href={pillar.href}>Enter {pillar.name} →</Link>
            </div>
            <div className={styles.alchemicalDivider} aria-hidden="true"><span>{pillar.symbol}</span></div>
          </motion.section>
        ))}
      </div>

      <section className={styles.calendarSection} aria-labelledby="calendar-title">
        <motion.header {...reveal} className={styles.sectionHeader}>
          <p>08 · The living calendar</p>
          <h2 id="calendar-title">What&apos;s happening across the whole body.</h2>
          <span>Filter the shared rhythm by element or change how time is held.</span>
        </motion.header>
        <motion.div {...reveal} className={styles.calendarControls}>
          <div className={styles.filters} aria-label="Filter calendar by pillar">
            <button type="button" aria-pressed={calendarFilter === "all"} onClick={() => setCalendarFilter("all")}>All</button>
            {pillars.map((pillar) => <button key={pillar.id} type="button" aria-label={pillar.name} aria-pressed={calendarFilter === pillar.id} style={{ "--wb-accent": pillar.color } as CSSProperties} onClick={() => setCalendarFilter(pillar.id)}><i className="wb-glyph">{pillar.symbol}</i></button>)}
          </div>
          <div className={styles.viewModes} aria-label="Calendar view">
            {(["month", "week", "flow"] as const).map((mode) => <button key={mode} type="button" aria-pressed={calendarMode === mode} onClick={() => setCalendarMode(mode)}>{mode}</button>)}
          </div>
        </motion.div>
        <div className={`${styles.calendarBody} ${styles[calendarMode]}`}>
          {calendarMode !== "flow" && <div className={styles.monthGrid}>
            {["S","M","T","W","T","F","S"].map((day, index) => <b key={`${day}-${index}`}>{day}</b>)}
            {Array.from({ length: 6 }, (_, index) => <span key={`empty-${index}`} />)}
            {Array.from({ length: calendarMode === "week" ? 7 : 31 }, (_, index) => {
              const day = index + 1;
              const marker = visibleEvents.find((event) => event.day === day);
              return <span key={day} className={marker ? styles.eventDay : ""}><small>{day}</small>{marker && <i className="wb-glyph" style={{ "--wb-accent": getPillar(marker.pillar).color } as CSSProperties} title={marker.title}>{getPillar(marker.pillar).symbol}</i>}</span>;
            })}
          </div>}
          <div className={styles.upcoming}>
            <p>Upcoming · {visibleEvents.length} signals</p>
            {visibleEvents.map((event) => {
              const pillar = getPillar(event.pillar);
              return <Link href={pillar.href} key={`${event.date}-${event.title}`} style={{ "--wb-accent": pillar.color } as CSSProperties}><time>{event.date}</time><i className="wb-glyph">{pillar.symbol}</i><span><b>{event.title}</b><small>{event.meta}</small></span><em>↗</em></Link>;
            })}
          </div>
        </div>
      </section>

      <section className={styles.pulseSection} aria-labelledby="pulse-title">
        <motion.header {...reveal} className={styles.sectionHeader}>
          <p>09 · The pulse</p>
          <h2 id="pulse-title">Who&apos;s alive right now.</h2>
          <span>Representative activity from across the constellation. Private Guardian details remain private.</span>
        </motion.header>
        <motion.div {...reveal} className={styles.pulseFeed}>
          <div className={styles.pulseHead}><span><i /> Signal stream</span><b>PROTOTYPE</b></div>
          {pulse.map(([pillarId, message, time], index) => {
            const pillar = getPillar(pillarId);
            return <div key={`${message}-${time}`} style={{ "--wb-accent": pillar.color, opacity: 1 - index * .07 } as CSSProperties}><i className="wb-glyph">{pillar.symbol}</i><span>{message}</span><time>{time}</time></div>;
          })}
        </motion.div>
      </section>

      <section className={styles.storeSection} aria-labelledby="store-title">
        <motion.header {...reveal} className={styles.sectionHeader}>
          <p>10 · The store</p>
          <h2 id="store-title">Commerce across the constellation.</h2>
          <span>Artifacts, texts, music, and plans—each routed back to the body that made them.</span>
        </motion.header>
        <div className={styles.storeGrid}>
          {storeItems.map((item, index) => {
            const pillar = getPillar(item.pillar);
            return <motion.article key={item.title} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.65,delay:index*.08,ease:EASE}} style={{ "--wb-accent": pillar.color } as CSSProperties}><Link href={item.href}><i className="wb-glyph">{pillar.symbol}</i><p>{item.eyebrow}</p><h3>{item.title}</h3>{item.lines.map((line) => <span key={line}>{line}</span>)}<b>Explore →</b></Link></motion.article>;
          })}
        </div>
        <Link href="/catalog" className={styles.sectionLink}>Enter the store →</Link>
      </section>

      <section className={styles.guildSection} aria-labelledby="guild-title">
        <motion.header {...reveal} className={styles.sectionHeader}>
          <p>11 · The guild</p>
          <h2 id="guild-title">Find your seat in the constellation.</h2>
          <span>Open roles connect practical work to the element that needs it.</span>
        </motion.header>
        <motion.div {...reveal} className={styles.roleList}>
          <p>Open roles</p>
          {roles.map(([pillarId, role, location, basis]) => {
            const pillar = getPillar(pillarId);
            return <Link key={role} href={`/apply?role=${encodeURIComponent(role)}`} style={{ "--wb-accent": pillar.color } as CSSProperties}><i className="wb-glyph">{pillar.symbol}</i><b>{role}</b><span>{pillar.name}</span><em>{location}</em><small>{basis}</small><strong>↗</strong></Link>;
          })}
        </motion.div>
        <div className={styles.guildActions}><Link href="/apply">View Guild Network →</Link><Link href="/apply">Submit Application →</Link></div>
      </section>
    </div>
  );
}
