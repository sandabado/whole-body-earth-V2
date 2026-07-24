"use client";

import Link from "next/link";
import {FormEvent, useEffect, useMemo, useRef, useState} from "react";
import type {SessionPrice} from "../../components/data";

type BookingWizardProps = {
  practitionerName: string;
  practitionerSlug: string;
  practitionerLocation: string;
  formats: readonly string[];
  pricing: readonly SessionPrice[];
  initialMinutes: number;
};

type ContactDetails = {
  name: string;
  email: string;
  intention: string;
  access: string;
  consent: boolean;
};

const emptyContact: ContactDetails = {
  name: "",
  email: "",
  intention: "",
  access: "",
  consent: false,
};

export function BookingWizard({
  practitionerName,
  practitionerSlug,
  practitionerLocation,
  formats,
  pricing,
  initialMinutes,
}: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [format, setFormat] = useState(formats[0]);
  const [contact, setContact] = useState<ContactDetails>(emptyContact);
  const stageRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  const selectedPrice = useMemo(
    () => pricing.find((option) => option.minutes === minutes) ?? pricing[0],
    [minutes, pricing],
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    stageRef.current?.focus();
  }, [step]);

  const advanceDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(2);
  };

  const advanceReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(3);
  };

  return (
    <div className="booking-wizard" aria-labelledby="request-panel-title">
      <div className="booking-wizard-head">
        <div>
          <p className="eyebrow">BETA REQUEST</p>
          <h2 id="request-panel-title">Shape your session.</h2>
        </div>
        <span className="secure-note">PRIVATE BY DESIGN</span>
      </div>

      <ol className="booking-steps" aria-label="Session request progress">
        {["Session", "About you", "Review"].map((label, index) => {
          const number = index + 1;
          return (
            <li key={label} className={step === number ? "active" : step > number ? "complete" : ""} aria-current={step === number ? "step" : undefined}>
              <span>{step > number ? "✓" : number}</span>{label}
            </li>
          );
        })}
      </ol>

      <div
        className="wizard-stage"
        ref={stageRef}
        tabIndex={-1}
        aria-label={`Step ${step} of 3: ${["Session", "About you", "Review"][step - 1]}`}
      >
      {step === 1 && (
        <form className="wizard-panel" onSubmit={advanceDetails}>
          <fieldset className="choice-fieldset">
            <legend>CHOOSE A SESSION LENGTH</legend>
            <div className="session-choice-grid">
              {pricing.map((option) => (
                <label key={option.minutes} className={minutes === option.minutes ? "selected" : ""}>
                  <input
                    type="radio"
                    name="length"
                    value={option.minutes}
                    checked={minutes === option.minutes}
                    onChange={() => setMinutes(option.minutes)}
                  />
                  <span><b>{option.duration}</b><strong>{option.price}</strong><small>{option.description}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="choice-fieldset">
            <legend>CHOOSE A FORMAT</legend>
            <div className="format-choice-grid">
              {formats.map((option) => (
                <label key={option} className={format === option ? "selected" : ""}>
                  <input type="radio" name="format" value={option} checked={format === option} onChange={() => setFormat(option)} />
                  <span><b>{option}</b><small>{option.includes("Proton") ? "Private encrypted video room" : `Held in ${practitionerLocation}`}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="wizard-summary-line"><span>{selectedPrice.duration} · {format}</span><strong>{selectedPrice.price}</strong></div>
          <button className="button ember" type="submit">CONTINUE <span aria-hidden="true">→</span></button>
          <p className="no-charge-note">No appointment is held and no payment is collected in this beta request.</p>
        </form>
      )}

      {step === 2 && (
        <form className="wizard-panel" onSubmit={advanceReview}>
          <label>
            FULL NAME
            <input value={contact.name} onChange={(event) => setContact({...contact, name: event.target.value})} required autoComplete="name" placeholder="Who are you?" />
          </label>
          <label>
            EMAIL
            <input type="email" value={contact.email} onChange={(event) => setContact({...contact, email: event.target.value})} required autoComplete="email" placeholder="Where should we write?" />
          </label>
          <label>
            WHAT WOULD YOU LIKE SUPPORT WITH?
            <textarea value={contact.intention} onChange={(event) => setContact({...contact, intention: event.target.value})} required rows={5} placeholder="A few honest sentences are enough." />
          </label>
          <label>
            ACCESS OR ACCOMMODATION NEEDS <span className="optional">OPTIONAL</span>
            <textarea value={contact.access} onChange={(event) => setContact({...contact, access: event.target.value})} rows={3} placeholder="Anything that would help this room meet you." />
          </label>
          <label className="check">
            <input type="checkbox" checked={contact.consent} onChange={(event) => setContact({...contact, consent: event.target.checked})} required />
            <span>I have read the <Link href="/presence/code">community code</Link> and consent to being contacted about this request.</span>
          </label>
          <div className="wizard-actions">
            <button className="button" type="button" onClick={() => setStep(1)}>← BACK</button>
            <button className="button ember" type="submit">REVIEW REQUEST <span aria-hidden="true">→</span></button>
          </div>
        </form>
      )}

      {step === 3 && (
        <section className="wizard-panel review-panel" aria-labelledby="review-title">
          <div className="review-state">READY TO JOIN BETA ACCESS</div>
          <h3 id="review-title">Review—not reserved.</h3>
          <p>
            Booking is not open yet. These details have not been sent or stored,
            and you will not be charged. Join the beta waitlist to be contacted
            when requests with {practitionerName} open.
          </p>
          <dl>
            <div><dt>PRACTITIONER</dt><dd>{practitionerName}</dd></div>
            <div><dt>SESSION</dt><dd>{selectedPrice.duration} · {selectedPrice.price}</dd></div>
            <div><dt>FORMAT</dt><dd>{format}</dd></div>
            <div><dt>NAME</dt><dd>{contact.name}</dd></div>
            <div><dt>EMAIL</dt><dd>{contact.email}</dd></div>
            <div><dt>INTENTION</dt><dd>{contact.intention}</dd></div>
            {contact.access && <div><dt>ACCESS</dt><dd>{contact.access}</dd></div>}
          </dl>
          <div className="wizard-actions">
            <button className="button" type="button" onClick={() => setStep(2)}>← EDIT</button>
            <Link className="button ember" href={`/presence/waitlist?practitioner=${practitionerSlug}`}>JOIN BETA WAITLIST <span aria-hidden="true">→</span></Link>
          </div>
          <p className="no-charge-note">The waitlist is not an appointment and does not authorize payment.</p>
        </section>
      )}
      </div>
    </div>
  );
}
