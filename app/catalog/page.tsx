import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Catalog" };

const projects = [
  ["01", "The Whole Body Series — Vol. I–V", "VARIOUS ARTISTS / COMPILATION", "PLANNED Q4 2026"],
  ["02", "Living Earth Vol. 1", "VARIOUS ARTISTS / SOUL + BLUES", "MIXING"],
  ["03", "Memory EP", "SARAH VEYA / AMBIENT SOUL", "MASTERING"],
] as const;

export default function CatalogPage() {
  return (
    <div className="page-shell">
      <header className="page-hero">
        <p className="eyebrow">CATALOG / ACTIVE TRANSMISSIONS</p>
        <h1>THE WORK<br /><em>IN MOTION.</em></h1>
        <p>Records developed through Whole Body Studios. Every artist retains 100% ownership. Every credit remains attached.</p>
      </header>
      <section className="page-section catalog-feature">
        <div className="album-art" aria-label="Abstract artwork for Infinite Love by Sandābādo" />
        <div className="catalog-copy">
          <p className="eyebrow">FEATURED / WBS-001</p>
          <h2>∞ LOVE</h2>
          <p>Sandābādo&apos;s debut album. Thirteen tracks held between soul blues and desert rock — a record about returning to what the body already knows.</p>
          <div className="meta-list">
            <div><span>ARTIST</span><strong>SANDĀBĀDO</strong></div>
            <div><span>STATUS</span><strong>SEPTEMBER 26, 2026</strong></div>
            <div><span>FORMATS</span><strong>180G VINYL / CD / DIGITAL</strong></div>
            <div><span>DURATION</span><strong>13 TRACKS / 52 MINUTES</strong></div>
          </div>
          <a className="button button--solid" href="https://sandabado-music.vercel.app/music" target="_blank" rel="noreferrer"><span>STREAM PREVIEW</span><b>↗</b></a>
        </div>
      </section>
      <section className="page-section">
        <p className="eyebrow" style={{ marginBottom: 30 }}>IN DEVELOPMENT / SYSTEM FEED</p>
        <div className="project-list">
          {projects.map(([index, title, artist, status]) => (
            <div className="project-row" key={index}>
              <span>{index}</span><div><h3>{title}</h3><p>{artist}</p></div><em>ARTIST-OWNED</em><strong>{status}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="final-cta">
        <p className="eyebrow">YOUR WORK / NEXT SIGNAL</p>
        <h2>READY TO ENTER<br /><em>THE SYSTEM?</em></h2>
        <Link className="button button--solid" href="/apply"><span>APPLY FOR PARTNERSHIP</span><b>↗</b></Link>
      </section>
    </div>
  );
}
