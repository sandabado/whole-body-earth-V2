import type { Metadata } from "next";
import { SubmissionWizard } from "../components/SubmissionWizard";

export const metadata: Metadata = {
  title: "Submit a Manuscript",
  description: "Submit a practice-rooted manuscript to Whole Body Press. Authors retain 100% of their copyright.",
};

export default function SubmitPage() {
  return (
    <div className="page press-page">
      <header className="press-page-hero press-page-hero--submit">
        <p className="eyebrow">SUBMIT YOUR MANUSCRIPT</p>
        <h1>We publish texts<br />that do not expire.</h1>
        <p>Rooted in practice, written for return, and strong enough to live as paper. Authors retain 100% of their intellectual property.</p>
      </header>
      <section className="submission-layout">
        <aside>
          <p className="eyebrow">EDITORIAL CRITERIA</p>
          <h2>Before you send.</h2>
          <ul>
            <li>The author has lived the practice they describe.</li>
            <li>The work serves a reader who will return for years.</li>
            <li>The prose respects the reader’s intelligence.</li>
            <li>The text can move gracefully through several formats.</li>
          </ul>
          <p className="mono-meta">WE DO NOT ACCEPT</p>
          <ul className="muted">
            <li>AI-generated manuscripts</li>
            <li>Appropriation of closed traditions</li>
            <li>Extraction-based business models</li>
            <li>Memoir without practice applicability</li>
          </ul>
        </aside>
        <SubmissionWizard />
      </section>
    </div>
  );
}
