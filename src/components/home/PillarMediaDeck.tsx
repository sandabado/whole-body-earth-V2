"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { pressVolumes } from "@/lib/press-data";
import { FieldFrame, SignalFrame } from "@/components/media/MediaFrames";
import { MEDIA_ATLAS } from "@/lib/media-atlas";
import type { PillarSectionData } from "./data/pillar-section-data";

const gardenFrames = [MEDIA_ATLAS.foundation.gardenSun, MEDIA_ATLAS.foundation.gardenEmber, MEDIA_ATLAS.foundation.gardenDawn];

export function PillarMediaDeck({ item, color }: { item: PillarSectionData; color: string }) {
  const common = "relative overflow-hidden rounded-2xl border bg-void/32 shadow-[0_22px_68px_rgba(0,0,0,.28)] backdrop-blur-md";
  if (item.media === "garden") return <GardenDeck className={common} color={color} />;
  if (item.media === "books") return <BookDeck className={common} color={color} />;
  if (item.media === "album") return <MusicDeck className={common} color={color} />;
  if (item.media === "presence") return <CourseDeck className={common} color={color} />;
  return <VideoDeck className={common} color={color} />;
}

function GardenDeck({ className, color }: { className: string; color: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setActive((current) => (current + 1) % gardenFrames.length), 5_400); return () => window.clearInterval(id); }, []);
  return <div className={className} style={{ borderColor: `${color}aa` }}><FieldFrame src={gardenFrames[active]} alt="Tetrahedron Garden in Morongo Valley" className="transition-opacity duration-700"><div className="absolute bottom-4 left-4"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-earth">Field carousel · {String(active + 1).padStart(2, "0")} / 03</p><p className="mt-2 font-display text-2xl font-medium text-bone">Tetrahedron Garden</p></div></FieldFrame><div className="flex items-center justify-between border-t border-earth/30 px-4 py-3"><span className="font-mono text-[10px] uppercase tracking-[.12em] text-bone/65">Morongo Valley</span><div className="flex gap-2">{gardenFrames.map((frame, index) => <button key={frame} type="button" aria-label={`View garden image ${index + 1}`} onClick={() => setActive(index)} className="h-2 w-2 rounded-full" style={{ background: index === active ? color : "rgba(245,243,240,.32)" }} />)}</div></div></div>;
}

function MusicDeck({ className, color }: { className: string; color: string }) {
  return <div className={className} style={{ borderColor: `${color}aa` }}><div className="grid aspect-video grid-cols-[.92fr_1.08fr]"><div className="relative overflow-hidden"><Image src={MEDIA_ATLAS.studios.infinityLove} alt="Sandābādo — ∞ Love album artwork" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" /></div><div className="flex flex-col justify-between p-5"><div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-water">Music player</p><h3 className="mt-3 font-display text-3xl font-medium text-bone">∞ Love</h3><p className="mt-2 text-sm text-water">Sandābādo</p></div><div><div className="flex h-8 items-end gap-1">{[32, 68, 44, 88, 54, 72, 40, 60].map((height, index) => <span key={index} className="w-full animate-[pulse_1.5s_ease-in-out_infinite] bg-water" style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />)}</div><div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[.12em] text-bone/65"><span>00:00</span><button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-water text-water" aria-label="Open album release">▶</button><span>Album</span></div></div></div></div><Link href="/pillars/studios" className="block border-t border-water/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-water">Open release →</Link></div>;
}

function BookDeck({ className, color }: { className: string; color: string }) {
  const [volume, setVolume] = useState(0); const book = pressVolumes[volume];
  return <div className={className} style={{ borderColor: `${color}aa` }}><div className="grid aspect-video grid-cols-[.8fr_1.2fr]"><div className="relative p-5" style={{ background: `linear-gradient(145deg,${book.cover.from},${book.cover.to})` }}><p className="font-mono text-[10px] uppercase tracking-[.12em]" style={{ color: book.cover.accent }}>Whole Body Press</p><p className="mt-10 font-display text-5xl font-medium" style={{ color: book.cover.accent }}>{book.number}</p><p className="mt-3 font-display text-xl text-bone">{book.title}</p></div><div className="flex flex-col justify-between p-5"><div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-press">Reader preview</p><p className="mt-5 font-display text-xl leading-7 text-bone">“{book.excerpt}”</p></div><div className="flex items-center justify-between"><div className="flex gap-1">{pressVolumes.map((item, index) => <button key={item.slug} type="button" aria-label={`Open volume ${item.number}`} onClick={() => setVolume(index)} className="h-2 w-5" style={{ background: index === volume ? color : "rgba(245,243,240,.22)" }} />)}</div><span className="font-mono text-[10px] uppercase tracking-[.12em] text-press">Vol. {book.number} / V</span></div></div></div><Link href="/pillars/press/library" className="block border-t border-press/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-press">Open the reader →</Link></div>;
}

function CourseDeck({ className, color }: { className: string; color: string }) {
  return <div className={className} style={{ borderColor: `${color}aa` }}><div className="grid aspect-video grid-cols-2 gap-px bg-fire/30"><div className="relative flex flex-col justify-end bg-void/55 p-5"><div aria-hidden="true" className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-fire/25 blur-3xl" /><p className="relative font-mono text-[10px] uppercase tracking-[.14em] text-fire">Live course</p><h3 className="relative mt-3 font-display text-3xl font-medium text-bone">The Hearthfire</h3><p className="relative mt-3 text-sm leading-6 text-bone/70">Weekly practice for the body that gathers.</p></div><div className="bg-void/55 p-5"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-fire">Course map</p>{["Arrive", "Breathe", "Witness"].map((lesson, index) => <div key={lesson} className="mt-4 flex items-center gap-3 border-b border-fire/20 pb-3"><span className="font-mono text-[10px] text-fire">0{index + 1}</span><span className="text-sm text-bone/75">{lesson}</span></div>)}</div></div><Link href="/pillars/presence/gatherings" className="block border-t border-fire/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-fire">Join the next circle →</Link></div>;
}

function VideoDeck({ className, color }: { className: string; color: string }) {
  return <div className={className} style={{ borderColor: `${color}aa` }}><SignalFrame className="flex aspect-video items-center justify-center"><div aria-hidden="true" className="absolute inset-8 border border-guardian/35" /><button type="button" aria-label="Guardian film dispatch preview" className="relative grid h-14 w-14 place-items-center rounded-full border border-guardian text-xl text-guardian">▶</button><div className="absolute bottom-5 left-5"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-guardian">Film dispatch</p><p className="mt-2 font-display text-2xl font-medium text-bone">The Guardian Gate</p></div></SignalFrame><Link href="/pillars/guardian/manifesto" className="block border-t border-guardian/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-guardian">View the manifesto →</Link></div>;
}
