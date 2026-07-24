import Link from "next/link";
import { PillarJourneyMap } from "@/components/layout/PillarJourneyMap";
import { PillarLandingHero } from "@/components/layout/PillarLandingHero";
export default function FoundationPage() {
  return (
    <main className="px-6">
      <div className="mx-auto max-w-[1200px]">
        <PillarLandingHero
          pillar="foundation"
          eyebrow="🜃 Whole Body Foundation · Morongo Valley"
          title={
            <>
              Put roots under
              <br />
              the <span className="text-earth">work.</span>
            </>
          }
          primaryAction={{
            href: "/pillars/foundation/visit",
            label: "Request a garden visit →",
          }}
          secondaryAction={{
            href: "/pillars/foundation/waitlist",
            label: "Join the build list",
          }}
          availability="Garden visits · field sessions · off-grid infrastructure in development"
        >
          <p>
            A living desert site where the ideas become tangible. Come walk the
            Tetrahedron Garden, meet the land, and help shape the structures
            that will hold this work for generations.
          </p>
        </PillarLandingHero>
        <section className="mt-24 grid gap-6 md:grid-cols-2">
          <Phase
            label="Phase 1 · Active now"
            title="The Tetrahedron Garden"
            body="Four corners. Central gathering space. Sacred geometry made tangible. Already planted. Already growing."
            href="/pillars/foundation/garden"
            cta="Explore the garden →"
          />
          <Phase
            label="Phase 2 · In planning"
            title="The Quincunx Modular Dome"
            body="Off-grid infrastructure. Five-point energy distribution. Self-sufficient systems. Under design; groundbreaking TBD."
            href="/pillars/foundation/dome"
            cta="Read the plan →"
          />
        </section>
        <section className="mt-20 grid gap-10 border-y border-earth/30 py-16 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-earth">
              Visit the garden
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold">
              The land is the first teacher.
            </h2>
          </div>
          <div>
            <p className="leading-relaxed text-ghost">
              Open by appointment. Guided walks. Retreat anchor point. Come
              stand on it.
            </p>
            <Link
              href="/pillars/foundation/visit"
              className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.13em] text-earth"
            >
              Request a visit →
            </Link>
          </div>
        </section>
        <PillarJourneyMap pillar="foundation" />
      </div>
    </main>
  );
}
function Phase({
  label,
  title,
  body,
  href,
  cta,
}: {
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="border border-earth/45 bg-carbon/60 p-8">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-earth">
        {label}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold">{title}</h2>
      <p className="mt-5 leading-relaxed text-ghost">{body}</p>
      <Link
        href={href}
        className="mt-7 inline-block font-mono text-xs uppercase tracking-[0.13em] text-earth"
      >
        {cta}
      </Link>
    </article>
  );
}
