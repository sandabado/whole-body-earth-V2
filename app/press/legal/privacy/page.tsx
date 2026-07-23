import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy", description: "Whole Body Press privacy and data consent policy." };

export default function PrivacyPage() {
  return (
    <div className="page press-page legal-page">
      <header className="press-page-hero"><p className="eyebrow">LEGAL / PRIVACY</p><h1>Your data is not<br />our product.</h1><p>Effective July 22, 2026. This policy explains the limited information Press collects and why.</p></header>
      <article className="legal-copy">
        <h2>Information we collect</h2><p>Press collects information you choose to submit through manuscript, event, order inquiry, or contact forms. This may include your name, email, phone number, manuscript details, professional biography, and event registration count.</p>
        <h2>How we use it</h2><p>We use this information to review manuscripts, answer inquiries, administer events, fulfill editions, maintain legally required records, and send transactional messages. Marketing messages require separate consent.</p>
        <h2>Manuscript confidentiality</h2><p>Submission materials are available only to authorized editorial reviewers and service providers required to operate the submission system. Submission does not transfer copyright or grant Press a license to publish.</p>
        <h2>Storage and retention</h2><p>Pending and active submission records are retained for editorial review. Declined submissions may be deleted on request unless retention is required for legal or operational integrity. Event and order records are retained only as long as necessary for fulfillment, accounting, or law.</p>
        <h2>Your choices</h2><p>You may request access, correction, export, or deletion of eligible personal data by emailing privacy@wholebody.press. If you are in the EEA or UK, you may also object to processing or request restriction where applicable.</p>
        <h2>Analytics and cookies</h2><p>Press does not use advertising trackers. Essential security, session, and delivery technologies may operate when necessary. Any future audience analytics will be documented here before activation.</p>
        <h2>Contact</h2><p>Privacy questions: <a href="mailto:privacy@wholebody.press">privacy@wholebody.press</a>.</p>
      </article>
    </div>
  );
}
