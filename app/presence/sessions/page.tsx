import Image from "next/image";
import Link from "next/link";
import {practitioners} from "../components/data";

export default function SessionsPage() {
  return (
    <div className="page sessions-page">
      <header className="sessions-hero">
        <div className="sessions-hero-image">
          <Image
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1400&h=1100&q=85"
            alt="Quiet practice room in warm natural light"
            fill
            sizes="(max-width: 1000px) 100vw, 58vw"
            priority
          />
          <span>PRIVATE · CONSENSUAL · ENCRYPTED</span>
        </div>
        <div className="sessions-hero-copy">
          <p className="eyebrow">PRIVATE SESSIONS</p>
          <h1>One room. Two people. No performance.</h1>
          <p>
            Somatic work, breath, ceremony preparation, coaching, and integration—
            in person or through encrypted Proton Meet.
          </p>
          <a className="button ember" href="#choose-a-keeper">CHOOSE A KEEPER <span aria-hidden="true">↓</span></a>
        </div>
      </header>

      <section className="session-principles" aria-labelledby="session-principles-title">
        <div>
          <p className="eyebrow">THE PRIVATE ROOM</p>
          <h2 id="session-principles-title">Your pace is the pace.</h2>
        </div>
        <div className="principle-grid">
          <article><b>01</b><h3>Consent before intensity.</h3><p>You can pause, redirect, or stop at any point. The practitioner follows your nervous system, not an agenda.</p></article>
          <article><b>02</b><h3>Privacy by design.</h3><p>Virtual sessions use Proton Meet. Links are shared privately and open only for the scheduled room.</p></article>
          <article><b>03</b><h3>Integration after insight.</h3><p>The work is not measured by a dramatic moment. We make space for what follows in ordinary life.</p></article>
        </div>
      </section>

      <section className="section practitioner-sessions" id="choose-a-keeper" aria-labelledby="choose-title">
        <header className="section-title">
          <p className="eyebrow">CHOOSE YOUR KEEPER</p>
          <h2 id="choose-title">Trust the person, then the practice.</h2>
          <p>Read each profile. Notice who feels steady. You can ask a question before requesting time.</p>
        </header>
        <div className="session-grid session-grid-rich">
          {practitioners.map((person) => (
            <article key={person.slug}>
              <Link className="session-person-image" href={`/presence/practitioners/${person.slug}`} aria-label={`View ${person.name}'s profile`}>
                <Image
                  src={person.image}
                  alt=""
                  width={900}
                  height={1100}
                  sizes="(max-width: 520px) 100vw, (max-width: 760px) 39vw, 21vw"
                />
              </Link>
              <div>
                <small>{person.title}</small>
                <h2>{person.name}</h2>
                <p>{person.bio}</p>
                <div className="tags" aria-label="Specialties">
                  {person.tags.map((tag) => <b key={tag}>{tag}</b>)}
                </div>
                <dl className="session-card-facts">
                  <div><dt>FORMAT</dt><dd>{person.formats.join(" · ")}</dd></div>
                  <div><dt>RATE</dt><dd>From {person.price}</dd></div>
                </dl>
                <div className="session-card-actions">
                  <Link className="button ember" href={`/presence/sessions/${person.slug}`}>REQUEST TIME <span aria-hidden="true">→</span></Link>
                  <Link className="text-link" href={`/presence/practitioners/${person.slug}`}>Full profile</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="session-care-note" aria-labelledby="care-note-title">
        <span className="fire-glyph" aria-hidden="true">🜂</span>
        <div>
          <p className="eyebrow">A CLEAR BOUNDARY</p>
          <h2 id="care-note-title">Presence is care. It is not crisis response.</h2>
          <p>
            Private sessions do not replace emergency, medical, or psychiatric care.
            If you are in immediate danger, contact local emergency services or a
            crisis resource in your area.
          </p>
        </div>
        <Link className="button" href="/presence/code">READ OUR CODE</Link>
      </section>
    </div>
  );
}
