import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <div className="page-shell"><header className="page-hero"><p className="eyebrow">LEGAL / PRIVACY</p><h1>YOUR SIGNAL IS<br /><em>NOT INVENTORY.</em></h1></header><section className="page-section legal-copy"><p>Effective July 21, 2026.</p><h2>What we collect</h2><p>We collect the information you choose to send through our partnership and contact forms so we can review the work, respond, and administer a potential relationship.</p><h2>What we do not do</h2><p>We do not sell personal information. We do not use submissions to train machine-learning systems. We do not add applicants to marketing lists without separate consent.</p><h2>Retention and access</h2><p>Application records are retained only as long as necessary for review, legal obligations, and relationship administration. To request access or deletion, contact partnership@wholebody.studios.</p></section></div>;
}
