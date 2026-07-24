"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPulseData } from "./data/pulse-queries";
import { PILLARS } from "@/lib/pillars";

const FALLBACK = [
  ["presence", "Next circle is being scheduled", "Join →", "/pillars/presence/gatherings"], ["press", "The Whole Body Series is in the library", "Read →", "/pillars/press/library"], ["studios", "Sandābādo streaming now", "Listen →", "/pillars/studios"], ["foundation", "Garden visits by appointment", "Reserve →", "/pillars/foundation/visit"], ["guardian", "Launching in 2027", "Learn →", "/pillars/guardian"],
] as const;

export function PulseBar() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getPulseData>> | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; const load = async () => { try { const result = await getPulseData(); if (active) setData(result); } catch (error) { console.error("[PulseBar] fetch failed:", error); } finally { if (active) setLoading(false); } }; load(); const interval = window.setInterval(load, 60_000); return () => { active = false; window.clearInterval(interval); }; }, []);
  const status = (id: typeof FALLBACK[number][0], fallback: string) => {
    const item = data?.[id] as { auditCount?: number; title?: string; volume_number?: number | null; event_date?: string } | undefined;
    if (!item) return fallback;
    if (id === "guardian") return `${item.auditCount} audits in review`;
    if (id === "press") return item.title ? `${item.title}${item.volume_number ? ` · Vol. ${item.volume_number}` : ""}` : fallback;
    return item.title ? (id === "presence" || id === "foundation") && item.event_date ? `${item.title} · ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(item.event_date))}` : item.title : fallback;
  };
  return <section className="relative z-10 border-y border-mercury bg-carbon/92 px-6 py-8 backdrop-blur-sm"><div className="mx-auto max-w-[1200px] border border-mercury bg-void/40 p-5 sm:p-6"><div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.18em] text-water"><span className="pulse-dot" /> Live pulse</div><div className="mt-5 divide-y divide-mercury/80">{FALLBACK.map(([id, fallback, label, href]) => { const pillar = PILLARS[id]; return <div key={id} className="grid grid-cols-[minmax(7rem,.75fr)_minmax(0,1fr)_auto] items-center gap-3 py-3 font-mono text-xs"><span className="uppercase tracking-[.12em]" style={{ color: pillar.color }}>{pillar.symbol} {pillar.name}</span><span className={loading ? "h-3 w-3/4 animate-pulse bg-mercury/70" : "min-w-0 truncate text-ghost"}>{loading ? null : status(id, fallback)}</span><Link href={href} className="uppercase tracking-[.12em]" style={{ color: pillar.color }}>{label}</Link></div>; })}</div><p className="mt-5 border-t border-mercury pt-4 font-mono text-[10px] uppercase tracking-[.16em] text-ghost">System status: all channels active</p></div></section>;
}
