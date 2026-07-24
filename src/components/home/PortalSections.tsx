import Link from "next/link";
import { HomeTopFieldLayers } from "./HomeTopFieldLayers";

const BODIES = [
  { name: "Spiritual", element: "Fire", symbol: "🜂", color: "#d16b45", copy: "The drive to gather. The spark that says: you are not alone." },
  { name: "Mental", element: "Air", symbol: "🜁", color: "#d4af37", copy: "The breath that carries words. Thought becomes technology." },
  { name: "Emotional", element: "Water", symbol: "🜄", color: "#2ba8a0", copy: "The memory that shapes who you become. Song finds every crack." },
  { name: "Physical", element: "Earth", symbol: "🜃", color: "#84a66e", copy: "The ground beneath what you build. Structure outlasts you." },
  { name: "Ethereal", element: "Ether", symbol: "☉", color: "#8f5bff", copy: "The space that holds it all. Silence between notes." },
];

const APPLICATION_ROUTES = [
  { title: "Artist application", copy: "For musicians, authors, and filmmakers with work to bring.", meta: "Portfolio required", href: "/apply?pillar=studios", symbol: "🜄", color: "#2ba8a0", cta: "Apply →" },
  { title: "Member application", copy: "For participants seeking a practice, circle, or shared field.", meta: "Choose your pillar", href: "/membership", symbol: "🜂", color: "#d16b45", cta: "Join →" },
  { title: "Partner application", copy: "For organizations and stewards with something real to protect.", meta: "Referral preferred", href: "/apply?pillar=guardian", symbol: "☉", color: "#8f5bff", cta: "Refer →" },
];

export function FiveBodies() {
  return (
    <section id="five-bodies" className="relative isolate overflow-hidden px-5 py-16 sm:px-6 sm:py-20 md:py-28">
      <HomeTopFieldLayers />
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-press">The framework</p>
        <h2 className="mt-4 font-display text-4xl font-medium text-bone sm:text-5xl">You are made of five bodies.</h2>
        <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-bone/75">Five elements. Five Platonic solids. Five pillars of work. Each pillar is a part of you. Your reading reveals which one is yours.</p>
        <Link href="/reading" className="whole-body-passport-cta mt-8 inline-block px-5 py-3 font-mono text-xs uppercase tracking-[.12em] text-void">Get Whole Body Passport →</Link>
        <div className="mt-9 grid overflow-hidden border border-mercury sm:mt-12 sm:grid-cols-5">
          {BODIES.map((body, index) => (
            <article key={body.name} className={`group relative min-h-0 border-mercury bg-void/25 p-5 text-left backdrop-blur-sm transition duration-300 hover:bg-carbon/80 sm:min-h-80 ${index < BODIES.length - 1 ? "border-b sm:border-r sm:border-b-0" : ""}`} style={{ "--body-color": body.color } as React.CSSProperties}>
              <span aria-hidden="true" className="alchemical-glyph text-4xl" style={{ color: body.color }}>{body.symbol}</span>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[.15em] sm:mt-8" style={{ color: body.color }}>{body.element}</p>
              <h3 className="mt-2 font-display text-xl text-bone">{body.name}</h3>
              <p className="mt-4 text-sm leading-6 text-bone/70">{body.copy}</p>
              <span aria-hidden="true" className="absolute right-5 bottom-0 left-5 h-px origin-left scale-x-0 bg-[var(--body-color)] transition-transform duration-300 group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApplySection() {
  return (
    <section id="apply" className="home-constellation-section relative overflow-hidden border-y border-mercury/70 px-5 py-16 sm:px-6 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-water">Join the Constellation</p>
        <h2 className="mt-4 font-display text-5xl font-medium leading-[.95] text-bone sm:text-6xl">The Center Is You.</h2>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[.16em] text-ghost">Three paths to belong. Not employment.</p>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-bone/75">Are you looking for network membership? Choose your path below.</p>
        <Link href="/careers" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-[.12em] text-water transition hover:text-bone">Looking for work at the Constellation? View open positions →</Link>
        <div className="mx-auto mt-9 grid max-w-5xl gap-5 md:mt-12 md:grid-cols-3 md:gap-8">
          {APPLICATION_ROUTES.map((route) => (
            <Link key={route.title} href={route.href} className="group relative flex min-h-[18rem] flex-col items-center overflow-hidden border border-mercury bg-steel/85 p-6 text-center transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,.32)] sm:p-8 md:min-h-[22rem]" style={{ "--application-color": route.color, borderColor: "var(--mercury)" } as React.CSSProperties}>
              <span className="flex h-16 w-16 items-center justify-center border text-3xl" style={{ borderColor: `${route.color}99`, color: route.color }}>{route.symbol}</span>
              <h3 className="mt-7 font-display text-2xl font-medium text-bone">{route.title}</h3>
              <p className="mt-4 text-sm leading-6 text-bone/70">{route.copy}</p>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[.13em] text-ghost">{route.meta}</p>
              <span className="mt-auto pt-7 font-mono text-[10px] uppercase tracking-[.12em]" style={{ color: route.color }}>{route.cta}</span>
              <span aria-hidden="true" className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-[var(--application-color)]" />
            </Link>
          ))}
        </div>
        <p className="mt-10 font-mono text-xs uppercase tracking-[.16em] text-ghost">Three paths. One constellation.</p>
        <div className="mx-auto mt-14 max-w-2xl border-t border-mercury pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-ghost">Looking for employment?</p>
          <p className="mt-4 text-sm leading-6 text-bone/70">Employment is separate from membership. Explore open roles at Whole Body Earth and bring your work to the Guild.</p>
          <Link href="/careers" className="mt-6 inline-block border border-water px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-water transition hover:bg-water hover:text-void">View open positions →</Link>
        </div>
      </div>
    </section>
  );
}
