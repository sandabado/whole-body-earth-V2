"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PlatonicEdges } from "@/components/backgrounds/PlatonicEdges";
import { PILLARS, PILLAR_IDS, pillarForPath, type PillarId } from "@/lib/pillars";
import { DEFAULT_PILLAR_ACTIVITIES, getPillarActivities, type PillarActivity } from "@/lib/pillar-activities";
import { getUpcomingEvents, type UpcomingEvent } from "@/lib/upcoming-events";

function eventPillar(value: string): PillarId | null {
  return (PILLAR_IDS as readonly string[]).includes(value) ? value as PillarId : null;
}

const HOME_PILLAR_SECTIONS: Array<{ id: string; pillar: PillarId }> = [
  { id: "presence", pillar: "presence" },
  { id: "press", pillar: "press" },
  { id: "studios", pillar: "studios" },
  { id: "foundation", pillar: "foundation" },
  { id: "guardian", pillar: "guardian" },
];

type LiveSolidName = "tetrahedron" | "octahedron" | "icosahedron" | "cube" | "dodecahedron";

const PILLAR_LIVE_SOLIDS: Record<PillarId, LiveSolidName> = {
  presence: "tetrahedron",
  press: "octahedron",
  studios: "icosahedron",
  foundation: "cube",
  guardian: "dodecahedron",
};

const EARTH_RAINBOW = "linear-gradient(105deg, #ff6b6b 0%, #f6c453 19%, #7edc84 39%, #51c7e8 58%, #8f5bff 78%, #ff78c4 100%)";

function liveSolidGeometry(name: LiveSolidName) {
  if (name === "tetrahedron") return new THREE.TetrahedronGeometry(0.94, 0);
  if (name === "octahedron") return new THREE.OctahedronGeometry(0.9, 0);
  if (name === "icosahedron") return new THREE.IcosahedronGeometry(0.82, 0);
  if (name === "cube") return new THREE.BoxGeometry(1.2, 1.2, 1.2, 1, 1, 1);
  return new THREE.DodecahedronGeometry(0.86, 0);
}

function LiveSolid({ color, solid }: { color: string; solid: LiveSolidName }) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => liveSolidGeometry(solid), [solid]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.42;
    ref.current.rotation.y += delta * 0.68;
  });

  return <mesh ref={ref} geometry={geometry} rotation={[0.25, 0.35, 0]}>
    <meshBasicMaterial color={color} depthWrite={false} opacity={0.36} transparent />
    <PlatonicEdges geometry={geometry} color="#050505" opacity={0.94} renderOrder={2} />
  </mesh>;
}

function LiveSignal({ color, solid }: { color: string; solid: LiveSolidName }) {
  return <span aria-hidden="true" className="live-signal"><Canvas camera={{ position: [0, 0, 3.25], fov: 42 }} dpr={[1, 1.25]}><LiveSolid color={color} solid={solid} /></Canvas></span>;
}

export function EventDrawer() {
  const pathname = usePathname();
  const isReadingExperience =
    pathname === "/reading" ||
    pathname.startsWith("/reading/") ||
    pathname === "/results" ||
    pathname.startsWith("/results/");
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [activities, setActivities] = useState<PillarActivity[]>(DEFAULT_PILLAR_ACTIVITIES);
  const [homePillar, setHomePillar] = useState<PillarId | null>(null);
  const [homeShelfReady, setHomeShelfReady] = useState(false);
  const pathPillar = pillarForPath(pathname);
  const [pillarShelfReadyPath, setPillarShelfReadyPath] = useState<string | null>(null);
  const isPillarLanding =
    pathPillar !== null && pathname === PILLARS[pathPillar].href;
  const activePillar = pathname === "/" ? homePillar : pathPillar;
  const isHomeHero = pathname === "/" && activePillar === null;
  const accent = activePillar ? PILLARS[activePillar].color : "#ff78c4";
  const activeSolid = activePillar ? PILLAR_LIVE_SOLIDS[activePillar] : "dodecahedron";
  const activeLabel = activePillar ? PILLARS[activePillar].name : "Live now";
  const triggerStyle = isHomeHero
    ? { background: EARTH_RAINBOW, borderColor: "#f5f3f0", boxShadow: "0 -12px 38px rgba(126, 220, 132, 0.3)" }
    : { backgroundColor: accent, borderColor: accent, boxShadow: `0 -12px 38px ${accent}54` };

  useEffect(() => {
    if (pathname !== "/") return;

    const updateActivePillar = () => {
      const focusLine = window.scrollY + window.innerHeight / 2;
      const nextSection = document.getElementById("five-bodies");
      const hasReachedNextSection = Boolean(nextSection && nextSection.getBoundingClientRect().top <= window.innerHeight * 0.72);
      const nextPillar = HOME_PILLAR_SECTIONS.find(({ id }) => {
        const section = document.getElementById(id);
        return section ? focusLine >= section.offsetTop && focusLine < section.offsetTop + section.offsetHeight : false;
      })?.pillar ?? null;
      setHomePillar((current) => current === nextPillar ? current : nextPillar);
      setHomeShelfReady((current) => current === hasReachedNextSection ? current : hasReachedNextSection);
      if (!hasReachedNextSection) setOpen(false);
    };

    updateActivePillar();
    window.addEventListener("scroll", updateActivePillar, { passive: true });
    window.addEventListener("resize", updateActivePillar);
    return () => {
      window.removeEventListener("scroll", updateActivePillar);
      window.removeEventListener("resize", updateActivePillar);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isPillarLanding) return;

    const updatePillarShelf = () => {
      const hero = document.getElementById("pillar-hero");
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const hasLeftHero = Boolean(
        hero && hero.getBoundingClientRect().bottom <= headerBottom,
      );

      setPillarShelfReadyPath(hasLeftHero ? pathname : null);
      if (!hasLeftHero) setOpen(false);
    };

    updatePillarShelf();
    window.addEventListener("scroll", updatePillarShelf, { passive: true });
    window.addEventListener("resize", updatePillarShelf);
    return () => {
      window.removeEventListener("scroll", updatePillarShelf);
      window.removeEventListener("resize", updatePillarShelf);
    };
  }, [isPillarLanding, pathname]);

  useEffect(() => {
    if (isReadingExperience) return;

    let active = true;
    const load = async () => {
      const [nextEvents, nextActivities] = await Promise.all([getUpcomingEvents(3), getPillarActivities()]);
      if (!active) return;
      setEvents(nextEvents);
      setActivities(nextActivities);
    };
    void load();
    const id = window.setInterval(load, 60_000);
    return () => { active = false; window.clearInterval(id); };
  }, [isReadingExperience]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (
    isReadingExperience ||
    (pathname === "/" && !homeShelfReady) ||
    (isPillarLanding && pillarShelfReadyPath !== pathname)
  ) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-5">
      <div className="pointer-events-auto relative mx-auto max-w-[1200px]">
        {open ? <aside id="live-shelf" aria-label="Live calendar and constellation activity" style={{ borderColor: `${accent}b3` }} className="absolute bottom-full left-0 mb-3 max-h-[min(30rem,calc(100svh-9rem))] w-full overflow-y-auto border bg-void/95 p-5 shadow-[0_-24px_70px_rgba(0,0,0,.54)] backdrop-blur-xl sm:p-6">
        <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: accent }}>Live shelf · {activeLabel}</p><h2 className="mt-2 font-display text-2xl text-bone">What&apos;s moving now.</h2></div><button type="button" onClick={() => setOpen(false)} style={{ color: accent, borderColor: `${accent}99` }} className="grid h-9 w-9 place-items-center border text-lg transition hover:bg-white/[.06]" aria-label="Close live shelf">×</button></div>

        <section className="mt-7 border-y border-mercury py-5"><div className="flex items-center justify-between gap-4"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-bone/70">Calendar</p><Link href="/events" onClick={() => setOpen(false)} style={{ color: accent }} className="font-mono text-[10px] uppercase tracking-[.12em] transition hover:brightness-125">All events →</Link></div><div className="mt-3 divide-y divide-mercury/75">{events.length ? events.map((event) => { const pillarId = eventPillar(event.pillar); const eventAccent = pillarId ? PILLARS[pillarId].color : "#ff78c4"; return <Link key={event.id} href={`/events/${event.slug}`} onClick={() => setOpen(false)} className="grid grid-cols-[3.8rem_1fr] gap-3 py-3 transition hover:bg-white/[.03]"><span className="font-mono text-[10px]" style={{ color: eventAccent }}>{new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(new Date(event.event_date))}</span><span><span className="block font-display text-lg leading-tight text-bone">{event.title}</span><span className="mt-1 block text-xs text-ghost">{event.location ?? "Whole Body Earth"}</span></span></Link>; }) : <p className="py-4 text-sm text-ghost">No upcoming events. Check back soon.</p>}</div></section>

        <section className="pt-6"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-bone/70">Across the constellation</p><div className="mt-3 grid gap-2">{activities.map((activity) => { const pillar = PILLARS[activity.pillar]; return <Link key={activity.id} href={activity.href} onClick={() => setOpen(false)} className="group border p-3 transition hover:bg-white/[.04]" style={{ borderColor: `${pillar.color}72` }}><div className="flex items-start gap-3"><span className="alchemical-glyph mt-0.5 text-lg" style={{ color: pillar.color }}>{pillar.symbol}</span><span className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-[.13em]" style={{ color: pillar.color }}>{activity.kicker}</span><span className="mt-1 block font-display text-lg leading-tight text-bone">{activity.title}</span><span className="mt-1 block text-xs leading-5 text-ghost">{activity.summary}</span></span></div></Link>; })}</div></section>

        <Link href="/events" onClick={() => setOpen(false)} style={{ borderColor: `${accent}b3`, color: accent }} className="mt-6 block border px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[.12em] transition hover:bg-white/[.06]">View all gatherings →</Link>
        </aside> : null}
        <button type="button" onClick={() => setOpen((current) => !current)} style={triggerStyle} className={`group relative flex w-full items-center justify-center gap-2 border px-3 py-2 text-center transition hover:brightness-125 sm:justify-start sm:px-4 sm:py-2.5 ${isHomeHero ? "live-shelf-trigger--earth" : ""}`} aria-controls="live-shelf" aria-expanded={open} aria-label={open ? "Close live field" : `Enter live field, ${events.length + activities.length} signals`}><LiveSignal color={accent} solid={activeSolid} /><span className="text-left"><span className="block font-mono text-[9px] uppercase tracking-[.16em] text-void/75 sm:text-[10px]">{open ? "Close live shelf" : activeLabel}</span><span className="mt-0.5 block font-display text-sm leading-none text-void sm:text-base">{open ? "Field ×" : "What’s moving now →"}</span></span></button>
      </div>
    </div>
  );
}
