// ARCHIVED v1. Active is app/page.tsx (v3 Periodic Portal).
// Do not modify this file unless reverting the portal implementation.

import Link from "next/link";
import { HomePlatonicLayer } from "@/components/home/HomePlatonicLayer";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { FeaturedStrip } from "@/components/home/FeaturedStrip";
import { LiveCountdown } from "@/components/home/LiveCountdown";
import { PillarJourneyLinks } from "@/components/home/PillarJourneyLinks";
import { PillarDashboard } from "@/components/home/PillarDashboard";
import { PulseBar } from "@/components/home/PulseBar";
import { PILLARS as PILLAR_SYSTEM } from "@/lib/pillars";

const SECTION_SHELL = "relative flex items-center overflow-hidden px-5 py-16 sm:px-6 sm:py-20 lg:min-h-[calc(100svh-7rem)] lg:py-24";

const PILLARS = [
  { id: "presence", ...PILLAR_SYSTEM.presence, description: "Fire is the circle that holds you. Weekly gatherings, monthly retreats, and rites of passage.", feature: { label: "The embodied voice", title: "Somatic practice for the signal you carry.", text: "Breath, grounding, vocal activation, and a return to the physical vessel." }, tagline: "The shape of ignition.", paragraphs: ["Fire is the circle that holds you. Weekly gatherings. Monthly retreats. Rites of passage. No hierarchy. No guru. Just belonging.", "The tetrahedron is the simplest solid. Four points. The minimum stable form. So is a circle — where everyone can be seen and no one sits at the head.", "You cannot endure alone. The Old World sold you independence as freedom. It was isolation dressed as strength. Presence is the return to the circle."] },
  { id: "press", ...PILLAR_SYSTEM.press, description: "Books are technology: tools for transformation, not commodities.", feature: { label: "Signal architecture", title: "A practice for your message.", text: "Clarify the idea, edit the noise, and make the work easy to find." }, tagline: "The shape that carries.", paragraphs: ["Books are not commodities. They are technology. Tools for transformation. The Living Earth Codex — five volumes. One operating system. From the instrument to the spiral. From silence to manifestation.", "Authors retain 100% copyright and IP. 50/50 royalty split. The author eats first.", "Digital $22 each · Physical $77 each · Complete Codex $111 / $333 / $388"] },
  { id: "studios", ...PILLAR_SYSTEM.studios, description: "Music and film are infrastructure — current and truth, never content.", feature: { label: "Emotional cartography", title: "Creative work that lets feeling move.", text: "Colour mapping, relational practice, free creation, and a path into flow." }, tagline: "The shape that remembers.", paragraphs: ["Music is infrastructure. Film is infrastructure. The song is current, not content. The image is truth, not entertainment.", "Artists retain 100% masters, publishing, and IP. We earn on production, distribution, and placement — never on ownership. The artist eats first."] },
  { id: "foundation", ...PILLAR_SYSTEM.foundation, description: "Rammed earth, off-grid, carbon negative: a place to stand that cannot be taken.", feature: { label: "The root practice", title: "Structure that can hold your work.", text: "Build rituals, map your systems, and create the conditions for a lasting legacy." }, tagline: "The shape that endures.", paragraphs: ["Rammed earth. Off-grid. Carbon negative. A place to stand that cannot be taken. The Tetrahedron Garden is planted and growing. The Quincunx Modular Dome is in design.", "The cube is the most stable form. Six faces. Equal pressure from all sides. Without ground, everything floats away.", "Phase 1: Tetrahedron Garden — Active Now · Phase 2: Quincunx Dome — In Planning"] },
  { id: "guardian", ...PILLAR_SYSTEM.guardian, description: "Sovereign systems and trust architecture for creators with something real to protect.", feature: { label: "The Guardian’s circle", title: "Integration for those who hold the whole.", text: "Facilitation, pattern recognition, integration, and practices for a centered presence." }, tagline: "The shape that holds.", paragraphs: ["Sovereign systems. Trust architecture. Asset protection. IP shielding. For creators with something real to protect. The container of all forms. The structure that ensures what you built outlasts you.", "Referral only. Minimum $50k/year revenue. The final gate."] },
] as const;

export default function WholeBodyEarthHome() {
  return <>
    <HomePlatonicLayer />
    <main id="main-content" className="relative z-10 isolate">
      <div aria-hidden="true" className="home-gradient-flow pointer-events-none absolute inset-0 -z-10" />

      <section id="hero" className={`${SECTION_SHELL} min-h-[calc(100svh-4rem)]`}>
        <div className="relative mx-auto max-w-6xl text-center [text-shadow:0_2px_28px_rgba(0,0,0,.96)]">
          <p className="font-mono text-[10px] uppercase tracking-[.32em] text-press sm:text-xs">The Whole Body Constellation</p>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl leading-[.94] font-medium text-bone sm:text-6xl lg:text-7xl">Five Pillars. One Whole Body.</h1>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-7 text-bone/78 sm:text-lg">
            <p>You have five bodies. Mental. Physical. Emotional. Spiritual. Ethereal. Each one maps to an element. Each element maps to a geometric solid. Each solid is a pillar of work.</p>
            <p>Wholebody.earth reads your birth chart and reveals which pillar is yours — then guides you to the practice, community, and work that fits your architecture.</p>
            <p className="text-bone/72">A network for sovereign creators.</p>
          </div>
          <Link href="/reading" className="whole-body-passport-cta mt-8 inline-block px-6 py-3 font-mono text-xs uppercase tracking-[.14em] text-void">Get Whole Body Passport →</Link>
          <a href="/pillars/studios/catalog" className="hero-scroll-cue mx-auto mt-10 flex w-fit flex-col items-center gap-2 text-press">
            <span className="font-mono text-[10px] uppercase tracking-[.24em]">Enter the Library</span>
            <span className="hero-scroll-cue-arrow flex h-10 w-6 items-center justify-center border border-press/55 text-xl">↓</span>
          </a>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[.16em] text-bone/75">🟢 Presence Active&nbsp;&nbsp;&nbsp; 🟢 Press Active&nbsp;&nbsp;&nbsp; 🟢 Studios Active<br className="sm:hidden" /> <span className="hidden sm:inline">&nbsp;&nbsp;&nbsp;</span>🟡 Foundation 2027&nbsp;&nbsp;&nbsp; 🔒 Guardian Soon</p>
        </div>
        <LiveCountdown hero />
      </section>
      <PulseBar />

      <section id="quincunx" className={SECTION_SHELL}>
        <div className="relative mx-auto max-w-3xl text-center [text-shadow:0_2px_20px_rgba(0,0,0,.9)]">
          <div className="mx-auto h-px w-16 bg-press/35" />
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[.28em] text-press">The Five Bodies</p>
          <h2 className="mt-4 font-display text-4xl text-press sm:text-5xl">You are not one thing. You are five forces held in one form.</h2>
          <div className="mt-6 space-y-3 text-left text-lg leading-8 text-bone/80">
            <p><strong className="text-bone">Spiritual</strong> — Fire. The drive to gather. The spark that says: you are not alone.</p>
            <p><strong className="text-bone">Mental</strong> — Air. The breath that carries words. The structure that turns thought into technology.</p>
            <p><strong className="text-bone">Emotional</strong> — Water. The memory that shapes who you become. The song that finds every crack.</p>
            <p><strong className="text-bone">Physical</strong> — Earth. The ground beneath what you build. The structure that outlasts you.</p>
            <p><strong className="text-bone">Ethereal</strong> — Ether. The space that holds it all. The silence between notes. The container of all forms.</p>
            <p className="pt-3 text-center">Five elements. Five Platonic solids. Five pillars of work. Each pillar is a part of you. Your reading reveals which one is yours.</p>
          </div>
          <Link href="/reading" className="mt-9 inline-block bg-fire px-6 py-3 font-mono text-xs uppercase tracking-[.14em] text-void shadow-[0_0_24px_rgba(209,107,69,.38)] transition hover:bg-fire/85">Take the Reading →</Link>
        </div>
      </section>

      {PILLARS.map((pillar) => <PillarSection key={pillar.id} pillar={pillar} />)}

      <section id="reading" className={`${SECTION_SHELL} min-h-[70svh]`}>
        <div className="relative mx-auto max-w-3xl text-center [text-shadow:0_2px_24px_rgba(0,0,0,.96)]">
          <div className="mx-auto h-px w-16 bg-press/35" />
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[.3em] text-press">Your design is waiting</p>
          <h2 className="mt-4 font-display text-4xl text-press sm:text-5xl">Find the pillar that is asking for you.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-bone/85">Enter your birth data. See your weighted Quincunx. Begin with a practice that meets you where you are.</p>
          <Link href="/reading" className="mt-9 inline-block bg-fire px-7 py-4 font-display text-lg text-void shadow-[0_0_28px_rgba(209,107,69,.42)] transition hover:bg-fire/85">Begin your reading →</Link>
        </div>
      </section>

      <FeaturedStrip />
      <ActivityFeed />

      <section className="relative border-t border-mercury px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-center font-mono text-[10px] uppercase tracking-[.3em] text-press">The Feed First Algorithm</p>
          <h2 className="mt-4 text-center font-display text-4xl text-bone sm:text-5xl">The creator eats before the platform. Always.</h2>
          <p className="mx-auto mt-7 max-w-2xl text-center text-lg leading-8 text-bone/80">Every dollar earned across the Constellation flows through the Feed First Algorithm.</p>
          <div className="mt-10 divide-y divide-mercury border-y border-mercury">
            {["35–40% — Creator Royalty Pool — Split among active creators", "20–25% — Guild Treasury — Equipment, editorial, studio, infrastructure", "20% — Guaranteed Stipend — Monthly minimum for active partners", "12–15% — Distribution & Infrastructure — Platform, hosting, software", "5–8% — Founder Allocation — Leadership compensation"].map((item) => <p key={item} className="px-4 py-4 font-mono text-xs uppercase tracking-[.08em] text-bone/80 sm:px-6">{item}</p>)}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-lg leading-8 text-bone/80">The Old World turned creativity into extraction. The publisher owns the words. The label owns the masters. The platform controls distribution. The creator rents their own voice. We invert this.</p>
        </div>
      </section>
    </main>
  </>;
}

type Pillar = (typeof PILLARS)[number];

function PillarSection({ pillar }: { pillar: Pillar }) {
  return <section id={pillar.id} className={SECTION_SHELL}>
    <div className="relative mx-auto w-full max-w-6xl">
    <div className="grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
      <div className="[text-shadow:0_2px_18px_rgba(0,0,0,.88)]">
        <p className="font-mono text-[10px] uppercase tracking-[.24em]" style={{ color: pillar.color }}>{pillar.symbol} {pillar.elementLabel} · {pillar.solid} · {pillar.body} · {pillar.faces} faces</p>
        <h2 className="mt-4 font-display text-5xl font-medium" style={{ color: pillar.color }}>{pillar.name}</h2>
        <p className="mt-2 font-display text-xl" style={{ color: pillar.color }}>{pillar.tagline}</p>
        <div className="mt-6 space-y-5 text-lg leading-8 text-bone/80">{pillar.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <Link href={pillar.href} className="mt-8 inline-block border px-5 py-3 font-mono text-xs uppercase tracking-[.12em] transition hover:bg-white/5" style={{ borderColor: pillar.color, color: pillar.color }}>Explore {pillar.name} →</Link>
      </div>
      <PillarDashboard pillar={pillar.id} />
    </div>
    <PillarJourneyLinks pillar={pillar.id} />
    </div>
  </section>;
}
