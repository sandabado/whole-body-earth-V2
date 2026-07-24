import Link from "next/link";
import { authorsForTitle, type PressTitle } from "./press-catalog";
import { BookCover } from "./BookCover";

export function TitleCard({ title }: { title: PressTitle }) {
  const authors = authorsForTitle(title);
  const startingPrice = Math.min(...title.formats.map((format) => format.price));

  return (
    <article className="title-card">
      <Link href={`/press/catalog/${title.slug}`} className="title-card__cover">
        <BookCover title={title} compact />
      </Link>
      <div className="title-card__meta">
        <span>{title.imprint}</span>
        <span>{title.status}</span>
      </div>
      <h3><Link href={`/press/catalog/${title.slug}`}>{title.title}</Link></h3>
      <p className="title-card__author">{authors.map((author) => author.name).join(" · ")}</p>
      <p>{title.description}</p>
      <div className="title-card__foot">
        <span>{title.formats[1]?.label.toUpperCase() ?? "FIRST EDITION"}</span>
        <span>FROM ${startingPrice}</span>
      </div>
      <Link href={`/press/catalog/${title.slug}`} className="text-link">VIEW TITLE →</Link>
    </article>
  );
}
