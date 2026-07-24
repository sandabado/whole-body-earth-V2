import type { CSSProperties } from "react";
import Link from "next/link";
import { PILLARS, type PillarId } from "@/lib/pillars";

type MissionPillarCardProps = {
  pillar: PillarId;
  description: string;
  detail: string;
  cta: string;
};

/** Reusable mission-page view of a pillar, driven by the canonical pillar data. */
export function MissionPillarCard({
  pillar,
  description,
  detail,
  cta,
}: MissionPillarCardProps) {
  const item = PILLARS[pillar];

  return (
    <article
      className="group flex min-h-[19rem] flex-col border border-mercury bg-carbon/45 p-6 transition-colors hover:border-bone/45 sm:p-7"
      style={{ "--mission-pillar": item.color } as CSSProperties}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="alchemical-glyph text-4xl leading-none"
          style={{ color: item.color }}
          aria-hidden="true"
        >
          {item.symbol}
        </span>
        <span
          className="border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{ borderColor: `${item.color}80`, color: item.color }}
        >
          {item.releaseLabel}
        </span>
      </div>
      <p
        className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: item.color }}
      >
        {item.elementLabel} · {item.solid}
      </p>
      <h3 className="mt-3 font-display text-3xl text-bone">{item.name}</h3>
      <p className="mt-4 text-sm leading-6 text-ghost">{description}</p>
      <p className="mt-4 font-display text-lg leading-6 text-bone/85">
        {detail}
      </p>
      <Link
        href={item.href}
        className="mt-auto pt-7 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors group-hover:text-bone"
        style={{ color: item.color }}
      >
        {cta} →
      </Link>
    </article>
  );
}
