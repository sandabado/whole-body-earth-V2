import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {practitioners} from "../../components/data";

export function generateStaticParams() {
  return practitioners.map((person) => ({slug: person.slug}));
}

export default async function PractitionerProfile({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const person = practitioners.find((candidate) => candidate.slug === slug);
  if (!person) notFound();

  return (
    <div className="page profile-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/presence/practitioners">The keepers</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{person.name}</span>
      </nav>

      <section className="profile-hero profile-hero-rich" aria-labelledby="profile-name">
        <figure className="profile-photo">
          <Image
            src={person.image}
            alt={`Portrait of ${person.name}`}
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            priority
          />
          <figcaption>{person.location} · accepting beta requests</figcaption>
        </figure>
        <div className="profile-copy">
          <p className="eyebrow">{person.title}</p>
          <h1 id="profile-name">{person.name}</h1>
          <blockquote>“{person.quote}”</blockquote>
          <div className="tags" aria-label="Specialties">
            {person.tags.map((tag) => <b key={tag}>{tag}</b>)}
          </div>
          <p className="profile-bio">{person.bio}</p>
          <dl className="profile-facts">
            <div><dt>BASED</dt><dd>{person.location}</dd></div>
            <div><dt>FORMATS</dt><dd>{person.formats.join(" · ")}</dd></div>
            <div><dt>RATE</dt><dd>From {person.price}</dd></div>
          </dl>
          <Link className="button ember" href={`/presence/sessions/${person.slug}`}>
            REQUEST A SESSION <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="section profile-practice" aria-labelledby="practice-title">
        <div className="profile-practice-intro">
          <p className="eyebrow">THE PRACTICE</p>
          <h2 id="practice-title">Work paced by the body.</h2>
          <p>
            Sessions are deliberate, consensual, and paced by your nervous
            system—not a performance and never a race toward catharsis. You can
            pause, change direction, or stop at any point.
          </p>
        </div>
        <div className="credential-panel">
          <p className="eyebrow">TRAINING + CREDENTIALS</p>
          <ul className="marked-list">
            {person.credentials.map((credential) => <li key={credential}>{credential}</li>)}
          </ul>
          <p className="care-note">
            Credentials are shown so you can make an informed choice. A Presence
            session is not emergency care. If you are in immediate danger, contact
            local emergency services.
          </p>
        </div>
      </section>

      <section className="section session-options" aria-labelledby="session-options-title">
        <header className="section-title">
          <p className="eyebrow">SESSION OPTIONS</p>
          <h2 id="session-options-title">Choose the room you need.</h2>
          <p>In-person where offered, or encrypted virtual space through Proton Meet.</p>
        </header>
        <div className="pricing pricing-rich">
          {person.pricing.map((option) => (
            <article key={option.minutes}>
              <small>{option.duration}</small>
              <h3>{option.price}</h3>
              <p>{option.description}</p>
              <Link href={`/presence/sessions/${person.slug}?length=${option.minutes}`}>
                Choose {option.minutes} min <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-gallery" aria-labelledby="profile-gallery-title">
        <header>
          <p className="eyebrow">FIELD NOTES</p>
          <h2 id="profile-gallery-title">The work around the work.</h2>
        </header>
        <div className={`profile-gallery-grid profile-gallery-${person.gallery.length}`}>
          {person.gallery.map((image, index) => (
            <figure key={image}>
              <Image
                src={image}
                alt={`${person.name}'s practice environment, view ${index + 1}`}
                width={1000}
                height={1000}
                sizes="(max-width: 760px) 84vw, 50vw"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="profile-final-cta" aria-labelledby="profile-final-title">
        <span className="fire-glyph" aria-hidden="true">🜂</span>
        <div>
          <p className="eyebrow">BEGIN WITH A CONVERSATION</p>
          <h2 id="profile-final-title">You do not need to arrive certain.</h2>
          <p>Tell us what is moving. We will help you decide whether this is the right room.</p>
        </div>
        <Link className="button ember" href={`/presence/sessions/${person.slug}`}>
          REQUEST {person.name.split(" ")[0].toUpperCase()} <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
