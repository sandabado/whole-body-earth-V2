"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFeaturedItems } from "./data/featured-queries";
import { PILLARS } from "@/lib/pillars";

type Featured = Awaited<ReturnType<typeof getFeaturedItems>>;
export function FeaturedStrip() {
  const [items, setItems] = useState<Featured | null>(null);
  useEffect(() => { let active = true; const load = async () => { try { const result = await getFeaturedItems(); if (active) setItems(result); } catch (error) { console.error("[FeaturedStrip] fetch failed:", error); } }; load(); const interval = window.setInterval(load, 120_000); return () => { active = false; window.clearInterval(interval); }; }, []);
  const cards = [
    { id: "presence" as const, label: "Next circle", title: items?.presence?.title ?? "Weekly Whole Body Circle", meta: items?.presence?.event_date ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(items.presence.event_date)) : "Every Tuesday", href: "/pillars/presence/gatherings" },
    { id: "press" as const, label: "Now reading", title: items?.press?.title ?? "The Whole Body Series", meta: items?.press ? `Vol. ${items.press.volume_number ?? "I"} · ${items.press.author ?? "Whole Body Press"}` : "Five volumes · one operating system", href: items?.press?.slug ? `/pillars/press/${items.press.slug}` : "/pillars/press/library" },
    { id: "studios" as const, label: "Now playing", title: items?.studios?.title ?? "∞ Love", meta: items?.studios?.type ?? "Sandābādo · debut album", href: "/pillars/studios" },
    { id: "foundation" as const, label: "Now growing", title: items?.foundation?.title ?? "Tetrahedron Garden", meta: "Morongo Valley · Active", href: "/pillars/foundation/garden" },
  ];
  return <section className="relative z-10 px-6 py-16"><div className="mx-auto max-w-[1200px]"><p className="text-center font-mono text-[10px] uppercase tracking-[.22em] text-ghost">From the constellation</p><div className="mt-7 flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 lg:overflow-visible">{cards.map((card) => { const pillar = PILLARS[card.id]; return <Link key={card.id} href={card.href} className="min-w-[15rem] snap-start border border-mercury bg-void/32 p-5 shadow-[0_18px_52px_rgba(0,0,0,.2)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-void/50 lg:min-w-0" style={{ borderColor: `${pillar.color}77` }}><p className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: pillar.color }}>{pillar.symbol} {card.label}</p><h2 className="mt-5 font-display text-2xl text-bone">{card.title}</h2><p className="mt-2 min-h-10 text-sm text-ghost">{card.meta}</p><span className="mt-6 inline-block font-mono text-xs uppercase tracking-[.12em]" style={{ color: pillar.color }}>Explore →</span></Link>; })}</div></div></section>;
}
