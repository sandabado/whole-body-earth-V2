import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

const values = [
  ["01", "Artist First", "The person who made the work is fed before the structure around it."],
  ["02", "Infrastructure Over Ownership", "We earn on services rendered. We never earn by possessing your masters."],
  ["03", "Revenue Transparency", "The Feed First Algorithm makes every split legible before money moves."],
  ["04", "Privacy by Design", "No tracking pixels. No data brokerage. Your signal is not inventory."],
] as const;

export default function AboutPage() {
  return (
    <div className="page-shell">
      <header className="page-hero">
        <p className="eyebrow">THE WATER RAY / WHO HOLDS THE FREQUENCY</p>
        <h1>MUSIC IS NOT CONTENT.<br /><em>IT IS CURRENT.</em></h1>
        <p>Whole Body Studios is the Water element of the Whole Body constellation — infrastructure for music and film built to return agency to artists.</p>
      </header>
      <section className="page-section content-grid">
        <div><p className="eyebrow">FOUNDER / JESSE GAWLIK</p><h2>THE ROOM EXISTS BECAUSE THE OLD EXCHANGE DOESN&apos;T HAVE TO.</h2></div>
        <div><p>We are not building another label. We are building the production, release, and placement capacity independent artists are told they can only access by giving something away.</p><p>Ownership is the beginning. Infrastructure is what lets ownership become livelihood.</p><Link className="text-link" href="/contact">OPEN A DIRECT PATH <span>→</span></Link></div>
      </section>
      <section className="page-section content-grid">
        <div><p className="eyebrow">OPERATING VALUES / 004</p><h2>THE COVENANT<br />BEFORE THE CONTRACT.</h2></div>
        <div className="value-list">
          {values.map(([index, title, copy]) => <div className="value-item" key={index}><span>{index}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}
        </div>
      </section>
      <section className="page-section content-grid">
        <div><p className="eyebrow">LEGAL ENTITY</p><h2>WHOLE BODY GUILD LLC</h2></div>
        <div><p>Registered in California. Artist relationships are partnership agreements, not employment agreements. No IP transfers. No hidden options. No perpetual claims.</p><p>We operate with a lean core and a trusted network of producers, engineers, filmmakers, strategists, and makers.</p></div>
      </section>
    </div>
  );
}
