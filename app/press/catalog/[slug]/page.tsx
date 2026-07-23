import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "../../components/BookCover";
import { FormatSelector } from "../../components/FormatSelector";
import {
  authorsForTitle,
  getTitle,
  pressTitles,
} from "../../components/press-catalog";

export function generateStaticParams() {
  return pressTitles.map((title) => ({ slug: title.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = getTitle(slug);
  if (!title) return {};
  return {
    title: title.title,
    description: title.description,
    alternates: { canonical: `/press/catalog/${title.slug}` },
    openGraph: { title: `${title.title} — Whole Body Press`, description: title.description },
  };
}

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = getTitle(slug);
  if (!title) notFound();
  const authors = authorsForTitle(title);
  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title.title,
    alternateName: title.subtitle,
    description: title.description,
    author: authors.map((author) => ({ "@type": "Person", name: author.name, url: `https://wholebody.press/authors/${author.slug}` })),
    publisher: { "@type": "Organization", name: "Whole Body Press", url: "https://wholebody.press" },
    datePublished: title.publicationDate,
    isbn: title.isbn,
    bookFormat: title.formats.map((format) => format.label),
  };

  return (
    <div className="page press-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />
      <section className="title-detail-hero">
        <div className="title-detail-visual"><BookCover title={title} /></div>
        <div className="title-detail-copy">
          <p className="eyebrow">{title.imprint} · {title.status}</p>
          <h1>{title.title}</h1>
          {title.subtitle && <p className="title-subtitle">{title.subtitle}</p>}
          <p className="title-byline">By {authors.map((author, index) => (
            <span key={author.slug}>{index > 0 && " · "}<Link href={`/press/authors/${author.slug}`}>{author.name}</Link></span>
          ))}</p>
          <p className="title-description">{title.description}</p>
          <div className="hero-actions">
            <FormatSelector title={title.title} formats={title.formats} />
            <Link className="button" href="/press/craft">HOW WE MAKE IT</Link>
          </div>
          <dl className="title-facts">
            <div><dt>PUBLICATION</dt><dd>{new Date(`${title.publicationDate}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</dd></div>
            <div><dt>CATEGORY</dt><dd>{title.category}</dd></div>
            <div><dt>RIGHTS</dt><dd>100% author-owned</dd></div>
          </dl>
        </div>
      </section>

      <section className="press-section title-reading">
        <div>
          <p className="eyebrow">ABOUT THIS EDITION</p>
          <h2>Made for return.</h2>
        </div>
        <div className="reading-text">
          {title.longDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="press-section">
        <div className="press-section-head">
          <div><p className="eyebrow">AVAILABLE FORMATS</p><h2>One text. Several lives.</h2></div>
          <p>Pricing is shown before tax and shipping. Limited editions are individually numbered.</p>
        </div>
        <div className="format-grid">
          {title.formats.map((format) => (
            <article key={format.id}>
              <span>{format.label}</span>
              <strong>${format.price}</strong>
              <p>{format.detail}</p>
              {format.availability && <small>{format.availability}</small>}
            </article>
          ))}
        </div>
      </section>

      <section className="press-footer-cta">
        <p className="eyebrow">CONTINUE THROUGH THE AIR</p>
        <h2>Find the next text.</h2>
        <Link className="button gold" href="/press/catalog">RETURN TO CATALOG →</Link>
      </section>
    </div>
  );
}
