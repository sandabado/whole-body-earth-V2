"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { HudCard } from "../components/HudCard";

const services = [
  "Record Development / Production",
  "Mixing / Mastering",
  "Physical Release / Vinyl",
  "Sync / Campaign Strategy",
];

export function ApplyForm() {
  const [gateway, setGateway] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [buildingLength, setBuildingLength] = useState(0);
  const [whyLength, setWhyLength] = useState(0);

  const closeGateway = () => {
    setLeaving(true);
    window.setTimeout(() => setGateway(false), 950);
  };

  useEffect(() => {
    const timer = window.setTimeout(closeGateway, 3800);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      artistName: form.get("artistName"),
      email: form.get("email"),
      phone: form.get("phone"),
      genre: form.get("genre"),
      stage: form.get("stage"),
      portfolioPrimary: form.get("portfolioPrimary"),
      portfolioSecondary: form.get("portfolioSecondary"),
      servicesNeeded: form.getAll("servicesNeeded"),
      whatTheyBuild: form.get("whatTheyBuild"),
      whyStudios: form.get("whyStudios"),
      retainsIP: form.get("retainsIP"),
      consent: form.get("consent") === "yes",
      website: form.get("website"),
    };

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "Transmission failed.");
      }
      setDissolving(true);
      window.dispatchEvent(new Event("wbs-frequency"));
      window.dispatchEvent(new Event("wbs-bell"));
      window.setTimeout(() => setSubmitted(true), 780);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Transmission failed. Use the direct path below.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-shell">
        <HudCard className="confirmation">
          <p className="eyebrow">TRANSMISSION / RECEIVED</p>
          <h1>APPLICATION RECEIVED.</h1>
          <p>We review every submission within 14 days. If your work carries the <span className="shimmer">frequency</span>, we&apos;ll reach out.</p>
          <Link className="button" href="/">RETURN TO THE ROOM <b>→</b></Link>
        </HudCard>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {gateway && (
        <div className={`gateway ${leaving ? "gateway--leaving" : ""}`}>
          <div className="gateway-inner">
            <p>PARTNERSHIP GATEWAY / 001</p>
            <h1>NOT EVERYONE WHO APPLIES IS CHOSEN.<br /><span>WE TAKE ARTISTS WHO CARRY THE FREQUENCY.</span></h1>
            <button onClick={closeGateway}>ENTER THE APPLICATION</button>
          </div>
        </div>
      )}
      <header className="page-hero">
        <p className="eyebrow">PARTNERSHIP APPLICATION / SELECTIVE ENTRY</p>
        <h1>CARRY THE WORK.<br /><em>KEEP THE RIGHTS.</em></h1>
        <p>This is not a demo drop. Tell us what you are building, where it stands, and what infrastructure would let it become complete.</p>
      </header>
      <section className={`form-shell ${dissolving ? "dissolve-out" : ""}`}>
        <div className="form-intro">
          <p className="eyebrow">REQUIRED SIGNAL</p>
          <p>Every submission is reviewed by a person. We do not sell application data, scrape mailing lists, or use your work to train systems.</p>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <div className="field"><label htmlFor="artistName">Artist name *</label><input id="artistName" name="artistName" required placeholder="Artist or band name" /></div>
          <div className="field"><label htmlFor="email">Email *</label><input id="email" name="email" type="email" required placeholder="you@example.com" /></div>
          <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" placeholder="+1 555 000 0000" /></div>
          <div className="field"><label htmlFor="genre">Genre / current *</label><input id="genre" name="genre" required placeholder="Soul blues / desert rock / etc." /></div>

          <fieldset className="fieldset">
            <legend>Current stage *</legend>
            <div className="choice-grid">
              {["Writing", "Recording", "Released", "Touring"].map((stage) => <label key={stage}><input type="radio" name="stage" value={stage.toUpperCase()} required />{stage}</label>)}
            </div>
          </fieldset>

          <div className="field field--full"><label htmlFor="portfolioPrimary">Primary portfolio link *</label><input id="portfolioPrimary" name="portfolioPrimary" type="url" required placeholder="https://spotify.com/artist/..." /></div>
          <div className="field field--full"><label htmlFor="portfolioSecondary">Secondary link</label><input id="portfolioSecondary" name="portfolioSecondary" type="url" placeholder="https://bandcamp.com/..." /></div>

          <fieldset className="fieldset">
            <legend>What do you need? * Select at least one.</legend>
            <div className="choice-grid">
              {services.map((service, index) => <label key={service}><input type="checkbox" name="servicesNeeded" value={service} required={index === 0} onChange={(event) => {
                const form = event.currentTarget.form;
                if (!form) return;
                const boxes = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="servicesNeeded"]'));
                const checked = boxes.some((box) => box.checked);
                boxes.forEach((box) => { box.required = !checked; });
              }} />{service}</label>)}
            </div>
          </fieldset>

          <div className="field field--full">
            <label htmlFor="whatTheyBuild">What are you building? *</label>
            <textarea id="whatTheyBuild" name="whatTheyBuild" required maxLength={500} onChange={(event) => setBuildingLength(event.target.value.length)} placeholder="The project. The intention. What complete looks like." />
            <div className="field-help"><span>MAX 500 CHARACTERS</span><span>{buildingLength}/500</span></div>
          </div>
          <div className="field field--full">
            <label htmlFor="whyStudios">Why Whole Body Studios?</label>
            <textarea id="whyStudios" name="whyStudios" maxLength={300} onChange={(event) => setWhyLength(event.target.value.length)} placeholder="What draws you to this model?" />
            <div className="field-help"><span>MAX 300 CHARACTERS</span><span>{whyLength}/300</span></div>
          </div>

          <fieldset className="fieldset">
            <legend>Do you currently retain your masters / IP? *</legend>
            <div className="choice-grid">
              {["Yes", "No", "Unsure"].map((answer) => <label key={answer}><input type="radio" name="retainsIP" value={answer.toLowerCase()} required />{answer}</label>)}
            </div>
          </fieldset>

          <label className="consent-line"><input type="checkbox" name="consent" value="yes" required /><span>I understand Whole Body Studios operates on the Feed First model. Artists retain 100% IP. Studios earns on services rendered, not ownership. I agree to be contacted about this application.</span></label>
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
          {error && <p className="form-error" role="alert">SYS: {error.toUpperCase()}</p>}
          <button className="form-submit" disabled={loading || dissolving}>{loading ? "TRANSMITTING…" : "TRANSMIT"}</button>
        </form>
      </section>
    </div>
  );
}
