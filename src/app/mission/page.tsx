import Link from "next/link";
import { MissionPillarCard } from "@/components/mission/MissionPillarCard";
import { FeedFirstBlock } from "@/components/sections/FeedFirstBlock";
import { PILLARS } from "@/lib/pillars";

const pillars = [
  {
    pillar: "presence",
    description:
      "Fire is the circle that holds you. Weekly gatherings, retreats, and rites of passage. No hierarchy. No guru. Just belonging.",
    detail: "You cannot endure alone.",
    cta: "Join the circle",
  },
  {
    pillar: "press",
    description:
      "Books are technology: tools for transformation, not commodities. Authors retain their IP and the writer eats before the printer.",
    detail: "The Whole Body Series · Five volumes.",
    cta: "Enter the library",
  },
  {
    pillar: "studios",
    description:
      "Music is infrastructure. Artists retain their masters and publishing, with production and release support built around the work.",
    detail: "Sandābādo · ∞ Love.",
    cta: "Enter Studios",
  },
  {
    pillar: "foundation",
    description:
      "A desert site for structures that last: the Tetrahedron Garden, field sessions, and off-grid infrastructure in development.",
    detail: "Without ground, everything floats away.",
    cta: "Visit Foundation",
  },
  {
    pillar: "guardian",
    description:
      "Referral-led stewardship for creators and founders with something real to protect: systems, relationships, and long-term decisions.",
    detail: "The structure that helps work outlast you.",
    cta: "Meet Guardian",
  },
] as const;

export default function MissionPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,.12),transparent_42%),radial-gradient(circle_at_15%_35%,rgba(43,168,160,.08),transparent_30%)]"
      />
      <section className="relative px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1.12fr_.88fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.24em] text-press">
              The Whole Body Mission
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[.93] text-bone sm:text-6xl lg:text-7xl">
              Stop renting
              <br />
              <span className="text-press">your future.</span>
            </h1>
            <div className="mt-8 max-w-2xl space-y-5 text-lg leading-8 text-bone/80">
              <p>
                You were told to go alone. To bootstrap. To grind. To trade your
                IP for exposure, sign away your masters for distribution, and
                rent your reach from the platform that owns it.
              </p>
              <p className="font-display text-2xl leading-8 text-bone">
                That was the extraction. Whole Body is the return.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/reading"
                className="border border-press bg-press px-5 py-3 font-mono text-xs uppercase tracking-[.13em] text-void transition-colors hover:bg-transparent hover:text-press"
              >
                Get your reading →
              </Link>
              <a
                href="#pillars"
                className="border border-mercury px-5 py-3 font-mono text-xs uppercase tracking-[.13em] text-bone transition-colors hover:border-press"
              >
                Explore the pillars ↓
              </a>
            </div>
          </div>
          <div className="border border-press/40 bg-carbon/60 p-7 sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[.17em] text-press">
              What changes here
            </p>
            <dl className="mt-7 divide-y divide-mercury border-y border-mercury">
              <MissionShift
                before="Rent the reach"
                after="Build the relationship"
              />
              <MissionShift before="Trade the rights" after="Keep the work" />
              <MissionShift
                before="Extract the creator"
                after="Feed the creator"
              />
            </dl>
          </div>
        </div>
      </section>

      <section className="border-y border-mercury bg-carbon/35 px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-fire">
              The extraction economy
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[.97] text-bone sm:text-5xl">
              The old world owns other people&apos;s work.
            </h2>
          </div>
          <div className="max-w-3xl space-y-6 text-lg leading-8 text-ghost">
            <p>
              The publisher owns the words. The label owns the masters. The
              platform owns the audience. Every system asks the creator to
              become dependent on infrastructure they cannot control.
            </p>
            <div className="border-l-2 border-fire pl-6 font-display text-2xl leading-8 text-bone sm:text-3xl">
              You don&apos;t own your body of work. You rent it.
              <br />
              You don&apos;t own your audience. You rent it.
              <br />
              You don&apos;t own your future. You rent it.
            </div>
            <p className="font-mono text-xs uppercase tracking-[.16em] text-fire">
              The rent always goes up.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-8 border-b border-mercury pb-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-water">
                Your chart, held as a Quincunx
              </p>
              <h2 className="mt-4 font-display text-4xl leading-[.97] text-bone sm:text-5xl">
                Five bodies.
                <br />
                One practical map.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-ghost">
              We weight the placements that shape how you inhabit your body,
              mind, heart, roots, and center. Your reading identifies the
              element that anchors you and the pillar to build first.
            </p>
          </div>
          <div className="mt-10 overflow-x-auto border border-mercury">
            <table className="min-w-full text-left">
              <thead className="bg-carbon/70 font-mono text-[10px] uppercase tracking-[.15em] text-ghost">
                <tr>
                  <th className="px-5 py-4 font-normal">Element</th>
                  <th className="px-5 py-4 font-normal">Body</th>
                  <th className="px-5 py-4 font-normal">Pillar</th>
                  <th className="px-5 py-4 font-normal">Current status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mercury">
                {Object.entries(PILLARS).map(([id, pillar]) => (
                  <tr key={id} className="text-sm">
                    <td className="px-5 py-4">
                      <span
                        className="alchemical-glyph mr-3 text-xl"
                        style={{ color: pillar.color }}
                        aria-hidden="true"
                      >
                        {pillar.symbol}
                      </span>
                      {pillar.elementLabel}
                    </td>
                    <td className="px-5 py-4 text-ghost">{pillar.body}</td>
                    <td className="px-5 py-4 font-display text-lg text-bone">
                      {pillar.name}
                    </td>
                    <td
                      className="px-5 py-4 font-mono text-[10px] uppercase tracking-[.12em]"
                      style={{ color: pillar.color }}
                    >
                      {pillar.releaseLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/reading"
            className="mt-8 inline-block font-mono text-xs uppercase tracking-[.14em] text-water"
          >
            Get your Whole Body Design Reading →
          </Link>
        </div>
      </section>

      <section
        id="pillars"
        className="border-y border-mercury bg-carbon/25 px-6 py-20 md:py-28"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-press">
              The five pillars
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[.97] text-bone sm:text-5xl">
              One living system.
              <br />
              Five ways in.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map((pillar) => (
              <MissionPillarCard key={pillar.pillar} {...pillar} />
            ))}
          </div>
        </div>
      </section>

      <FeedFirstBlock />

      <section className="border-y border-mercury px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-water">
              The Whole Body Design Reading
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[.97] text-bone sm:text-5xl">
              Your chart is the map.
              <br />
              Your body is the terrain.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-8 text-ghost">
              A living field report that translates your celestial placements
              into a practical view of how you think, feel, build, belong, and
              lead. Start with your dominant element, then follow the practice
              that brings the field into balance.
            </p>
            <Link
              href="/reading"
              className="mt-8 inline-block border border-water bg-water px-5 py-3 font-mono text-xs uppercase tracking-[.13em] text-void transition-colors hover:bg-transparent hover:text-water"
            >
              Get your reading →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-press">
            The architect
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[.97] text-bone sm:text-5xl">
            Infrastructure for people building real things.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-ghost">
            Jesse Gawlik builds living systems for creators, families, artists,
            and communities ready to stop renting their future. From the Morongo
            Valley, the desert, studio, and writing desk share the same room.
          </p>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[.16em] text-bone/75">
            Whole Body Mastery LLC · Independent · Author-owned · Feed First
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/reading"
              className="border border-press px-5 py-3 font-mono text-xs uppercase tracking-[.13em] text-press transition-colors hover:bg-press hover:text-void"
            >
              Get your reading →
            </Link>
            <Link
              href="/pillars/press/library"
              className="border border-mercury px-5 py-3 font-mono text-xs uppercase tracking-[.13em] text-bone transition-colors hover:border-press"
            >
              Enter the library
            </Link>
            <Link
              href="/apply"
              className="border border-mercury px-5 py-3 font-mono text-xs uppercase tracking-[.13em] text-bone transition-colors hover:border-press"
            >
              Apply to the Living Spiral
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function MissionShift({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-4 font-mono text-[10px] uppercase tracking-[.1em]">
      <span className="text-ghost">{before}</span>
      <span className="text-press">→</span>
      <span className="text-right text-bone">{after}</span>
    </div>
  );
}
