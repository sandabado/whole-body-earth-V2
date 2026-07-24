"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { PillarSectionData } from "./data/pillar-section-data";

type PillarActivityDialogProps = { item: PillarSectionData; color: string; symbol: string; name: string };

export function PillarActivityDialog({ item, color, symbol, name }: PillarActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return <><button type="button" onClick={() => setOpen(true)} className="shrink-0 font-mono text-[10px] uppercase tracking-[.12em] transition hover:text-bone" style={{ color }}>{item.live.action} details →</button>{open && <div className="fixed inset-0 z-[120] grid place-items-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby={titleId}><button type="button" className="absolute inset-0 bg-void/90 backdrop-blur-sm" aria-label="Close activity details" onClick={() => setOpen(false)} /><section className="relative max-h-[min(44rem,90vh)] w-full max-w-xl overflow-y-auto border bg-carbon p-6 shadow-[0_26px_90px_rgba(0,0,0,.62)] sm:p-8" style={{ borderColor: `${color}b3` }}><div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color }}>{symbol} Whole Body {name}</p><h2 id={titleId} className="mt-3 font-display text-3xl text-bone sm:text-4xl">{item.live.title}</h2><p className="mt-2 text-sm text-ghost">{item.live.subtitle}</p></div><button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center border border-mercury text-bone transition hover:border-bone" aria-label="Close activity details">×</button></div><div className="mt-8 border-y border-mercury py-6"><p className="text-base leading-7 text-bone/80">{item.activity.intro}</p><ul className="mt-5 space-y-3">{item.activity.details.map((detail) => <li key={detail} className="flex gap-3 text-sm leading-6 text-ghost"><span style={{ color }}>✦</span><span>{detail}</span></li>)}</ul></div><div className="mt-7 flex flex-wrap items-center justify-between gap-4"><p className="font-mono text-[10px] uppercase tracking-[.13em]" style={{ color }}>{item.live.status}</p><Link href={item.live.href} onClick={() => setOpen(false)} className="border px-4 py-3 font-mono text-[10px] uppercase tracking-[.12em] transition hover:bg-white/5" style={{ color, borderColor: color }}>{item.activity.cta} →</Link></div></section></div>}</>;
}
