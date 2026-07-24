"use client";

import Link from "next/link";
import {useMemo, useState} from "react";
import {events} from "../components/data";

const eventFilters = ["All", "Retreat", "Gathering", "Intensive", "Training", "Virtual"] as const;

export function EventDirectory() {
  const [activeFilter, setActiveFilter] = useState<(typeof eventFilters)[number]>("All");
  const visibleEvents = useMemo(
    () => activeFilter === "All" ? events : events.filter((event) => event.kind === activeFilter),
    [activeFilter],
  );

  return (
    <section className="section event-directory" aria-labelledby="event-directory-title">
      <div className="directory-toolbar">
        <div>
          <p className="eyebrow">THE CALENDAR</p>
          <h2 id="event-directory-title">Choose your gathering.</h2>
        </div>
        <div className="filter-pills" role="group" aria-label="Filter events by type">
          {eventFilters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={activeFilter === filter ? "active" : ""}
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="event-grid event-grid-rich" aria-live="polite">
        {visibleEvents.map((event) => (
          <article className="event-card event-card-rich" key={event.slug}>
            <Link className="image-wrap" href={`/presence/events/${event.slug}`} aria-label={`View ${event.title}`}>
              <img src={event.image} alt="" loading="lazy" />
              <span>{event.kind}</span>
            </Link>
            <div className="card-copy">
              <small>{event.date}</small>
              <h3><Link href={`/presence/events/${event.slug}`}>{event.title}</Link></h3>
              <p>{event.description}</p>
              <dl>
                <div><dt>PLACE</dt><dd>{event.location}</dd></div>
                <div><dt>FEE</dt><dd>{event.price}</dd></div>
                <div><dt>OPEN</dt><dd>{event.availability}</dd></div>
              </dl>
              <Link className="text-link" href={`/presence/events/${event.slug}`}>
                View full gathering <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
