"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const PENDING_READING_KEY = "wholebody:pending-dodecanic-reading";

export type ReadingApplication = {
  house: number;
  houseName: string;
  element: string;
  archetype: string;
  pillar: string;
  confidence: number;
  confidenceLabel: string;
  birthData: {
    date: string;
    time: string;
    location: string;
  };
};

export function DodecaReadingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const birthData = {
      date: String(form.get("birthDate") ?? ""),
      time: String(form.get("birthTime") ?? ""),
      location: String(form.get("birthLocation") ?? ""),
    };
    setError(null);
    setCalculating(true);

    try {
      const response = await fetch("/api/reading/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: birthData.date,
          birthTime: birthData.time,
          birthLocation: birthData.location,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        reading?: Omit<ReadingApplication, "birthData">;
      };
      if (!response.ok || !data.reading) {
        throw new Error(data.error || "Your reading could not be calculated.");
      }

      const application: ReadingApplication = { ...data.reading, birthData };
      window.sessionStorage.setItem(PENDING_READING_KEY, JSON.stringify(application));
      router.push("/observer/reading/result");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your reading could not be calculated.");
      setCalculating(false);
    }
  }

  return (
    <form className="observer-reading-form" onSubmit={submit}>
      <header>
        <span>Private coordinates</span>
        <h2>The Whole Body Design Reading</h2>
        <p>Your birth coordinates are processed for this response and retained only in this browser.</p>
      </header>
      <label>
        <span>Birth date <b>Required</b></span>
        <input name="birthDate" type="date" required max={new Date().toISOString().slice(0, 10)} />
      </label>
      <div>
        <label>
          <span>Birth time <em>Optional</em></span>
          <input name="birthTime" type="time" />
        </label>
        <label>
          <span>Birth location <em>Optional</em></span>
          <input name="birthLocation" placeholder="City, region, country" type="text" maxLength={160} />
        </label>
      </div>
      <button disabled={calculating} type="submit">
        {calculating ? "Calculating coordinates…" : "Decode your House →"}
      </button>
      {error && <p className="observer-form-error" role="alert">{error}</p>}
      <small>No email · No account · No server-side birth record</small>
    </form>
  );
}
