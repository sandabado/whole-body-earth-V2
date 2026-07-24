import Link from "next/link";
import { FireHero } from "./FireHero/FireHero";
import { HomeMotion } from "./HomeMotion";

const pillars = [
  { slug: "ignition", glyph: "🜂", name: "Mental", element: "Fire", need: "I feel stuck", copy: "Catalytic change. Heat enough to begin again." },
  { slug: "grounding", glyph: "🜃", name: "Physical", element: "Earth", need: "I feel overwhelmed", copy: "Safety, embodiment, and the steady intelligence of the body." },
  { slug: "union", glyph: "☉", name: "Ethereal", element: "Aether", need: "I feel disconnected", copy: "Integration, belonging, and the place where everything meets." },
  { slug: "ascension", glyph: "🜁", name: "Spiritual", element: "Air", need: "I need perspective", copy: "Breath, spaciousness, and expanded awareness." },
  { slug: "release", glyph: "🜄", name: "Emotional", element: "Water", need: "I need to let go", copy: "Grief, surrender, emotional clearing, and flow." },
] as const;

const houses = [
  ["I", "Self & Identity", "Who am I beneath the roles?"],
  ["II", "Body & Resources", "What sustains me?"],
  ["III", "Communication & Breath", "How do I express and move?"],
  ["IV", "Home & Roots", "Where do I belong?"],
  ["V", "Creative Fire", "What wants to be born?"],
  ["VI", "Daily Practice & Health", "How do I sustain the work?"],
  ["VII", "Relational & Partnership", "How do I meet the other?"],
  ["VIII", "Death & Rebirth", "What must die for me to live?"],
  ["IX", "Wisdom & Expansion", "What do I seek to understand?"],
  ["X", "Purpose & Calling", "What am I here to build?"],
  ["XI", "Community & Vision", "What are we building together?"],
  ["XII", "Surrender & Dissolution", "What must I release to rest?"],
] as const;

const offerings = [
  { pillar: "Ignition", house: "House V", title: "Creative Fire Activation", keeper: "Jesse Gawlik", detail: "Morongo Valley · 12 seats", tone: "ignition" },
  { pillar: "Grounding", house: "House IV", title: "Roots & Ancestral Healing", keeper: "Shannon V.", detail: "Desert Studio · 10 seats", tone: "grounding" },
  { pillar: "Union", house: "House XI", title: "Community Moon Circle", keeper: "Sarah Veya", detail: "Los Angeles · 20 seats", tone: "union" },
] as const;

const voices = [
  ["Kate M.", "Remote", "Like exhaling a breath I did not know I was holding."],
  ["Raul S.", "Morongo Valley", "No fixing. No advice. Just enough space for what was true."],
  ["Lena K.", "Los Angeles", "The desert did the work. The keepers simply kept the fire burning."],
] as const;

function Heading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <header className="elevation-heading" data-home-reveal>
      <p className="eyebrow" data-typewriter>{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </header>
  );
}

function PhotoPlaceholder({ label, note }: { label: string; note: string }) {
  return (
    <div className="honest-photo" role="img" aria-label={`${label}. ${note}`}>
      <span className="honest-photo__mark">☉</span>
      <strong>{label}</strong>
      <small>{note}</small>
    </div>
  );
}

export function HomeExperience() {
  return (
    <div className="home-experience elevation-home">
      <HomeMotion />
      <div className="threshold" aria-hidden="true"><span>YOU HAVE ARRIVED.</span></div>
      <div className="cursor-warmth" aria-hidden="true" />
      <FireHero />

      <section className="elevation-way" id="way-of-fire">
        <div className="elevation-way__sigil" data-home-reveal aria-hidden="true">
          <span>🜂</span><i /><i /><i />
        </div>
        <div data-home-reveal>
          <p className="eyebrow" data-typewriter>02 · The way of fire</p>
          <h2>Not extraction.<br />Transformation.</h2>
          <p>Presence is not a marketplace for feeling better. It is a place to become honest again—held by real people, in real rooms, through work the body can recognize.</p>
          <blockquote>“Fire does not consume. Fire transforms.”</blockquote>
          <Link className="home-text-link" href="/presence/about">Enter the philosophy <span>→</span></Link>
        </div>
      </section>

      <section className="quincunx-section" id="quincunx">
        <Heading eyebrow="03 · The quincunx" title="Five energies. One fire." copy="Begin with what your body is asking for. The compass will show you a way in." />
        <div className="quincunx" data-home-reveal>
          <div className="quincunx__geometry" aria-hidden="true"><i /><i /><i /><i /></div>
          {pillars.map((pillar) => (
            <Link className={`quincunx__point quincunx__point--${pillar.slug}`} href={`/presence/events?pillar=${pillar.slug}`} key={pillar.slug}>
              <span>{pillar.glyph}</span>
              <strong>{pillar.name}</strong>
              <small>{pillar.element} · {pillar.need}</small>
              <em>{pillar.copy}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="houses-section" id="houses">
        <Heading eyebrow="04 · The dodecanic houses" title="Which house of your life calls for fire?" copy="Twelve domains of the self. Choose the room where the work is waiting." />
        <div className="houses-grid">
          {houses.map(([number, name, question], index) => (
            <Link href={`/presence/events?house=${index + 1}`} className="house-card" data-home-reveal key={number}>
              <span>{number}</span><strong>{name}</strong><p>{question}</p><i>Enter this house →</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="elevation-offerings">
        <Heading eyebrow="05 · Upcoming offerings" title="The work has a time and a place." copy="Each offering carries an energy and a house. Filter by either—or follow the one that feels warm." />
        <div className="generative-grid">
          {offerings.map((offering) => (
            <Link href={`/presence/events?pillar=${offering.tone}`} className="generative-card" data-home-reveal key={offering.title}>
              <div className={`generative-art generative-art--${offering.tone}`}><i /><i /><i /></div>
              <div className="generative-card__copy">
                <p>{offering.pillar} · {offering.house}</p>
                <h3>{offering.title}</h3>
                <span>{offering.keeper}</span><small>{offering.detail}</small>
                <strong>Reserve your seat →</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="keepers-elevated">
        <Heading eyebrow="06 · The keepers" title="Hands that hold space." copy="These are not influencers. These are people who have done their own work and now hold space for yours." />
        <div className="keeper-placeholder-grid">
          {["Jesse Gawlik", "Shannon V.", "Marcus Reed"].map((name, index) => (
            <Link href="/presence/practitioners" className="keeper-placeholder-card" data-home-reveal key={name}>
              <PhotoPlaceholder label="PRACTITIONER SELF-PORTRAIT" note="Taken by the keeper · awaiting submission" />
              <p>{index === 0 ? "Grounding · Ignition" : index === 1 ? "Release · Grounding" : "Ascension · Ignition"}</p>
              <h3>{name}</h3><span>Meet this keeper →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="journey-section">
        <Heading eyebrow="07 · The process" title="A ceremony, not a funnel." />
        <div className="journey-line">
          {[
            ["01", "Discover", "Notice what calls."],
            ["02", "Reserve", "Choose your place with intention."],
            ["03", "Arrive", "Bring your whole self."],
            ["04", "Integrate", "Carry the work into life."],
          ].map(([n, title, copy]) => <article data-home-reveal key={n}><b>{n}</b><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="voices-section">
        <Heading eyebrow="08 · Voices" title="What remains after the fire." />
        <div className="voices-grid">
          {voices.map(([name, place, quote]) => (
            <figure data-home-reveal key={name}><blockquote>“{quote}”</blockquote><figcaption><PhotoPlaceholder label="MEMBER PHOTO" note="Consent required · awaiting submission" /><span><strong>{name}</strong><small>{place}</small></span></figcaption></figure>
          ))}
        </div>
      </section>

      <section className="fire-awaits">
        <div data-home-reveal>
          <p className="eyebrow" data-typewriter>09 · The fire awaits</p>
          <span className="fire-awaits__glyph">🜂</span>
          <h2>Someone has saved you a seat.</h2>
          <p>Come when you are ready. Presence does not interrupt. It waits.</p>
          <div><Link className="button ember" href="/presence/sessions">Reserve a session</Link><Link className="button" href="/presence/waitlist">Add your name to the fire</Link></div>
          <small>We protect your data. We do not sell it. We do not track you.</small>
        </div>
      </section>
    </div>
  );
}
