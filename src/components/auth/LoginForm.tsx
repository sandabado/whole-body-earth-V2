"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (error) throw error;
      setStatus("sent");
      setMessage("Check your email for a secure sign-in link.");
    } catch {
      setStatus("error");
      setMessage("Account access is not configured yet. Please try again soon.");
    }
  };

  return <form onSubmit={submit} className="mt-9 border border-mercury bg-carbon/65 p-6 sm:p-8">
    <label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ghost">Email address</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-mercury bg-void px-3 py-3 text-bone outline-none transition focus:border-bone" placeholder="you@example.com" /></label>
    <button type="submit" disabled={status === "sending"} className="mt-5 w-full border border-bone bg-bone px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-void transition hover:bg-transparent hover:text-bone disabled:cursor-wait disabled:opacity-60">{status === "sending" ? "Sending link…" : "Email me a secure link"}</button>
    {message && <p role="status" className={`mt-4 text-sm ${status === "error" ? "text-fire" : "text-ghost"}`}>{message}</p>}
  </form>;
}
