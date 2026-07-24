"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PILLARS, type PillarId } from "@/lib/pillars";
import { pressVolumes } from "@/lib/press-data";

const gardenFrames = [
  "/images/foundation/tetrahedron-garden-sun.png",
  "/images/foundation/tetrahedron-garden-ember.png",
  "/images/foundation/tetrahedron-garden-dawn.png",
];

const board = "grid min-h-[23rem] grid-cols-6 grid-rows-4 gap-px overflow-hidden rounded-2xl border bg-void/30 p-px shadow-[0_22px_70px_rgba(0,0,0,.26)] backdrop-blur-md";
const tile = "relative overflow-hidden bg-void/34 p-4 transition hover:bg-void/55";
const label = "font-mono text-[10px] uppercase tracking-[.14em]";
const heading = "font-display text-3xl font-medium leading-none text-bone";

export function PillarDashboard({ pillar }: { pillar: PillarId }) {
  if (pillar === "presence") return <PresenceDashboard />;
  if (pillar === "press") return <PressDashboard />;
  if (pillar === "studios") return <StudiosDashboard />;
  if (pillar === "foundation") return <FoundationDashboard />;
  return <GuardianDashboard />;
}

function PresenceDashboard() {
  const { color } = PILLARS.presence;
  return <Link href="/pillars/presence/gatherings" className={`${board} group`} style={{ borderColor: `${color}aa` }}>
    <div className={`${tile} col-span-4 row-span-3 flex flex-col justify-end`}><div aria-hidden="true" className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-fire/20 blur-3xl group-hover:scale-125" /><p className={`relative ${label} text-fire`}>Live container</p><h3 className={`relative mt-3 ${heading}`}>The Hearthfire<br />Session</h3><p className="relative mt-4 max-w-xs text-sm leading-6 text-bone/70">The open door. No hierarchy. Show up, breathe, and listen.</p></div>
    <Metric label="Frequency" value="Weekly" color={color} /><Metric label="Duration" value="60m" color={color} />
    <Metric label="Where" value="Virtual" color={color} /><Metric label="Entry" value="Free" color={color} />
    <div className={`${tile} col-span-4 flex items-center justify-between ${label} text-fire`}><span>Tuesday · 7 PM PT</span><span>Enter →</span></div>
  </Link>;
}

function PressDashboard() {
  const { color } = PILLARS.press;
  return <Link href="/pillars/press/library" className={`${board} group`} style={{ borderColor: `${color}aa` }}>
    <div className={`${tile} col-span-6 row-span-2 flex items-end gap-2 pt-5`}>{pressVolumes.map((volume, index) => <div key={volume.slug} className="relative h-full flex-1 overflow-hidden border border-white/15 transition duration-500 group-hover:-translate-y-2" style={{ height: `${70 + (index % 3) * 14}%`, background: `linear-gradient(155deg, ${volume.cover.from}, ${volume.cover.to})`, transitionDelay: `${index * 50}ms` }}><span className="absolute inset-x-0 top-3 text-center font-mono text-[9px] tracking-[.12em]" style={{ color: volume.cover.accent }}>VOL. {volume.number}</span></div>)}</div>
    <div className={`${tile} col-span-4 row-span-2 flex flex-col justify-end`}><p className={`${label} text-press`}>The library</p><h3 className={`mt-2 ${heading}`}>The Whole Body<br />Series</h3><p className="mt-3 text-sm text-bone/70">Five volumes. One operating system.</p></div>
    <Metric label="Release" value="Q4 '26" color={color} /><Metric label="Volumes" value="05" color={color} />
  </Link>;
}

function StudiosDashboard() {
  const { color } = PILLARS.studios;
  return <Link href="/pillars/studios" className={`${board} group`} style={{ borderColor: `${color}aa` }}>
    <div className={`${tile} col-span-4 row-span-3 p-0`}><Image src="/images/releases/sandabado-infinity-love.png" alt="Sandābādo — ∞ Love album artwork" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" /><p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[.18em] text-water">Now playing</p></div>
    <div className={`${tile} col-span-2 row-span-3 flex flex-col justify-between`}><div><p className={`${label} text-water`}>Studios 01</p><h3 className={`mt-3 ${heading}`}>∞<br />Love</h3><p className="mt-3 text-sm text-water">Sandābādo</p></div><div className="flex h-9 items-end gap-1">{[38, 70, 48, 86, 58, 74].map((height, index) => <span key={index} className="w-full animate-[pulse_1.45s_ease-in-out_infinite] bg-water" style={{ height: `${height}%`, animationDelay: `${index * 100}ms` }} />)}</div></div>
    <Metric label="Ownership" value="100%" color={color} /><Metric label="Format" value="Album" color={color} /><div className={`${tile} col-span-2 flex items-center ${label} text-water`}>Enter release →</div>
  </Link>;
}

function FoundationDashboard() {
  const { color } = PILLARS.foundation;
  const [active, setActive] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setActive((current) => (current + 1) % gardenFrames.length), 5_400); return () => window.clearInterval(id); }, []);
  return <article className={board} style={{ borderColor: `${color}aa` }}>
    <Link href="/pillars/foundation/garden" className={`${tile} col-span-6 row-span-3 block p-0`}>{gardenFrames.map((src, index) => <Image key={src} src={src} alt="Tetrahedron Garden in Morongo Valley" fill sizes="(min-width: 1024px) 42vw, 100vw" className={`object-cover transition duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`} />)}<div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" /><div className="absolute bottom-4 left-4"><p className={`${label} text-earth`}>Phase 1 · Active now</p><h3 className={`mt-2 ${heading}`}>Tetrahedron Garden</h3></div></Link>
    <Metric label="Location" value="M. Valley" color={color} /><Metric label="State" value="Growing" color={color} /><Metric label="Visits" value="By apt." color={color} />
    <div className={`${tile} col-span-3 flex items-center justify-end gap-2`}>{gardenFrames.map((src, index) => <button key={src} type="button" aria-label={`View garden image ${index + 1}`} onClick={() => setActive(index)} className="h-2 w-2 rounded-full" style={{ background: index === active ? color : "rgba(245,243,240,.3)" }} />)}</div>
  </article>;
}

function GuardianDashboard() {
  const { color } = PILLARS.guardian;
  return <Link href="/pillars/guardian/manifesto" className={`${board} group`} style={{ borderColor: `${color}aa` }}>
    <div className={`${tile} col-span-4 row-span-4 flex flex-col justify-between`}><div><p className={`${label} text-guardian`}>Guardian protocol</p><h3 className={`mt-4 ${heading}`}>The center<br />holds.</h3></div><p className="max-w-xs text-sm leading-6 text-bone/70">Trust architecture for work built to outlast you.</p><p className={`${label} text-guardian`}>Read the threshold →</p></div>
    {["Active pillar", "Partner referral", "Protected work", "Referral only"].map((value, index) => <div key={value} className={`${tile} col-span-2 flex flex-col justify-between`}><span className="font-mono text-[10px] text-guardian">0{index + 1}</span><span className="font-mono text-[10px] uppercase tracking-[.1em] text-bone/72">{value}</span></div>)}
  </Link>;
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className={`${tile} col-span-2 flex flex-col justify-between`}><p className="font-mono text-[9px] uppercase tracking-[.13em] text-bone/50">{label}</p><p className="font-mono text-lg leading-none" style={{ color }}>{value}</p></div>;
}
