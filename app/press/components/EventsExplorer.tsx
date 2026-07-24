"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { pressEvents } from "./press-catalog";

const types = ["All", ...Array.from(new Set(pressEvents.map((event) => event.type)))];
const locations = ["All places", "Desert Studio", "Virtual"];

export function EventsExplorer() {
  const [type, setType] = useState("All");
  const [location, setLocation] = useState("All places");
  const events = useMemo(() => pressEvents.filter((event) => (
    (type === "All" || event.type === type)
    && (location === "All places" || event.locationType === location)
  )), [location, type]);

  return (
    <>
      <div className="event-filters">
        <div aria-label="Filter by event type">
          {types.map((item) => <button key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{item}</button>)}
        </div>
        <label><span>LOCATION</span><select value={location} onChange={(event) => setLocation(event.target.value)}>{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="events-grid">
        {events.map((event, index) => (
          <article key={event.id} className="event-card">
            <span className="event-card__index">0{index + 1}</span>
            <p className="eyebrow">{event.type} · {event.locationType}</p>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <dl>
              <div><dt>WHEN</dt><dd>{event.date}</dd></div>
              <div><dt>WHERE</dt><dd>{event.location}</dd></div>
              <div><dt>PRICE</dt><dd>{event.price ? `$${event.price}` : "FREE"}</dd></div>
            </dl>
            <Link href={`/press/events/${event.id}`} className="button gold">EVENT DETAILS →</Link>
          </article>
        ))}
      </div>
    </>
  );
}
