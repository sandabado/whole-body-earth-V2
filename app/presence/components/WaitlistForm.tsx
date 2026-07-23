"use client";

import { useState, type FormEvent } from "react";

export function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/presence/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(response.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return <div className="success" role="status">
      <span aria-hidden="true">🜂</span>
      <h2>Your name is in the fire.</h2>
      <p>We’ll write when the first circle opens.</p>
    </div>;
  }

  return <form className={`waitlist-form${compact ? " waitlist-form--compact" : ""}`} onSubmit={submit}>
    <label>Your name<input name="name" autoComplete="name" maxLength={100} required /></label>
    <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    {!compact && <>
      <label>What calls to you?
        <select name="interest" defaultValue="Retreats">
          <option>Retreats</option>
          <option>Private sessions</option>
          <option>Community gatherings</option>
          <option>Practitioner circle</option>
        </select>
      </label>
      <label>Anything we should know?<textarea name="message" rows={4} maxLength={1500} /></label>
    </>}
    <label className="check"><input type="checkbox" required /><span>I agree to be contacted about Whole Body Presence. My information will not be sold or used for ad tracking.</span></label>
    <input className="honeypot" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <button className="button ember" type="submit" disabled={state === "loading"}>
      {state === "loading" ? "Adding your name…" : "Add my name to the fire →"}
    </button>
    <p className="form-state" aria-live="polite">{state === "error" ? "Something interrupted the signal. Please try again." : ""}</p>
  </form>;
}
