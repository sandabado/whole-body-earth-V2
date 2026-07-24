import Link from "next/link";
import { HomePlatonicLayer } from "@/components/home/HomePlatonicLayer";
import { HomeTopFieldLayers } from "@/components/home/HomeTopFieldLayers";
import { HomeAmbientField } from "@/components/home/HomeAmbientField";
import { PillarPortalSection } from "@/components/home/PillarPortalSection";
import { ApplySection, FiveBodies } from "@/components/home/PortalSections";
import { PILLAR_SECTIONS } from "@/components/home/data/pillar-section-data";
import { StarSky } from "@/components/home/StarSky";
import { PILLARS, type PillarId } from "@/lib/pillars";

const heroPillars: Array<{ id: PillarId; symbol: string }> = [
  { id: "presence", symbol: "🜂" },
  { id: "press", symbol: "🜁" },
  { id: "studios", symbol: "🜄" },
  { id: "foundation", symbol: "🜃" },
  { id: "guardian", symbol: "⊙" },
];

export default function WholeBodyEarthHome() {
  return (
    <>
      <HomePlatonicLayer />
      <main id="main-content" className="home-portal relative z-10 isolate">
        <StarSky />
        <HomeAmbientField />
        <section
          id="hero"
          className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-5 py-28 sm:px-6"
        >
          <HomeTopFieldLayers />
          <div className="home-hero-copy relative z-10 mx-auto max-w-5xl text-center">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-press">
              Whole Body Earth
            </p>
            <h1 className="mt-5 font-display text-5xl font-medium leading-[.94] text-bone sm:text-6xl lg:text-7xl">
              The Whole Body Constellation
            </h1>
            <p className="mt-4 font-display text-2xl text-press sm:text-3xl">
              Five Pillars. One Whole Body.
            </p>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-bone/85 sm:text-lg">
              You have five bodies. Mental. Physical. Emotional. Spiritual.
              Ethereal. Each maps to an element. Each element maps to a
              geometric solid. Each solid is a pillar of work.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/reading"
                className="whole-body-passport-cta px-5 py-3 font-mono text-xs uppercase tracking-[.12em] text-void"
              >
                Get Whole Body Passport →
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {heroPillars.map(({ id, symbol }) => {
                const pillar = PILLARS[id];
                return (
                  <Link
                    key={id}
                    href={pillar.href}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[.12em] transition hover:-translate-y-0.5 hover:brightness-125"
                    style={{
                      borderColor: `${pillar.color}a6`,
                      color: pillar.color,
                      backgroundColor: `${pillar.color}14`,
                    }}
                  >
                    <span className="text-base leading-none">{symbol}</span>
                    {pillar.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        <FiveBodies />
        {PILLAR_SECTIONS.map((item) => (
          <PillarPortalSection key={item.id} item={item} />
        ))}
        <ApplySection />
      </main>
    </>
  );
}
