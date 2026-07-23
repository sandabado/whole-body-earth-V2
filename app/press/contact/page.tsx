import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Whole Body Press about submissions, orders, permissions, events, and production.",
};

const channels = [
  ["EDITORIAL & SUBMISSIONS", "submissions@wholebody.press", "Manuscript questions and editorial correspondence"],
  ["ORDERS & CUSTOM EDITIONS", "orders@wholebody.press", "Bulk orders, retailer terms, ceremonial and archive inquiries"],
  ["EVENTS", "events@wholebody.press", "Readings, launch invitations, workshops, and venue partnerships"],
  ["RIGHTS & PERMISSIONS", "rights@wholebody.press", "Excerpts, classroom use, translations, audio, and adaptations"],
] as const;

export default function ContactPage() {
  return (
    <div className="page press-page">
      <header className="press-page-hero">
        <p className="eyebrow">CONTACT / OPEN A CHANNEL</p>
        <h1>Send a clear<br />signal.</h1>
        <p>Choose the channel closest to your request. Manuscripts must enter through the submission form so consent and review timing remain documented.</p>
      </header>
      <section className="press-section press-section--first">
        <div className="contact-grid">
          {channels.map(([label, email, detail]) => (
            <article key={email}>
              <p className="eyebrow">{label}</p><h2><a href={`mailto:${email}`}>{email}</a></h2><p>{detail}</p><a href={`mailto:${email}`} className="text-link">WRITE →</a>
            </article>
          ))}
        </div>
        <div className="contact-note"><span>RESPONSE STANDARD</span><p>Business inquiries: 5 working days · Submission decisions: 90 days · Order support: 2 working days</p></div>
      </section>
    </div>
  );
}
