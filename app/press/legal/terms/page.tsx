import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms", description: "Whole Body Press customer, event, submission, and distribution terms." };

export default function TermsPage() {
  return (
    <div className="page press-page legal-page">
      <header className="press-page-hero"><p className="eyebrow">LEGAL / TERMS</p><h1>Clear agreements<br />carry farther.</h1><p>Effective July 22, 2026. Plain-language terms for readers, event guests, and submitting authors.</p></header>
      <article className="legal-copy">
        <h2>Edition purchases</h2><p>Prices, materials, availability, taxes, shipping, and estimated production timing are shown before payment. Limited and custom editions may vary slightly because they are made by hand. A reservation inquiry is not a charge or guaranteed allocation.</p>
        <h2>Digital editions</h2><p>Digital purchases grant the buyer a personal, non-transferable reading license. Files are delivered without DRM where stated. Copyright remains with the author; redistribution or commercial reproduction is not permitted.</p>
        <h2>Custom editions</h2><p>Custom work begins only after final material, inscription, price, and timing approval. Estimated pricing is not a binding quote. Deposits are refundable until materials are cut; after production begins, custom payments are non-refundable except for material defect or Press cancellation.</p>
        <h2>Events</h2><p>Paid event registrations are refundable when cancelled at least 48 hours before the stated start time. If Press cancels an event, registration fees are refunded. Virtual access links are personal and may not be redistributed.</p>
        <h2>Manuscript submissions</h2><p>Authors retain all copyright. Submission does not create an agency, publishing, confidentiality, or distribution agreement beyond Press handling the material for editorial review under the privacy policy. Any publication offer requires a separate written agreement.</p>
        <h2>Feed First</h2><p>The published 35/25/20/12/8 allocation is the current Press model for qualifying distributed revenue. Title-specific production agreements will define eligible revenue, direct costs, reporting, payment timing, returns, and exceptions before publication.</p>
        <h2>Contact</h2><p>Terms and permissions: <a href="mailto:rights@wholebody.press">rights@wholebody.press</a>.</p>
      </article>
    </div>
  );
}
