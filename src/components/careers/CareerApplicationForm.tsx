"use client";

import { useState, type FormEvent } from "react";

type CareerApplicationFormProps = { jobId: string; jobTitle: string; requiresPortfolio: boolean; accent: string };
type SubmitState = "idle" | "sending" | "sent" | "error";

export function CareerApplicationForm({ jobId, jobTitle, requiresPortfolio, accent }: CareerApplicationFormProps) {
  const [hasReading, setHasReading] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const colorStyle = { ["--career-accent" as string]: accent };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    setError("");
    const response = await fetch("/api/careers/apply", { method: "POST", body: new FormData(event.currentTarget) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : "We couldn’t submit your application. Please try again.");
      setState("error");
      return;
    }
    setState("sent");
  };

  if (state === "sent") return <div className="border p-6 sm:p-8" style={{ ...colorStyle, borderColor: `${accent}99`, backgroundColor: `${accent}12` }}><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: accent }}>Application received</p><h2 className="mt-3 font-display text-3xl text-bone">Thank you for bringing your work.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-ghost">We&apos;ve received your application for {jobTitle}. We review every submission and will respond within 14 days.</p></div>;

  return <form onSubmit={submit} className="career-form space-y-7 border border-mercury bg-carbon/55 p-5 sm:p-8" style={colorStyle} noValidate>
    <input type="hidden" name="jobId" value={jobId} />
    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[var(--career-accent)]">Application</p><h2 className="mt-3 font-display text-3xl text-bone">Bring your architecture.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-ghost">Tell us what you build and why this role fits your work.</p></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" name="fullName" required /><Field label="Email" name="email" type="email" required /><Field label="Phone" name="phone" type="tel" /><Field label="Location" name="location" required /><Field label="LinkedIn" name="linkedinUrl" type="url" /><Field label="Portfolio" name="portfolioUrl" type="url" required={requiresPortfolio} /><Field label="Website" name="websiteUrl" type="url" /></div>
    <label className="block"><span className="career-field-label">Cover letter</span><textarea name="coverLetter" rows={7} maxLength={3000} required className="career-field mt-2 min-h-36 resize-y" placeholder="Tell us what you build and why this role fits your architecture." /></label>
    <label className="block"><span className="career-field-label">Resume / CV</span><input name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required className="career-file mt-2 block w-full" /><span className="mt-2 block text-xs text-ghost">PDF, DOC, or DOCX · maximum 10MB · reviewed privately.</span></label>
    <label className="block"><span className="career-field-label">Additional work samples <span className="normal-case tracking-normal text-ghost">(optional)</span></span><input name="additionalFiles" type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="career-file mt-2 block w-full" /><span className="mt-2 block text-xs text-ghost">Up to three supporting files, 10MB each.</span></label>
    <fieldset className="border-y border-mercury py-6"><legend className="career-field-label pr-3">Have you taken the Whole Body Design Reading?</legend><div className="mt-4 flex gap-5"><label className="flex items-center gap-2 text-sm text-bone"><input type="radio" name="hasReading" value="yes" checked={hasReading} onChange={() => setHasReading(true)} style={{ accentColor: accent }} />Yes</label><label className="flex items-center gap-2 text-sm text-bone"><input type="radio" name="hasReading" value="no" checked={!hasReading} onChange={() => setHasReading(false)} style={{ accentColor: accent }} />No</label></div>{hasReading && <div className="mt-5 grid gap-5 sm:grid-cols-3"><Field label="House" name="houseNumber" type="number" min="1" max="12" /><Field label="Element" name="element" /><Field label="Pillar" name="pillar" /></div>}</fieldset>
    <Field label="Referred by" name="referredBy" />
    <div className="space-y-3"><Consent name="consentReview" text="I consent to Whole Body Guild reviewing my application materials." accent={accent} /><Consent name="consentOrganization" text="I understand this is a sovereign organization, not a traditional employer." accent={accent} /></div>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    <button disabled={state === "sending"} className="career-submit px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] disabled:cursor-wait disabled:opacity-60">{state === "sending" ? "Submitting…" : "Submit application →"}</button>
  </form>;
}

function Field({ label, name, required = false, type = "text", min, max }: { label: string; name: string; required?: boolean; type?: string; min?: string; max?: string }) { return <label className="block"><span className="career-field-label">{label}{required && <span className="text-[var(--career-accent)]"> *</span>}</span><input name={name} type={type} required={required} min={min} max={max} className="career-field mt-2" /></label>; }
function Consent({ name, text, accent }: { name: string; text: string; accent: string }) { return <label className="flex gap-3 text-sm leading-6 text-ghost"><input name={name} type="checkbox" required className="mt-1" style={{ accentColor: accent }} /><span>{text}</span></label>; }
