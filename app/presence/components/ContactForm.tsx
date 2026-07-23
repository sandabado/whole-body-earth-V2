"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [opened, setOpened] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "General question");
    const message = String(data.get("message") ?? "").trim();
    const body = [`From: ${name}`, `Reply to: ${email}`, "", message].join("\n");
    window.location.href = `mailto:hello@wholebody.community?subject=${encodeURIComponent(`[${subject}] Whole Body Presence`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="contact-form__row">
      <label>Your name<input name="name" autoComplete="name" required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    </div>
    <label>What is this about?
      <select name="subject" defaultValue="Gathering question">
        <option>Gathering question</option>
        <option>Accessibility or scholarship</option>
        <option>Private session</option>
        <option>Practitioner application</option>
        <option>Press or partnership</option>
      </select>
    </label>
    <label>Message<textarea name="message" rows={7} required placeholder="Say it in your own words." /></label>
    <div className="contact-form__footer">
      <button className="button ember" type="submit">Open email draft →</button>
      <small>{opened ? "Your mail app should be open. If it is not, write us directly below." : "This opens a private draft in your email app. Nothing is stored here."}</small>
    </div>
  </form>;
}
