"use client";

import { useState, type FormEvent } from "react";

export function PressSubmissionForm() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const title = String(values.get("title") ?? "Untitled manuscript");
    const body = [`Name: ${values.get("name") ?? ""}`, `Email: ${values.get("email") ?? ""}`, `Working title: ${title}`, `Project link: ${values.get("link") ?? ""}`, "", "About the work:", String(values.get("message") ?? "")].join("\n");
    window.location.href = `mailto:press@wholebody.earth?subject=${encodeURIComponent(`Manuscript submission — ${title}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  if (sent) return <div className="border border-press/50 bg-press/5 p-8"><p className="font-display text-2xl font-bold">Your email draft is ready.</p><p className="mt-3 text-ghost">Attach the manuscript or sample before sending it to <a href="mailto:press@wholebody.earth" className="text-press">press@wholebody.earth</a>. We respond within 30 days.</p></div>;
  return <form onSubmit={handleSubmit} className="space-y-6 border border-mercury bg-carbon/45 p-6 sm:p-8"><div className="grid gap-6 sm:grid-cols-2"><Field label="Your name" name="name" required /><Field label="Email" name="email" type="email" required /></div><Field label="Working title" name="title" required /><Field label="Project link" name="link" hint="Optional — a document, sample, or portfolio." /><label className="block"><span className="font-mono text-xs uppercase tracking-[0.13em] text-bone">Tell us about the work</span><textarea name="message" required maxLength={1200} rows={7} className="mt-2 w-full resize-y border border-mercury bg-void p-3 text-bone outline-none focus:border-press" /></label><label className="flex gap-3 text-sm text-ghost"><input type="checkbox" required className="mt-1 accent-press" />I understand that authors retain 100% of their copyright and IP, and that Whole Body Press works on a 50/50 royalty split.</label><button type="submit" className="border border-press bg-press px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-void hover:bg-transparent hover:text-press">Start email submission →</button><p className="text-xs text-ghost">Submitting opens a prefilled email to Press. Attach your manuscript or sample there; a secure submission portal is in development.</p></form>;
}

function Field({ label, name, type = "text", required = false, hint }: { label: string; name: string; type?: string; required?: boolean; hint?: string }) { return <label className="block"><span className="font-mono text-xs uppercase tracking-[0.13em] text-bone">{label}</span><input name={name} type={type} required={required} className="mt-2 w-full border border-mercury bg-void p-3 text-bone outline-none focus:border-press" />{hint && <span className="mt-1 block text-xs text-ghost">{hint}</span>}</label>; }
