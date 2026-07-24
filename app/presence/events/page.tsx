import Link from "next/link";
import {events} from "../components/data";
import {EventDirectory} from "./EventDirectory";

export default function EventsPage() {
  const featured = events.find((event) => event.featured) ?? events[0];

  return (
    <div className="page events-page">
      <header className="image-hero events-hero">
        <img
          src={featured.image}
          alt="A small fire circle gathering in the high desert at dusk"
        />
        <div className="event-hero-veil" aria-hidden="true" />
        <div className="events-hero-copy">
          <p className="eyebrow">RETREATS · CIRCLES · TRAININGS</p>
          <h1>Meet us at the fire.</h1>
          <p>Small groups. Open sky. Honest work. Choose the room that meets you where you are.</p>
        </div>
      </header>

      <section className="featured-event" aria-labelledby="featured-event-title">
        <Link href={`/presence/events/${featured.slug}`} className="featured-event-image" aria-label={`View ${featured.title}`}>
          <img src={featured.image} alt={`Atmosphere for ${featured.title}`} />
          <span className="event-badge">★ FEATURED RETREAT</span>
          <span className="availability-badge"><i aria-hidden="true" /> {featured.availability}</span>
        </Link>
        <div className="featured-event-copy hud-panel">
          <p className="eyebrow">{featured.date} · {featured.location}</p>
          <h2 id="featured-event-title">{featured.title}</h2>
          <p>{featured.description}</p>
          <dl className="feature-facts">
            <div><dt>INVESTMENT</dt><dd>{featured.price}</dd></div>
            <div><dt>SCHOLARSHIP</dt><dd>{featured.scholarship}</dd></div>
            <div><dt>CAPACITY</dt><dd>{featured.capacity}</dd></div>
          </dl>
          <blockquote>“This was not what I expected. It was better.” <cite>— Lena K., past participant</cite></blockquote>
          <Link className="button ember" href={`/presence/events/${featured.slug}`}>
            ENTER THE RETREAT <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <EventDirectory />

      <section className="events-footer-note" aria-labelledby="events-note-title">
        <p className="eyebrow">BEFORE YOU ARRIVE</p>
        <h2 id="events-note-title">Nothing hidden. Nothing pushed.</h2>
        <p>
          Every event page includes the complete rhythm, fee, capacity, facilitators,
          scholarship terms, and refund policy before you request a place.
        </p>
        <Link className="text-link" href="/presence/code">Read the community code <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
