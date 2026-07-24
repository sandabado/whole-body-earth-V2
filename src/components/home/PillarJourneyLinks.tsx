import Link from "next/link";
import { PILLARS, type PillarId } from "@/lib/pillars";

const JOURNEYS: Record<PillarId, Array<{ label: string; title: string; body: string; href: string; cta: string }>> = {
  presence: [
    { label: "Weekly practice", title: "Find your door.", body: "The circle meets weekly, monthly, and seasonally. Choose the gathering that meets you where you are.", href: "/pillars/presence/gatherings", cta: "View gatherings" },
    { label: "Closed containers", title: "A forge. A hearth.", body: "Deep work for men and women who are done performing—same faces, same room, real accountability.", href: "/pillars/presence/men", cta: "Explore containers" },
    { label: "In person", title: "The desert participates.", body: "Retreats for reset, initiation, and return. No phones. No laptops. The body remembers.", href: "/pillars/presence/retreats", cta: "See retreats" },
  ],
  press: [
    { label: "The complete series", title: "All five volumes. One operating system.", body: "Read, keep, and return through permanent library access—never a subscription or rental.", href: "/pillars/press/library", cta: "Enter the library" },
    { label: "Reading paths", title: "Not every reader enters at the same door.", body: "Curated paths for the work and question that is calling you now.", href: "/pillars/press/collections", cta: "Choose a path" },
    { label: "For authors", title: "Submit your work.", body: "Authors retain 100% IP, receive a clear 50/50 royalty split, and hear back within 30 days.", href: "/pillars/press/submissions", cta: "Submit a manuscript" },
  ],
  studios: [
    { label: "Artist roster", title: "Artists with the final say.", body: "Music, film, and culture built outside the extraction model—with rights remaining with the artist.", href: "/pillars/studios", cta: "Meet the roster" },
    { label: "Selected releases", title: "The catalog is the receipt.", body: "From Sandābādo to work in development, follow the projects moving through the studio.", href: "/pillars/studios/catalog", cta: "View the catalog" },
    { label: "Facilities & fieldwork", title: "Rooms, tools, and the space between.", body: "Tracking, spatial and vinyl-ready masters, and music-film fieldwork from Morongo Valley.", href: "/pillars/studios/services", cta: "Explore services" },
  ],
  foundation: [
    { label: "Phase 1 · Active now", title: "The Tetrahedron Garden", body: "Four corners, a central gathering space, and sacred geometry made tangible—already planted and growing.", href: "/pillars/foundation/garden", cta: "Explore the garden" },
    { label: "Phase 2 · In planning", title: "The Quincunx Modular Dome", body: "Off-grid infrastructure and five-point energy distribution for self-sufficient systems.", href: "/pillars/foundation/dome", cta: "Read the plan" },
    { label: "Come stand on it", title: "The land is the first teacher.", body: "Open by appointment for guided walks, retreat anchoring, and time with the ground beneath the work.", href: "/pillars/foundation/visit", cta: "Request a visit" },
  ],
  guardian: [
    { label: "The code", title: "Read it before you apply.", body: "The Guardian Manifesto is the first threshold: trust, sovereignty, and the container that allows work to outlast you.", href: "/pillars/guardian/manifesto", cta: "Read the manifesto" },
    { label: "The network", title: "Curated. Verified. Active.", body: "Guardian partners maintain an active pillar, contribute to the treasury, and uphold Feed First.", href: "/pillars/guardian/partners", cta: "View partners" },
    { label: "Referral path", title: "There is no cold application.", body: "The final gate is for established creators and stewards with a partner referral and something real to protect.", href: "/pillars/guardian", cta: "Enter the gate" },
  ],
};

export function PillarJourneyLinks({ pillar: id }: { pillar: PillarId }) {
  const pillar = PILLARS[id];
  return <div className="relative mx-auto mt-9 grid w-full max-w-6xl gap-3 border-t pt-5 sm:grid-cols-3" style={{ borderColor: `${pillar.color}55` }}>{JOURNEYS[id].map((item) => <Link key={item.href} href={item.href} className="group border bg-void/26 p-4 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-void/45" style={{ borderColor: `${pillar.color}55` }}><p className="font-mono text-[10px] uppercase tracking-[.15em]" style={{ color: pillar.color }}>{item.label}</p><h3 className="mt-2 font-display text-lg text-bone">{item.title}</h3><span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[.12em]" style={{ color: pillar.color }}>{item.cta} →</span></Link>)}</div>;
}
