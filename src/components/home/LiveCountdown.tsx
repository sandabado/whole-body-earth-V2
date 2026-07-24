"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getNextEvent } from "./data/countdown-queries";

type Event = Awaited<ReturnType<typeof getNextEvent>>;
const empty = { days: 0, hours: 0, minutes: 0 };
export function LiveCountdown({ hero = false }: { hero?: boolean }) {
  const [event, setEvent] = useState<Event>(null); const [left, setLeft] = useState(empty);
  useEffect(() => { let active = true; const load = async () => { try { const next = await getNextEvent(); if (active) setEvent(next); } catch (error) { console.error("[LiveCountdown] fetch failed:", error); } }; load(); const refetch = window.setInterval(load, 300_000); return () => { active = false; window.clearInterval(refetch); }; }, []);
  useEffect(() => { if (!event) return; const tick = () => { const diff = Math.max(0, new Date(event.event_date).getTime() - Date.now()); setLeft({ days: Math.floor(diff / 86_400_000), hours: Math.floor((diff % 86_400_000) / 3_600_000), minutes: Math.floor((diff % 3_600_000) / 60_000) }); }; tick(); const interval = window.setInterval(tick, 1000); return () => window.clearInterval(interval); }, [event]);
  return <div className={hero ? "absolute right-5 bottom-5 left-5 z-20 sm:right-6 sm:left-auto sm:w-[24rem]" : "relative z-10 px-6 pb-10"}><article className="w-full border border-mercury bg-void/42 p-5 shadow-[0_18px_55px_rgba(0,0,0,.22)] backdrop-blur-md"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-ghost">Next gathering</p>{event ? <><h2 className="mt-2 font-display text-2xl text-bone">{event.title}</h2><div className="mt-5 flex items-start gap-3 font-mono">{([['days', left.days], ['hours', left.hours], ['minutes', left.minutes]] as const).map(([label, value]) => <div key={label} className="text-center"><p className="text-3xl text-water">{String(value).padStart(2, "0")}</p><p className="mt-1 text-[9px] uppercase tracking-[.12em] text-ghost">{label}</p></div>)}</div><p className="mt-4 text-sm text-ghost">{event.location ?? "Whole Body Earth"}{event.price_cents ? ` · $${(event.price_cents / 100).toFixed(0)}` : " · Free"}</p><p className="mt-1 font-mono text-xs text-water">{event.spotsRemaining} spots open</p><Link href="/calendar" className="mt-5 inline-block font-mono text-xs uppercase tracking-[.12em] text-water">Reserve →</Link></> : <p className="mt-3 text-sm text-ghost">No upcoming events. Check back soon.</p>}</article></div>;
}
