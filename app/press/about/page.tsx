import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Whole Body Press publishes author-owned texts rooted in practice, ecological thinking, and creative rebellion.",
};

const values = [
  ["Permanence", "No subscription, rental, or DRM lock. A purchased edition remains the reader’s."],
  ["Ownership", "Authors retain copyright, translation, audio, adaptation, and screen rights."],
  ["Practice", "We publish work lived before it was packaged into theory."],
  ["Material", "Paper, binding, margins, and typography are editorial decisions—not decoration."],
] as const;

const imprints = [
  ["Root Editions", "Somatic practice, ceremony, bodywork, and texts built for repeated use."],
  ["Desert Press", "Ecology, land, enterprise, field reports, and creative rebellion."],
  ["Frequency Imprint", "Collaboration, resonance, translation, classics, and experimental forms."],
  ["Ceremonial Objects", "Commissioned editions where binding, inscription, and ritual material are part of the work."],
] as const;

export default function AboutPage() {
  return (
    <div className="page press-page">
      <header className="press-page-hero">
        <p className="eyebrow">ABOUT / THE AIR RAY</p>
        <h1>We carry<br />the signal.</h1>
        <p>Whole Body Press is the publishing arm of the Whole Body Constellation: an author-owned house for texts that deserve durable form.</p>
      </header>

      <section className="press-section about-statement">
        <p className="eyebrow">THE MISSION</p>
        <div>
          <h2>A publishing house should leave the writer more sovereign.</h2>
          <div className="reading-text">
            <p>The old contract treated copyright as the price of admission. The platform controlled distribution; the writer rented their own voice.</p>
            <p>Press separates service from ownership. We edit, design, produce, place, and distribute. The author keeps the intellectual property. Our economics are visible enough to inspect and specific enough to challenge.</p>
            <p>The result is not a stream of content. It is a catalog with memory: books rooted in somatic practice, ecological thinking, wisdom traditions, and creative rebellion.</p>
          </div>
        </div>
      </section>

      <section className="press-section press-section--ruled">
        <div className="press-section-head"><div><p className="eyebrow">CODE OF PRACTICE</p><h2>Four commitments.</h2></div></div>
        <div className="about-values">
          {values.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="press-section press-section--ruled">
        <div className="press-section-head"><div><p className="eyebrow">THE IMPRINTS</p><h2>Distinct rooms<br />in one house.</h2></div></div>
        <div className="imprint-grid">
          {imprints.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="feed-first">
        <div className="feed-first__copy"><p className="eyebrow">THE WHOLE BODY CONSTELLATION</p><h2>One body. Several systems.</h2><p>Press carries ideas into durable form. Studios gives sound a room. Presence gathers people around the fire. Foundation holds the ground. Guardian protects the agreements. Whole maps the complete constellation.</p></div>
        <div className="constellation-links"><Link href="/">WHOLE / ROOT <span>→</span></Link><Link href="/foundation">FOUNDATION / EARTH <span>→</span></Link><Link href="/studios">STUDIOS / WATER <span>→</span></Link><Link href="/presence">PRESENCE / FIRE <span>→</span></Link><Link href="/guardian">GUARDIAN / ETHER <span>→</span></Link></div>
      </section>

      <section className="press-footer-cta"><p className="eyebrow">THE FIRST CATALOG</p><h2>Enter through the work.</h2><Link className="button gold" href="/press/catalog">EXPLORE CATALOG →</Link></section>
    </div>
  );
}
