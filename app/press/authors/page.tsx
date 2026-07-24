import type { Metadata } from "next";
import Link from "next/link";
import { pressAuthors, titlesForAuthor } from "../components/press-catalog";

export const metadata: Metadata = {
  title: "Authors",
  description: "Meet the writers and practitioners published by Whole Body Press.",
};

export default function AuthorsPage() {
  return (
    <div className="page press-page">
      <header className="press-page-hero">
        <p className="eyebrow">THE AUTHORS / PRACTICE BEFORE THEORY</p>
        <h1>The voice<br />stays theirs.</h1>
        <p>Writers retain copyright, translation, audio, and adaptation rights. Press carries the work without owning the person who made it.</p>
      </header>
      <section className="press-section press-section--first">
        <div className="author-directory">
          {pressAuthors.map((author, index) => {
            const titles = titlesForAuthor(author.slug);
            return (
              <Link href={`/press/authors/${author.slug}`} key={author.slug} className="author-card">
                <div className="author-portrait">
                  <span>{author.initials}</span><i aria-hidden="true" /><small>PORTRAIT / {String(index + 1).padStart(2, "0")}</small>
                </div>
                <p className="mono-meta">{author.credentials}</p>
                <h2>{author.name}</h2>
                <p>{author.shortBio}</p>
                <blockquote>“{author.quote}”</blockquote>
                <small>{titles.length ? `${titles.length} ${titles.length === 1 ? "TITLE" : "TITLES"}` : "FORTHCOMING"}</small>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
