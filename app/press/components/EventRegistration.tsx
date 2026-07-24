"use client";

import { useState, type FormEvent } from "react";

export function EventRegistration({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/press/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Registration failed");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="registration-success" role="status">
        <span>✦</span>
        <h2>Your place is held.</h2>
        <p>Confirmation details for {eventTitle} are on their way. Virtual links are sent only to registered guests.</p>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={register}>
      <p className="eyebrow">HOLD A PLACE</p>
      <h2>Register for this event.</h2>
      <label><span>FULL NAME</span><input name="name" required autoComplete="name" /></label>
      <label><span>EMAIL</span><input name="email" type="email" required autoComplete="email" /></label>
      <label><span>NUMBER OF PLACES</span><select name="quantity" defaultValue="1"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
      <label className="consent"><input type="checkbox" name="consent" required /><span>I agree to receive transactional details for this event.</span></label>
      <input className="honeypot" name="_gotcha" tabIndex={-1} autoComplete="off" />
      <button className="button gold" disabled={state === "sending"}>{state === "sending" ? "HOLDING…" : "REGISTER →"}</button>
      {state === "error" && <p className="form-error">Registration did not carry. Please try again or email events@wholebody.press.</p>}
    </form>
  );
}
