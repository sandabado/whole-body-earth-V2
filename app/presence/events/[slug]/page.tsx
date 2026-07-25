import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {events} from "../../components/data";

export function generateStaticParams() {
  return events.map((event) => ({slug: event.slug}));
}

export default async function EventDetail({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const event = events.find((candidate) => candidate.slug === slug);
  if (!event) notFound();

  return (
    <div className="page event-detail-page">
      <nav className="crumbs crumbs-overlay" aria-label="Breadcrumb">
        <Link href="/presence/events">Gatherings</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{event.title}</span>
      </nav>

      <header className="detail-hero event-detail-hero">
        <Image
          src={event.image}
          alt={`Atmosphere for ${event.title} in ${event.location}`}
          fill
          sizes="100vw"
          priority
        />
        <div className="event-hero-veil" aria-hidden="true" />
        <div className="event-detail-hero-copy">
          <p className="eyebrow">{event.kind} · {event.date}</p>
          <h1>{event.title}</h1>
          <p>{event.location}{event.venue ? ` · ${event.venue}` : ""}</p>
          <span className="hero-availability"><i aria-hidden="true" /> {event.availability}</span>
        </div>
      </header>

      <div className="event-detail event-detail-rich">
        <div className="event-story">
          <section className="event-prose" aria-labelledby="experience-title">
            <p className="eyebrow">THE EXPERIENCE</p>
            <h2 id="experience-title">When the room is ready, we begin.</h2>
            {event.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>

          <section className="facilitator-section" aria-labelledby="facilitators-title">
            <p className="eyebrow">THE KEEPERS</p>
            <h2 id="facilitators-title">Who holds this gathering.</h2>
            <div className="facilitator-list">
              {event.facilitators.map((facilitator) => (
                <article key={facilitator.name}>
                  <span className="facilitator-mark" aria-hidden="true">🜂</span>
                  <div>
                    <h3>
                      {facilitator.slug ? (
                        <Link href={`/presence/practitioners/${facilitator.slug}`}>{facilitator.name}</Link>
                      ) : facilitator.name}
                    </h3>
                    <p>{facilitator.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="event-schedule" aria-labelledby="schedule-title">
            <p className="eyebrow">THE RHYTHM</p>
            <h2 id="schedule-title">What the time holds.</h2>
            <p className="schedule-note">Timings may breathe with the group. The shape of the experience will remain.</p>
            <div className="schedule-days">
              {event.schedule.map((day) => (
                <details className="schedule-day" key={day.label} open>
                  <summary>{day.label}<span aria-hidden="true">＋</span></summary>
                  <ol>
                    {day.items.map((item) => (
                      <li key={`${item.time}-${item.activity}`}>
                        <time>{item.time}</time>
                        <span>{item.activity}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </section>

          <section className="event-inclusions" aria-labelledby="inclusions-title">
            <p className="eyebrow">THE PRACTICALS</p>
            <h2 id="inclusions-title">Know before you arrive.</h2>
            <div className="inclusion-grid">
              <div>
                <h3>Held for you</h3>
                <ul className="marked-list included-list">
                  {event.included.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h3>Bring or arrange</h3>
                <ul className="marked-list excluded-list">
                  {event.notIncluded.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {(event.scholarshipTerms || event.refundPolicy) && (
            <section className="policy-grid" aria-label="Scholarship and refund terms">
              {event.scholarshipTerms && (
                <article>
                  <p className="eyebrow">SCHOLARSHIP TERMS</p>
                  <h3>Access is part of the work.</h3>
                  <p>{event.scholarshipTerms}</p>
                </article>
              )}
              <article>
                <p className="eyebrow">REFUND POLICY</p>
                <h3>Plans change. Here is the line.</h3>
                <p>{event.refundPolicy}</p>
              </article>
            </section>
          )}
        </div>

        <aside className="reservation-card" aria-labelledby="reservation-title">
          <div className="reservation-status"><i aria-hidden="true" /> INVITE-ONLY BETA · DEC 2026</div>
          <p className="eyebrow" id="reservation-title">INVESTMENT</p>
          <strong>{event.price}</strong>
          {event.scholarship && <small>SCHOLARSHIP · {event.scholarship}</small>}
          <dl>
            <div><dt>DATE</dt><dd>{event.date}</dd></div>
            <div><dt>PLACE</dt><dd>{event.location}</dd></div>
            <div><dt>VENUE</dt><dd>{event.venue ?? "Shared after booking"}</dd></div>
            <div><dt>CAPACITY</dt><dd>{event.capacity}</dd></div>
            <div><dt>OPEN</dt><dd>{event.availability}</dd></div>
          </dl>
          <form action="/presence/waitlist" method="get" className="reservation-interest">
            <input type="hidden" name="event" value={event.slug} />
            <fieldset>
              <legend>REQUEST TYPE</legend>
              <label>
                <input type="radio" name="request" value="general" defaultChecked />
                <span><b>General place</b><small>{event.price}</small></span>
              </label>
              {event.scholarship && (
                <label>
                  <input type="radio" name="request" value="scholarship" />
                  <span><b>Scholarship interest</b><small>{event.scholarship}</small></span>
                </label>
              )}
            </fieldset>
            <button className="button ember" type="submit">REQUEST EARLY ACCESS <span aria-hidden="true">→</span></button>
          </form>
          <p className="no-charge-note">No payment is taken and no place is held today. We will write when booking opens.</p>
          <Link className="button" href="/presence/contact">ASK A QUESTION</Link>
        </aside>
      </div>

      <section className="event-gallery" aria-labelledby="event-gallery-title">
        <header>
          <p className="eyebrow">THE PLACE</p>
          <h2 id="event-gallery-title">A glimpse of the field.</h2>
        </header>
        <div className={`event-gallery-grid event-gallery-${event.images.length}`}>
          {event.images.map((image, index) => (
            <figure key={`${image}-${index}`}>
              <Image
                src={image}
                alt={`${event.title}, atmosphere ${index + 1}`}
                width={1600}
                height={1067}
                sizes="(max-width: 760px) 84vw, 33vw"
              />
            </figure>
          ))}
        </div>
      </section>

      <a className="mobile-reserve" href="#reservation-title">
        <span><small>FROM</small>{event.price}</span>
        <b>REQUEST A PLACE →</b>
      </a>
    </div>
  );
}
