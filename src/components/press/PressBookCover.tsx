import type { CSSProperties } from "react";
import type { PressVolume } from "@/lib/press-data";

type PressBookCoverProps = { volume: PressVolume; size?: "card" | "hero" };

export function PressBookCover({ volume, size = "card" }: PressBookCoverProps) {
  const style = {
    "--cover-from": volume.cover.from,
    "--cover-to": volume.cover.to,
    "--cover-accent": volume.cover.accent,
  } as CSSProperties;

  return (
    <div style={style} className={`relative flex aspect-[3/4] w-full flex-col overflow-hidden border border-[color:var(--cover-accent)]/50 bg-[linear-gradient(145deg,var(--cover-from),var(--cover-to)_70%)] p-5 shadow-[0_18px_38px_rgba(0,0,0,0.35)] ${size === "hero" ? "max-w-md p-8 sm:p-10" : ""}`}>
      <div aria-hidden="true" className="absolute inset-3 border border-[color:var(--cover-accent)]/25" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[color:var(--cover-accent)]/60 sm:h-44 sm:w-44" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--cover-accent)]/70" />
      <p className="relative font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--cover-accent)]">Whole Body Press</p>
      <p className="relative mt-5 font-mono text-xs tracking-[0.28em] text-bone/70">VOL. {volume.number}</p>
      <div className="relative mt-auto">
        <h3 className="font-display text-2xl leading-[1.04] font-bold text-bone sm:text-3xl">{volume.title}</h3>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--cover-accent)]">{volume.element} · {volume.shape}</p>
      </div>
    </div>
  );
}
