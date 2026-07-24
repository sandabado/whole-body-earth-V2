import Link from "next/link";
import {notFound} from "next/navigation";
import {practitioners} from "../../components/data";
import {BookingWizard} from "./BookingWizard";

export function generateStaticParams() {
  return practitioners.map((person) => ({slug: person.slug}));
}

export default async function SessionRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{slug: string}>;
  searchParams: Promise<{length?: string}>;
}) {
  const [{slug}, query] = await Promise.all([params, searchParams]);
  const person = practitioners.find((candidate) => candidate.slug === slug);
  if (!person) notFound();

  const requestedLength = Number(query.length);
  const initialMinutes = person.pricing.some((option) => option.minutes === requestedLength)
    ? requestedLength
    : person.pricing[0].minutes;

  return (
    <div className="page booking-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/presence/sessions">Private sessions</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{person.name}</span>
      </nav>

      <section className="booking booking-rich" aria-labelledby="booking-title">
        <div className="booking-context">
          <figure>
            <img src={person.image} alt={`Portrait of ${person.name}`} />
            <figcaption>{person.title} · {person.location}</figcaption>
          </figure>
          <p className="eyebrow">PRIVATE SESSION</p>
          <h1 id="booking-title">Work with {person.name}.</h1>
          <p>{person.bio}</p>
          <blockquote>“{person.quote}”</blockquote>
          <dl className="booking-context-facts">
            <div><dt>SPECIALTIES</dt><dd>{person.tags.join(" · ")}</dd></div>
            <div><dt>FORMATS</dt><dd>{person.formats.join(" · ")}</dd></div>
          </dl>
          <Link className="text-link" href={`/presence/practitioners/${person.slug}`}>
            Read full profile <span aria-hidden="true">→</span>
          </Link>
        </div>

        <BookingWizard
          practitionerName={person.name}
          practitionerSlug={person.slug}
          practitionerLocation={person.location}
          formats={person.formats}
          pricing={person.pricing}
          initialMinutes={initialMinutes}
        />
      </section>

      <section className="booking-expectations" aria-labelledby="expectations-title">
        <header>
          <p className="eyebrow">BEFORE THE ROOM OPENS</p>
          <h2 id="expectations-title">What happens next.</h2>
        </header>
        <ol>
          <li><b>01</b><div><h3>Join beta access.</h3><p>Booking opens to invited community members in December 2026. No payment is taken while you wait.</p></div></li>
          <li><b>02</b><div><h3>Confirm fit and time.</h3><p>We will confirm format, availability, access needs, and whether this is the right room for what you are carrying.</p></div></li>
          <li><b>03</b><div><h3>Receive the private room.</h3><p>Virtual clients receive a Proton Meet link. In-person clients receive arrival details privately.</p></div></li>
          <li><b>04</b><div><h3>Arrive as you are.</h3><p>No preparation performance. Bring water, a quiet hour after the session, and your whole self.</p></div></li>
        </ol>
      </section>
    </div>
  );
}
