import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventRegistration } from "../../components/EventRegistration";
import {
  getAuthor,
  getEvent,
  getTitle,
  pressEvents,
} from "../../components/press-catalog";

export function generateStaticParams() {
  return pressEvents.map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = getEvent(id);
  return event ? { title: event.title, description: event.description } : {};
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();
  const authors = event.authorSlugs.map(getAuthor).filter(Boolean);
  const title = event.titleSlug ? getTitle(event.titleSlug) : undefined;
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.dateTime,
    endDate: event.endTime,
    eventAttendanceMode: event.locationType === "Virtual" ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location: event.locationType === "Virtual"
      ? { "@type": "VirtualLocation", url: "Private link after registration" }
      : { "@type": "Place", name: "Desert Studio", address: "Morongo Valley, California" },
    organizer: { "@type": "Organization", name: "Whole Body Press", url: "https://wholebody.press" },
    offers: { "@type": "Offer", price: event.price, priceCurrency: "USD", availability: "https://schema.org/InStock" },
  };

  return (
    <div className="page press-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <section className="event-detail-hero">
        <div className="event-signal" aria-hidden="true"><span>🜁</span><i /><small>{event.type.toUpperCase()}</small></div>
        <div>
          <p className="eyebrow">{event.type} · {event.locationType}</p>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <dl>
            <div><dt>DATE / TIME</dt><dd>{event.date}</dd></div>
            <div><dt>LOCATION</dt><dd>{event.location}</dd></div>
            <div><dt>ADMISSION</dt><dd>{event.price ? `$${event.price}` : "FREE"}</dd></div>
            <div><dt>CAPACITY</dt><dd>{event.capacity} PLACES</dd></div>
          </dl>
          {authors.length > 0 && <p className="event-hosts">WITH {authors.map((author) => <Link key={author!.slug} href={`/press/authors/${author!.slug}`}>{author!.name}</Link>)}</p>}
          {title && <Link href={`/press/catalog/${title.slug}`} className="text-link">ABOUT {title.title.toUpperCase()} →</Link>}
        </div>
      </section>
      <section className="event-registration-section">
        <div>
          <p className="eyebrow">BEFORE YOU ARRIVE</p>
          <h2>A room held<br />with intention.</h2>
          <p>Registration is limited to keep the gathering conversational. You will receive arrival details or a private Proton Meet link by email.</p>
          <p>Cancel up to 48 hours before a paid event for a full refund. If Press cancels, every registration is refunded automatically.</p>
        </div>
        <EventRegistration eventId={event.id} eventTitle={event.title} />
      </section>
    </div>
  );
}
