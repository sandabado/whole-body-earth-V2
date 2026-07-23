import Link from "next/link";
import HeroEngine from "./components/HeroEngine/HeroEngine";
import PressHeadlineOverlay from "./components/HeroEngine/controls/PressHeadlineOverlay";
import { Ticker } from "./components/Ticker";
import { TitleCard } from "./components/TitleCard";
import {
  editionTiers,
  getAuthor,
  pressCategories,
  pressEvents,
  pressTitles,
} from "./components/press-catalog";

const revenue = [
  ["Author Royalty Pool", 35],
  ["Guild Treasury", 25],
  ["Author Stipend", 20],
  ["Distribution & Infra", 12],
  ["Founder Allocation", 8],
] as const;

export default function Home() {
  const spotlight = getAuthor("marcus");

  return (
    <div>
      <HeroEngine siteSlug="press" ariaLabel="Whole Body Press — sand and wind carry the signal">
        <div className="hero-index">WB/P — AIR 001</div>
        <PressHeadlineOverlay
          headline="WORDS THAT OUTLIVE THE SPEAKER"
          subhead="We publish texts rooted in wisdom traditions, somatic practice, ecological thinking, and creative rebellion. Each edition is crafted to last. Authors retain 100% of their IP. We earn on production and placement—never on ownership. The writer eats first. Always."
          metaLines={["WHOLE BODY PRESS · AIR RAY · FIRST EDITIONS"]}
        />
        <div className="hero-coordinate"><span>34.0467° N</span><i/><span>116.5804° W</span></div>
        <div className="air-scroll" aria-hidden="true"><span>DESCEND INTO THE CATALOG</span><i /></div>
      </HeroEngine>

      <Ticker />

      <section className="press-section press-intro">
        <p className="eyebrow">THE PUBLISHING CODE</p>
        <h2>We do not own the signal.<br />We carry it.</h2>
        <div>
          <p>Whole Body Press publishes texts that function as durable companions: rooted in practice, made with physical care, and designed to compound value over time.</p>
          <p>Authors retain their copyright, translation rights, and adaptation rights. We earn on production and distribution—never on ownership. <strong>The writer eats first.</strong></p>
        </div>
      </section>

      <section className="press-section" id="new-releases">
        <div className="press-section-head">
          <div>
            <p className="eyebrow">NEW & FORTHCOMING</p>
            <h2>First editions.</h2>
          </div>
          <Link href="/press/catalog" className="text-link">VIEW FULL CATALOG →</Link>
        </div>
        <div className="title-grid">
          {pressTitles.slice(0, 4).map((title) => <TitleCard key={title.slug} title={title} />)}
        </div>
      </section>

      {spotlight && (
        <section className="press-section author-spotlight">
          <div className="author-portrait author-portrait--large" aria-label={`Portrait placeholder for ${spotlight.name}`}>
            <span>{spotlight.initials}</span>
            <i aria-hidden="true" />
            <small>PORTRAIT / FORTHCOMING</small>
          </div>
          <div>
            <p className="eyebrow">AUTHOR SPOTLIGHT</p>
            <h2>{spotlight.name}</h2>
            <p className="mono-meta">{spotlight.credentials}</p>
            <p className="spotlight-bio">{spotlight.shortBio}</p>
            <blockquote>“{spotlight.quote}”</blockquote>
            <div className="hero-actions">
              <Link className="button gold" href={`/press/authors/${spotlight.slug}`}>AUTHOR PROFILE →</Link>
              <Link className="button" href="/press/events">EVENTS →</Link>
            </div>
          </div>
        </section>
      )}

      <section className="press-section">
        <div className="press-section-head">
          <div>
            <p className="eyebrow">UPCOMING</p>
            <h2>Meet at the page.</h2>
          </div>
          <Link href="/press/events" className="text-link">ALL EVENTS →</Link>
        </div>
        <div className="event-list">
          {pressEvents.map((event) => (
            <article key={event.id} className="event-row">
              <div><span>{event.type}</span><strong>{event.date}</strong></div>
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <span className="event-price">{event.price ? `$${event.price}` : "FREE"}</span>
              <Link href={`/press/events/${event.id}`} className="text-link">REGISTER →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="craft-band">
        <div className="craft-materials" aria-label="Bookmaking material study">
          <div className="material-sheet"><span>100G</span><small>ACID-FREE / UNCOATED</small></div>
          <div className="material-cloth"><span>🜁</span><small>BOOK CLOTH / GOLD FOIL</small></div>
          <div className="material-thread"><i /><i /><i /><small>SMYTH-SEWN / THREAD</small></div>
        </div>
        <div>
          <p className="eyebrow">THE CRAFT</p>
          <h2>Made to be used,<br />loved, kept.</h2>
          <p>Every Press edition begins with acid-free uncoated paper. Hardcover editions add cloth, ribbon markers, and foil-stamped spines. Limited editions are stitched, numbered, and signed.</p>
          <p>We do not optimize every thought for a screen. Some ideas deserve weight, texture, and permanence.</p>
          <Link href="/press/craft" className="button gold">SEE PRODUCTION PROCESS →</Link>
        </div>
      </section>

      <section className="press-section edition-spectrum">
        <div className="press-section-head">
          <div><p className="eyebrow">THE EDITIONS</p><h2>Choose the object.</h2></div>
          <p>One text can move through six physical expressions without surrendering ownership.</p>
        </div>
        <div className="edition-grid">
          {editionTiers.map((tier, index) => (
            <article key={tier.name}>
              <span>0{index + 1}</span>
              <h3>{tier.name}</h3>
              <strong>{tier.range}</strong>
              <p>{tier.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="press-section">
        <div className="press-section-head">
          <div><p className="eyebrow">CATALOG BY PRACTICE</p><h2>Six fields of work.</h2></div>
          <p>Enter by subject, then follow the author, imprint, or material that carries you further.</p>
        </div>
        <div className="category-grid">
          {pressCategories.map((category) => (
            <Link href={`/press/catalog?category=${encodeURIComponent(category.name)}`} key={category.name} className={`category-card category-card--${category.tone}`}>
              <span aria-hidden="true">{category.glyph}</span>
              <div><h3>{category.name}</h3><p>{category.note}</p></div>
              <i>→</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="press-section submissions-callout">
        <div>
          <p className="eyebrow">SUBMIT YOUR MANUSCRIPT</p>
          <h2>We publish texts<br />that do not expire.</h2>
          <p>Rooted in practice. Written for return. Strong enough to become a paperback, a hardcover, or an object made by hand.</p>
          <Link className="button gold" href="/press/submit">SUBMIT MANUSCRIPT →</Link>
        </div>
        <div className="criteria-panel">
          <p className="mono-meta">WHAT WE SEEK</p>
          <ul>
            <li>Practice lived before it was written</li>
            <li>Respect for the reader’s intelligence</li>
            <li>25,000–100,000 words, with exceptions</li>
            <li>Multiple formats handled gracefully</li>
            <li>Author-owned, non-exclusive distribution</li>
          </ul>
          <p className="mono-meta">90-DAY RESPONSE · 6–12 MONTH FIRST EDITION</p>
        </div>
      </section>

      <section className="feed-first">
        <div className="feed-first__copy">
          <p className="eyebrow">FEED FIRST / PUBLISHING</p>
          <h2>The old world rented the writer their own voice.</h2>
          <p>Whole Body Press inverts it. Authors retain copyright, translations, audio, and screen rights. We earn on production fees and distribution commission—never on ownership.</p>
          <strong>The writer eats first. Always.</strong>
        </div>
        <div className="revenue-bars" aria-label="Feed First revenue allocation">
          {revenue.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span><b>{value}%</b>
              <i><em style={{ width: `${value * 2.7}%` }} /></i>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
