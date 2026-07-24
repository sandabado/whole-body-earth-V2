"use client";

import Link from "next/link";
import {useMemo, useState} from "react";
import {practitioners} from "../components/data";

const filters = [
  "All",
  "Somatic",
  "Trauma",
  "Breathwork",
  "Ceremony",
  "Integration",
  "Sound",
] as const;

export function PractitionerDirectory() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");

  const visiblePractitioners = useMemo(
    () =>
      activeFilter === "All"
        ? practitioners
        : practitioners.filter((person) => person.tags.includes(activeFilter)),
    [activeFilter],
  );

  return (
    <section className="section compact practitioner-directory" aria-labelledby="directory-title">
      <div className="directory-toolbar">
        <div>
          <p className="eyebrow" id="directory-title">CHOOSE BY PRACTICE</p>
          <p className="directory-count" aria-live="polite">
            {visiblePractitioners.length} {visiblePractitioners.length === 1 ? "keeper" : "keepers"}
          </p>
        </div>
        <div className="filter-pills" role="group" aria-label="Filter practitioners by specialty">
          {filters.map((filter) => (
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

      <div className="person-grid keeper-grid">
        {visiblePractitioners.map((person) => (
          <article className="keeper-card" key={person.slug}>
            <Link href={`/presence/practitioners/${person.slug}`} className="keeper-card-image" aria-label={`View ${person.name}'s profile`}>
              <img src={person.image} alt="" />
              <span className="keeper-availability"><i aria-hidden="true" /> ACCEPTING BETA REQUESTS</span>
            </Link>
            <div className="keeper-card-copy">
              <p className="eyebrow">{person.title}</p>
              <h2><Link href={`/presence/practitioners/${person.slug}`}>{person.name}</Link></h2>
              <p>{person.bio}</p>
              <div className="tags" aria-label={`${person.name}'s specialties`}>
                {person.tags.map((tag) => <b key={tag}>{tag}</b>)}
              </div>
              <dl className="keeper-meta">
                <div><dt>BASE</dt><dd>{person.location}</dd></div>
                <div><dt>SESSIONS</dt><dd>From {person.price}</dd></div>
              </dl>
              <Link className="text-link" href={`/presence/practitioners/${person.slug}`}>
                Meet {person.name.split(" ")[0]} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
