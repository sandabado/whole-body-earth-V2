"use client";

import { useState, type FormEvent } from "react";

const steps = ["Manuscript", "Author", "Consent"] as const;

export function SubmissionWizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function continueForm(form: HTMLFormElement) {
    const visible = Array.from(form.querySelectorAll<HTMLElement>(`[data-step="${step}"] input, [data-step="${step}"] textarea, [data-step="${step}"] select`));
    const valid = visible.every((field) => !(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) || field.reportValidity());
    if (valid) setStep((current) => Math.min(steps.length - 1, current + 1));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < steps.length - 1) {
      continueForm(event.currentTarget);
      return;
    }
    setState("sending");
    setError("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/press/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Submission failed");
      setState("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Submission failed");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="submission-confirmation" role="status">
        <span>🜁</span>
        <p className="eyebrow">MANUSCRIPT RECEIVED</p>
        <h2>The signal reached us.</h2>
        <p>Your manuscript is now in the Press submission queue. Our response window is 90 days. If accepted, production begins within 60 days and the first edition is planned for 6–12 months after acceptance.</p>
        <strong>You retain 100% of your copyright throughout review.</strong>
      </div>
    );
  }

  return (
    <form className="submission-wizard" onSubmit={submit}>
      <ol className="wizard-steps" aria-label="Submission steps">
        {steps.map((label, index) => <li key={label} className={index === step ? "active" : index < step ? "complete" : ""}><span>0{index + 1}</span>{label}</li>)}
      </ol>

      <fieldset data-step="0" hidden={step !== 0}>
        <legend>Manuscript details</legend>
        <label><span>TITLE *</span><input name="title" required maxLength={120} /></label>
        <div className="field-grid">
          <label><span>PROPOSED IMPRINT *</span><select name="proposedImprint" required defaultValue=""><option value="" disabled>Choose imprint</option><option value="root_editions">Root Editions</option><option value="desert_press">Desert Press</option><option value="frequency_imprint">Frequency Imprint</option><option value="ceremonial_objects">Ceremonial Objects</option></select></label>
          <label><span>CATEGORY *</span><select name="category" required defaultValue=""><option value="" disabled>Choose practice</option><option>Somatic & Bodywork</option><option>Ecology & Land</option><option>Creative Rebellion</option><option>Ceremony & Ritual</option><option>Translations & Classics</option></select></label>
        </div>
        <label><span>WORD COUNT *</span><input name="wordCount" type="number" required min={1} max={250000} inputMode="numeric" /><small>25,000–100,000 preferred. Chapbooks and workbooks may be shorter.</small></label>
        <label><span>SYNOPSIS * <i>500 CHARACTERS MAX</i></span><textarea name="synopsis" required maxLength={500} rows={7} /></label>
      </fieldset>

      <fieldset data-step="1" hidden={step !== 1}>
        <legend>Author information</legend>
        <div className="field-grid">
          <label><span>FULL NAME *</span><input name="authorName" required autoComplete="name" /></label>
          <label><span>EMAIL *</span><input name="email" type="email" required autoComplete="email" /></label>
        </div>
        <div className="field-grid">
          <label><span>PHONE</span><input name="phone" type="tel" autoComplete="tel" /></label>
          <label><span>PORTFOLIO URL</span><input name="portfolio" type="url" placeholder="https://" /></label>
        </div>
        <label><span>SHORT BIO * <i>300 CHARACTERS MAX</i></span><textarea name="shortBio" required maxLength={300} rows={5} /></label>
        <label><span>PREVIOUS PUBLICATIONS</span><textarea name="previousPublications" rows={4} placeholder="Title, publisher, year — one per line" /></label>
      </fieldset>

      <fieldset data-step="2" hidden={step !== 2}>
        <legend>Publishing consent</legend>
        <div className="consent-stack">
          <label><input name="consentOriginal" type="checkbox" required /><span><strong>ORIGINAL WORK</strong>I confirm this manuscript is original work and not AI-generated.</span></label>
          <label><input name="consentCopyright" type="checkbox" required /><span><strong>AUTHOR COPYRIGHT</strong>I understand that I retain 100% copyright and all adaptation rights.</span></label>
          <label><input name="consentNonexclusive" type="checkbox" required /><span><strong>NON-EXCLUSIVE DISTRIBUTION</strong>I agree to discuss non-exclusive distribution with Press if accepted.</span></label>
          <label><input name="consentFeedFirst" type="checkbox" required /><span><strong>FEED FIRST</strong>I consent to the published 35/25/20/12/8 revenue allocation for Press-distributed sales.</span></label>
        </div>
        <div className="submission-timeline"><span>RESPONSE · 90 DAYS</span><span>PRODUCTION · 60 DAYS AFTER ACCEPTANCE</span><span>FIRST EDITION · 6–12 MONTHS</span></div>
      </fieldset>

      <input name="_gotcha" className="honeypot" tabIndex={-1} autoComplete="off" />
      <div className="wizard-actions">
        {step > 0 && <button type="button" className="button" onClick={() => setStep((current) => current - 1)}>← BACK</button>}
        <button className="button gold" disabled={state === "sending"}>{state === "sending" ? "CARRYING…" : step === steps.length - 1 ? "SUBMIT MANUSCRIPT →" : "CONTINUE →"}</button>
      </div>
      {state === "error" && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
