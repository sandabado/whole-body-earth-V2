import type { ReactNode } from "react";
import Link from "next/link";
import { PillarHeroMedia } from "@/components/home/PillarHeroMedia";
import { PILLARS, type PillarId } from "@/lib/pillars";

type HeroAction = {
  href: string;
  label: string;
};

type PillarLandingHeroProps = {
  pillar: PillarId;
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  primaryAction: HeroAction;
  secondaryAction: HeroAction;
  availability: string;
};

/** A consistent, conversion-focused entry point for each Whole Body pillar. */
export function PillarLandingHero({
  pillar,
  eyebrow,
  title,
  children,
  primaryAction,
  secondaryAction,
  availability,
}: PillarLandingHeroProps) {
  const pillarData = PILLARS[pillar];
  const accent = pillarData.color;

  return (
    <section id="pillar-hero" className="pillar-hero">
      <div className="grid w-full items-center gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ borderColor: `${accent}88`, color: accent }}
            >
              {pillarData.releaseLabel}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ghost">
              {pillarData.solid} · {pillarData.elementLabel}
            </span>
          </div>
          <p
            className="mt-7 font-mono text-xs uppercase tracking-[0.22em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.98] font-bold md:text-7xl">
            {title}
          </h1>
          <div className="mt-7 space-y-4 text-lg leading-relaxed text-ghost">
            {children}
          </div>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={primaryAction.href}
              className="border px-5 py-3.5 font-mono text-xs uppercase tracking-[0.13em] text-void transition-colors hover:bg-transparent"
              style={{ borderColor: accent, backgroundColor: accent }}
            >
              {primaryAction.label}
            </Link>
            <Link
              href={secondaryAction.href}
              className="border px-5 py-3.5 font-mono text-xs uppercase tracking-[0.13em] transition-colors hover:bg-white/5"
              style={{ borderColor: `${accent}88`, color: accent }}
            >
              {secondaryAction.label}
            </Link>
          </div>
          <div
            className="mt-9 flex items-start gap-3 border-l pl-4"
            style={{ borderColor: accent }}
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-ghost">
              {availability}
            </p>
          </div>
        </div>
        <PillarHeroMedia pillarId={pillar} />
      </div>
    </section>
  );
}
