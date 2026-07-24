import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return <div className="page-shell"><header className="page-hero"><p className="eyebrow">LEGAL / TERMS</p><h1>THE BOUNDARY<br /><em>IS PART OF THE TRUST.</em></h1></header><section className="page-section legal-copy"><p>Effective July 21, 2026.</p><h2>Site use</h2><p>This site provides information about Whole Body Studios and a way to begin a conversation. Submitting a form does not create a partnership, agency, employment, or services agreement.</p><h2>Your work remains yours</h2><p>Sharing a link or description for review does not transfer copyright, master ownership, publishing rights, or any other intellectual property interest.</p><h2>Future agreements</h2><p>Any engagement begins only after both parties sign a separate written agreement stating scope, fees, responsibilities, and revenue treatment.</p></section></div>;
}
