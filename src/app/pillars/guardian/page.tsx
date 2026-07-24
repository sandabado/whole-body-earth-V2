import Link from "next/link";
import { PillarJourneyMap } from "@/components/layout/PillarJourneyMap";
import { PillarLandingHero } from "@/components/layout/PillarLandingHero";
const functions = [
  "Partner vetting — reviews applications, audits practices, and checks Feed First alignment.",
  "Network placement — matches qualified partners to work, collaborators, and nodes.",
  "Resource stewardship — protects the commons and Guild infrastructure.",
  "Succession planning — systems, documents, and training that outlast individuals.",
];
export default function GuardianPage() {
  return (
    <main className="px-6">
      <div className="mx-auto max-w-[1200px]">
        <PillarLandingHero
          pillar="guardian"
          eyebrow="☉ The Guardian · referral-led"
          title={
            <>
              Protect what
              <br />
              you are <span className="text-guardian">building.</span>
            </>
          }
          primaryAction={{
            href: "/pillars/guardian/manifesto",
            label: "Read the code →",
          }}
          secondaryAction={{
            href: "/pillars/guardian/quincunx",
            label: "Enter the Observer seat",
          }}
          availability="$50k+/year · 3+ years operating · active pillar · partner referral"
        >
          <p>
            A private stewardship path for founders with real weight to carry.
            Guardian protects the relationships, systems, and long-term
            decisions that let good work endure.
          </p>
        </PillarLandingHero>
        <section className="mt-16 grid gap-10 border-y border-guardian/30 py-12 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-guardian">
              Eligibility
            </p>
            <ul className="mt-5 space-y-3 text-ghost">
              <li>Minimum $50,000/year revenue</li>
              <li>Minimum three years in operation</li>
              <li>One of the five pillars active</li>
              <li>Partner referral required</li>
            </ul>
          </div>
          <div>
            <p className="leading-relaxed text-ghost">
              If you don&apos;t meet these criteria, you are not being rejected.
              You are simply not ready. There is no shame in preparation.
            </p>
          </div>
        </section>
        <section className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-guardian">
            What the Guardian does
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {functions.map((item) => (
              <p
                key={item}
                className="border-l border-guardian/60 bg-carbon/50 p-5 leading-relaxed text-ghost"
              >
                {item}
              </p>
            ))}
          </div>
        </section>
        <section className="mt-16 border border-guardian/40 bg-guardian/5 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-guardian">
            Referrals only
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold">
            There is no cold application.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ghost">
            If you know someone in the network, ask them. If they know
            you&apos;re ready, they will refer you.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/pillars/guardian/quincunx"
              className="border border-guardian px-5 py-3 font-mono text-xs uppercase tracking-[0.13em] text-guardian hover:bg-guardian hover:text-void"
            >
              Explore Position 9 →
            </Link>
            <Link
              href="/pillars/guardian/manifesto"
              className="font-mono text-xs uppercase tracking-[0.13em] text-guardian"
            >
              Read the manifesto →
            </Link>
            <Link
              href="/pillars/guardian/partners"
              className="font-mono text-xs uppercase tracking-[0.13em] text-guardian"
            >
              View partners →
            </Link>
          </div>
        </section>
        <PillarJourneyMap pillar="guardian" />
      </div>
    </main>
  );
}
