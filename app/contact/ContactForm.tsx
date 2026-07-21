"use client";

import { FormEvent, useState } from "react";
import { HudCard } from "../components/HudCard";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Transmission failed. Use a direct path below.");
      setSubmitted(true);
      window.dispatchEvent(new Event("wbs-frequency"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Transmission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-hero">
        <p className="eyebrow">CONTACT / DIRECT TRANSMISSION</p>
        <h1>SAY WHAT<br /><em>NEEDS SAYING.</em></h1>
        <p>Business inquiries, sync submissions, press, and questions about the model. Partnership applications belong in the gateway.</p>
      </header>
      <section className="page-section">
        {submitted ? (
          <HudCard className="confirmation"><p className="eyebrow">TRANSMISSION / SENT</p><h1>WE HAVE IT.</h1><p>We respond to direct inquiries within 48 hours.</p></HudCard>
        ) : (
          <form className="form-grid form-shell" onSubmit={submit}>
            <div className="field"><label htmlFor="name">Name *</label><input id="name" name="name" required /></div>
            <div className="field"><label htmlFor="contactEmail">Email *</label><input id="contactEmail" name="email" type="email" required /></div>
            <div className="field field--full"><label htmlFor="subject">Subject *</label><select id="subject" name="subject" required defaultValue=""><option value="" disabled>Select a path</option><option>Partnership inquiry</option><option>Sync submission</option><option>Press and media</option><option>General inquiry</option></select></div>
            <div className="field field--full"><label htmlFor="message">Message *</label><textarea id="message" name="message" minLength={10} required /></div>
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}><label htmlFor="companySite">Company site</label><input id="companySite" name="website" tabIndex={-1} /></div>
            {error && <p className="form-error" role="alert">SYS: {error.toUpperCase()}</p>}
            <button className="form-submit" disabled={loading}>{loading ? "SENDING…" : "SEND TRANSMISSION →"}</button>
          </form>
        )}
      </section>
      <section className="page-section">
        <p className="eyebrow" style={{ marginBottom: 30 }}>DIRECT PATHS / NO FORM REQUIRED</p>
        <div className="direct-paths">
          <a href="mailto:partnership@wholebody.studios"><span>PARTNERSHIP</span><strong>partnership@wholebody.studios</strong></a>
          <a href="mailto:sync@wholebody.studios"><span>SYNC</span><strong>sync@wholebody.studios</strong></a>
          <a href="tel:+19522121170"><span>PHONE</span><strong>+1 952 212 1170</strong></a>
        </div>
      </section>
    </div>
  );
}
