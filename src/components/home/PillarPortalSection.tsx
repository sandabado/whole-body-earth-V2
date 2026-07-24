import Link from "next/link";
import { PILLARS } from "@/lib/pillars";
import { PillarMediaDeck } from "./PillarMediaDeck";
import { PillarActivityDialog } from "./PillarActivityDialog";
import type { PillarSectionData } from "./data/pillar-section-data";

export function PillarPortalSection({ item }: { item: PillarSectionData }) {
  const pillar = PILLARS[item.id];
  const heading = () => (
    <>
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[.14em] sm:text-sm" style={{ color: pillar.color }}><span>{item.number}</span><span>{pillar.symbol}</span><span>{pillar.elementLabel} · {pillar.solid}</span></div>
      <h2 className="mt-4 font-display text-4xl font-medium text-bone sm:text-5xl">Whole Body {pillar.name}</h2>
      <p className="mt-2 font-display text-xl" style={{ color: pillar.color }}>{item.tagline}</p>
    </>
  );
  const details = () => (
    <>
      <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-bone/75">{item.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <div className="mt-7 rounded-2xl border bg-void/30 p-4 backdrop-blur-md" style={{ borderColor: `${pillar.color}88` }}><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: pillar.color }}><span className="mr-2 inline-block h-2 w-2 rounded-full bg-current" />{item.live.status}</p><h3 className="mt-2 font-display text-xl font-medium text-bone">{item.live.title}</h3><p className="mt-1 text-sm text-bone/65">{item.live.subtitle}</p></div><PillarActivityDialog item={item} color={pillar.color} symbol={pillar.symbol} name={pillar.name} /></div></div>
      <Link href={pillar.href} className="mt-7 inline-block rounded-xl border px-5 py-3 font-mono text-xs uppercase tracking-[.12em] transition hover:bg-white/5" style={{ color: pillar.color, borderColor: pillar.color }}>{item.cta} →</Link>
    </>
  );

  return <section id={item.id} className="relative px-5 py-16 sm:px-6 md:py-24">
    <div className="mx-auto grid max-w-6xl items-center gap-7 lg:grid-cols-2 lg:gap-14">
      <div className="lg:hidden">
        {heading()}
      </div>
      <PillarMediaDeck item={item} color={pillar.color} />
      <div className="lg:hidden">
        {details()}
      </div>
      <div className="hidden lg:block">
        {heading()}
        {details()}
      </div>
    </div>
  </section>;
}
