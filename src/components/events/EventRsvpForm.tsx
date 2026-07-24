"use client";

import { useState } from "react";

export function EventRsvpForm({
  eventId,
  paid,
  full,
  waitlist,
}: {
  eventId: string;
  paid: boolean;
  full: boolean;
  waitlist: boolean;
}) {
  const [state, setState] = useState<"idle" | "sending" | "complete">("idle");
  const [message, setMessage] = useState("");

  async function submit(form: HTMLFormElement) {
    setState("sending");
    setMessage("");
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          firstTime: formData.get("firstTime") === "on",
          consent: formData.get("consent") === "on",
          website: formData.get("website"),
        }),
      });
      const payload = (await response.json()) as { error?: string; status?: string };
      if (!response.ok) throw new Error(payload.error || "Your reservation could not be saved.");
      setState("complete");
      setMessage(
        payload.status === "waitlisted"
          ? "You’re on the waitlist. We’ll reach out if a space opens."
          : payload.status === "pending"
            ? "Your RSVP is pending approval. We’ll be in touch shortly."
            : "Your spot is reserved. Check your inbox for the details.",
      );
    } catch (error) {
      setState("idle");
      setMessage(error instanceof Error ? error.message : "Your reservation could not be saved.");
    }
  }

  if (paid)
    return <p className="mt-5 border border-press/50 bg-press/10 p-4 text-sm leading-6 text-bone">Paid reservations will open here through secure checkout. This gathering is already connected to the central calendar record.</p>;
  if (full && !waitlist)
    return <p className="mt-5 border border-mercury bg-carbon p-4 text-sm leading-6 text-ghost">This gathering is full. Check the calendar for another date.</p>;
  if (state === "complete")
    return <p role="status" className="mt-5 border border-water/60 bg-water/10 p-4 text-sm leading-6 text-bone">{message}</p>;

  return <form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget); }} noValidate>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Name" name="name" required /><Field label="Email" name="email" type="email" required /></div>
    <Field label="Phone" name="phone" type="tel" />
    <label className="flex items-start gap-3 text-sm text-ghost"><input name="firstTime" type="checkbox" className="mt-1 accent-water" />First time gathering with Whole Body Earth</label>
    <label className="flex items-start gap-3 text-sm leading-6 text-ghost"><input name="consent" type="checkbox" required className="mt-1 accent-water" />I agree to arrive with presence, confidentiality, and mutual respect.</label>
    <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    <button disabled={state === "sending"} className="w-full border border-water bg-water px-5 py-3 font-mono text-[10px] uppercase tracking-[.14em] text-void transition hover:bg-transparent hover:text-water disabled:cursor-wait disabled:opacity-60">{state === "sending" ? "Reserving your spot…" : full ? "Join waitlist →" : "Reserve your spot →"}</button>
    {message ? <p role="alert" className="text-sm text-fire">{message}</p> : null}
  </form>;
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label className="block"><span className="font-mono text-[10px] uppercase tracking-[.13em] text-ghost">{label}</span><input required={required} name={name} type={type} className="mt-2 w-full border border-mercury bg-void px-3 py-3 text-bone outline-none transition focus:border-water" /></label>;
}
