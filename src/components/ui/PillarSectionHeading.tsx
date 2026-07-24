import type { ReactNode } from "react";

type PillarSectionHeadingProps = { eyebrow?: string; title: ReactNode; color: string; children?: ReactNode };

export function PillarSectionHeading({ eyebrow, title, color, children }: PillarSectionHeadingProps) {
  return <div className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color }}>{eyebrow}</p><h1 className="mt-4 font-display text-4xl leading-[1.08] font-bold text-bone md:text-6xl">{title}</h1>{children && <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-ghost">{children}</div>}</div>;
}
