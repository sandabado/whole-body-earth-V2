import Link from "next/link";
import { PresenceProgramCard } from "@/components/presence/PresenceProgramCard";
import { PillarLandingHero } from "@/components/layout/PillarLandingHero";
import { PillarJourneyMap } from "@/components/layout/PillarJourneyMap";
import { GATHERINGS, PRESENCE_PROGRAMS } from "@/lib/presence-data";

export default function PresencePage() {
  return (
    <main className="px-6">
      <div className="mx-auto max-w-[1200px]">
        <PillarLandingHero
          pillar="presence"
          eyebrow="🜂 Whole Body Presence · live circles"
          title={
            <>
              Come back to
              <br />
              the <span className="text-fire">circle.</span>
            </>
          }
          primaryAction={{
            href: "/pillars/presence/gatherings",
            label: "Join the next circle →",
          }}
          secondaryAction={{
            href: "/pillars/presence/about",
            label: "How Presence works",
          }}
          availability="Weekly circles · retreats · rites of passage · no hierarchy, no guru"
        >
          {" "}
          <p>
            A held room for people finished with going it alone. Return to the
            fire of belonging with a circle built for truth, practice, and real
            accountability.
          </p>
        </PillarLandingHero>
        <section className="mt-24 grid gap-12 border-y border-fire/30 py-16 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fire">
              The tetrahedron
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold">
              A circle is a stable form.
            </h2>
          </div>
          <div className="space-y-5 leading-relaxed text-ghost">
            <p>
              Four people. Honest. Present. Accountable. That is the
              tetrahedron.
            </p>
            <p>
              Not a group. Not an audience. A circle — where everyone can be
              seen and no one sits at the head.
            </p>
            <p>Presence is the return to the circle.</p>
          </div>
        </section>
        <section className="py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fire">
            Four containers
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold">
            Different doors. Same fire.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PRESENCE_PROGRAMS.map((program) => (
              <PresenceProgramCard key={program.title} program={program} />
            ))}
          </div>
        </section>
        <section className="border-y border-fire/30 py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fire">
            The next fire
          </p>
          <div className="mt-7 divide-y divide-mercury">
            {GATHERINGS.slice(0, 3).map((gathering) => (
              <article
                key={gathering.title}
                className="grid gap-4 py-7 md:grid-cols-[0.8fr_1.2fr]"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-fire">
                    {gathering.label}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold">
                    {gathering.title}
                  </h3>
                </div>
                <div>
                  <p className="font-mono text-xs text-bone">
                    {gathering.meta}
                  </p>
                  <p className="mt-3 leading-relaxed text-ghost">
                    {gathering.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <Link
            href="/pillars/presence/gatherings"
            className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.14em] text-fire"
          >
            All gatherings →
          </Link>
        </section>
        <section className="grid gap-10 py-20 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fire">
              Who this is for
            </p>
            <ul className="mt-6 space-y-3 text-ghost">
              <li>You&apos;re tired of performing.</li>
              <li>
                You&apos;re building something real and need a circle to hold
                you.
              </li>
              <li>You want depth, not networking.</li>
              <li>You&apos;re ready to show up consistently.</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ghost">
              Who this is not for
            </p>
            <ul className="mt-6 space-y-3 text-ghost">
              <li>You want a course you can consume.</li>
              <li>You&apos;re looking for someone to fix you.</li>
              <li>You need a framework instead of presence.</li>
              <li>You&apos;re not ready to be seen.</li>
            </ul>
          </div>
        </section>
        <PillarJourneyMap pillar="presence" />
      </div>
    </main>
  );
}
