import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TitleCard } from "../../components/TitleCard";
import {
  eventsForAuthor,
  getAuthor,
  pressAuthors,
  titlesForAuthor,
} from "../../components/press-catalog";

export function generateStaticParams() {
  return pressAuthors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  return author ? {
    title: author.name,
    description: author.shortBio,
    alternates: { canonical: `/press/authors/${author.slug}` },
  } : {};
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const titles = titlesForAuthor(author.slug);
  const events = eventsForAuthor(author.slug);
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.shortBio,
    url: `https://wholebody.press/authors/${author.slug}`,
    worksFor: { "@type": "Organization", name: "Whole Body Press" },
  };

  return (
    <div className="page press-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }} />
      <section className="author-detail-hero">
        <div className="author-portrait author-portrait--detail">
          <span>{author.initials}</span><i aria-hidden="true" /><small>AUTHOR / WHOLE BODY PRESS</small>
        </div>
        <div>
          <p className="eyebrow">AUTHOR / PRACTITIONER</p>
          <h1>{author.name}</h1>
          <p className="mono-meta">{author.credentials}</p>
          <blockquote>“{author.quote}”</blockquote>
          <div className="reading-text">{author.longBio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          {author.website && <a href={author.website} className="text-link">AUTHOR WEBSITE →</a>}
        </div>
      </section>

      <section className="press-section">
        <div className="press-section-head">
          <div><p className="eyebrow">CATALOG</p><h2>Work carried here.</h2></div>
          <Link href="/press/catalog" className="text-link">FULL CATALOG →</Link>
        </div>
        {titles.length ? (
          <div className="title-grid">{titles.map((title) => <TitleCard key={title.slug} title={title} />)}</div>
        ) : (
          <div className="author-forthcoming"><span>🜁</span><p>First edition in editorial development.</p></div>
        )}
      </section>

      {events.length > 0 && (
        <section className="press-section press-section--ruled">
          <div className="press-section-head"><div><p className="eyebrow">EVENTS</p><h2>Meet the author.</h2></div></div>
          <div className="event-list">
            {events.map((event) => (
              <article key={event.id} className="event-row">
                <div><span>{event.type}</span><strong>{event.date}</strong></div>
                <h3>{event.title}</h3><p>{event.location}</p>
                <Link href={`/press/events/${event.id}`} className="text-link">REGISTER →</Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
