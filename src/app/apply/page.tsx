"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  APPLICATION_PILLARS,
  APPLICATION_PILLAR_IDS,
  isApplicationPillar,
  type ApplicationPillar,
} from "@/lib/application-pillars";

type RetainsIP = "yes" | "no" | "unsure" | "";

type FormState = {
  pillar: ApplicationPillar | "";
  artistName: string;
  email: string;
  phone: string;
  genre: string;
  stage: string;
  portfolioPrimary: string;
  portfolioSecondary: string;
  servicesNeeded: string[];
  whatBuilding: string;
  whyStudios: string;
  retainsIP: RetainsIP;
  consent: boolean;
  website: string;
};

const INITIAL_STATE: FormState = {
  pillar: "",
  artistName: "",
  email: "",
  phone: "",
  genre: "",
  stage: "WRITING",
  portfolioPrimary: "",
  portfolioSecondary: "",
  servicesNeeded: [],
  whatBuilding: "",
  whyStudios: "",
  retainsIP: "",
  consent: false,
  website: "",
};

export default function ApplyPage() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState | "submission", string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const requestedPillar = new URLSearchParams(window.location.search).get("pillar");
    if (!requestedPillar || !isApplicationPillar(requestedPillar)) return;
    const frame = window.requestAnimationFrame(() => {
      setForm((previous) => previous.pillar === requestedPillar ? previous : { ...previous, pillar: requestedPillar });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      submission: undefined,
    }));
  };

  const toggleService = (service: string) =>
    handleChange(
      "servicesNeeded",
      form.servicesNeeded.includes(service)
        ? form.servicesNeeded.filter((item) => item !== service)
        : [...form.servicesNeeded, service],
    );

  const selectPillar = (pillar: ApplicationPillar) => {
    setForm((previous) => ({
      ...previous,
      pillar,
      stage: "WRITING",
      servicesNeeded: [],
      retainsIP: "",
    }));
    setErrors({});
  };

  const selectedPillar = form.pillar ? APPLICATION_PILLARS[form.pillar] : null;

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.pillar)
      nextErrors.pillar = "Choose the pillar you are applying to";
    if (!form.artistName.trim()) nextErrors.artistName = "A name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = "Enter a valid email";
    if (!form.genre.trim()) nextErrors.genre = "Genre is required";
    if (!form.portfolioPrimary.trim())
      nextErrors.portfolioPrimary = "A primary portfolio link is required";
    if (!form.whatBuilding.trim())
      nextErrors.whatBuilding = "Tell us what you are building";
    if (!form.consent) nextErrors.consent = "Consent is required to submit";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          retainsIP:
            form.retainsIP === "yes"
              ? true
              : form.retainsIP === "no"
                ? false
                : null,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setSubmitted(true);
      setForm(INITIAL_STATE);
    } catch {
      setErrors({
        submission:
          "Something went wrong. Please try again or email us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
        <Card className="w-full max-w-md space-y-6 text-center">
          <div className="text-6xl">🍀</div>
          <h1 className="font-display text-3xl font-bold text-plasma">
            Application Received
          </h1>
          <p className="leading-relaxed text-ghost">
            We review every submission within 14 days. If there is a fit, we’ll
            reach out with the next step.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <section className="border-b border-mercury px-6 pt-12 pb-16">
        <div className="mx-auto max-w-[1200px] text-center">
          <Badge variant="success" pulse className="mb-6">
            OPEN FOR PARTNERSHIPS
          </Badge>
          <h1 className="mb-6 font-display text-4xl font-bold md:text-6xl">
            Find your
            <br />
            <span style={{ color: selectedPillar?.color ?? "#2ba8a0" }}>
              door in.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ghost">
            {selectedPillar
              ? selectedPillar.description
              : "Choose the Whole Body pillar that best fits the work, practice, or responsibility calling you now."}
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-[800px]">
          <form onSubmit={handleSubmit} className="space-y-12" noValidate>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(event) => handleChange("website", event.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <Card
              hud={false}
              style={
                selectedPillar
                  ? { borderColor: `${selectedPillar.color}88` }
                  : undefined
              }
            >
              <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
                <span style={{ color: selectedPillar?.color ?? "#2ba8a0" }}>
                  01
                </span>{" "}
                Choose Your Pillar
              </h2>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ghost">
                  I am applying to
                </span>
                <select
                  value={form.pillar}
                  onChange={(event) =>
                    selectPillar(event.target.value as ApplicationPillar)
                  }
                  className="mt-2 w-full border border-mercury bg-void px-3 py-3 text-bone outline-none transition focus:border-water"
                >
                  <option value="">Select a pillar</option>
                  {APPLICATION_PILLAR_IDS.map((pillar) => (
                    <option key={pillar} value={pillar}>
                      {APPLICATION_PILLARS[pillar].symbol} Whole Body{" "}
                      {APPLICATION_PILLARS[pillar].name}
                    </option>
                  ))}
                </select>
                {errors.pillar && (
                  <p className="mt-2 text-xs text-red-300">{errors.pillar}</p>
                )}
              </label>
              {selectedPillar && (
                <p
                  className="mt-5 border-l-2 pl-4 text-sm leading-relaxed text-ghost"
                  style={{ borderColor: selectedPillar.color }}
                >
                  <span
                    className="font-display text-lg"
                    style={{ color: selectedPillar.color }}
                  >
                    {selectedPillar.symbol} {selectedPillar.name}
                  </span>
                  <br />
                  {selectedPillar.description}
                </p>
              )}
            </Card>

            {selectedPillar ? (
              <>
                <Card hud={false}>
                  <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
                    <span style={{ color: selectedPillar.color }}>02</span>{" "}
                    Basic Information
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label={selectedPillar.nameLabel}
                      value={form.artistName}
                      onChange={(event) =>
                        handleChange("artistName", event.target.value)
                      }
                      error={errors.artistName}
                      placeholder="Your name, project, or organization"
                      autoComplete="name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        handleChange("email", event.target.value)
                      }
                      error={errors.email}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    <Input
                      label="Phone (optional)"
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        handleChange("phone", event.target.value)
                      }
                      placeholder="+1 (555) 000-0000"
                      autoComplete="tel"
                    />
                    <Input
                      label={selectedPillar.disciplineLabel}
                      value={form.genre}
                      onChange={(event) =>
                        handleChange("genre", event.target.value)
                      }
                      error={errors.genre}
                      placeholder={selectedPillar.disciplinePlaceholder}
                    />
                  </div>
                </Card>

                <Card hud={false}>
                  <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
                    <span style={{ color: selectedPillar.color }}>03</span>{" "}
                    Current Stage
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {selectedPillar.stages.map(([stage, label]) => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => handleChange("stage", stage)}
                        className={`rounded-xl px-4 py-2 font-mono text-sm transition-colors ${form.stage === stage ? "text-void" : "bg-mercury/20 text-ghost hover:text-bone"}`}
                        style={
                          form.stage === stage
                            ? { backgroundColor: selectedPillar.color }
                            : undefined
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-ghost">
                    Choose the stage that best reflects where this work is now.
                  </p>
                </Card>

                <Card hud={false}>
                  <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
                    <span style={{ color: selectedPillar.color }}>04</span>{" "}
                    Portfolio
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label={`${selectedPillar.portfolioLabel} (required)`}
                      value={form.portfolioPrimary}
                      onChange={(event) =>
                        handleChange("portfolioPrimary", event.target.value)
                      }
                      error={errors.portfolioPrimary}
                      placeholder={selectedPillar.portfolioPlaceholder}
                      inputMode="url"
                    />
                    <Input
                      label="Secondary link (optional)"
                      value={form.portfolioSecondary}
                      onChange={(event) =>
                        handleChange("portfolioSecondary", event.target.value)
                      }
                      placeholder="Another useful link"
                      inputMode="url"
                    />
                  </div>
                </Card>

                <Card id="services-needed" hud={false}>
                  <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
                    <span style={{ color: selectedPillar.color }}>05</span> What
                    Do You Need?
                  </h2>
                  <p className="mb-4 text-sm text-ghost">
                    Select all that apply:
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedPillar.services.map((service) => (
                      <label
                        key={service}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${form.servicesNeeded.includes(service) ? "bg-mercury/30" : "border-mercury bg-mercury/20"}`}
                        style={
                          form.servicesNeeded.includes(service)
                            ? { borderColor: selectedPillar.color }
                            : undefined
                        }
                      >
                        <input
                          type="checkbox"
                          checked={form.servicesNeeded.includes(service)}
                          onChange={() => toggleService(service)}
                          className="h-4 w-4"
                          style={{ accentColor: selectedPillar.color }}
                        />
                        <span className="font-mono text-sm text-bone">
                          {service}
                        </span>
                      </label>
                    ))}
                  </div>
                </Card>

                <Card hud={false}>
                  <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
                    <span style={{ color: selectedPillar.color }}>06</span>{" "}
                    Vision
                  </h2>
                  <Textarea
                    label={`${selectedPillar.buildingLabel} (500 characters max)`}
                    value={form.whatBuilding}
                    onChange={(event) =>
                      handleChange("whatBuilding", event.target.value)
                    }
                    error={errors.whatBuilding}
                    maxLength={500}
                    placeholder="Describe the work, its context, and what support would make a difference..."
                  />
                  <p className="mt-2 text-right text-xs text-ghost">
                    {form.whatBuilding.length}/500
                  </p>
                </Card>

                <Card hud={false}>
                  <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
                    <span style={{ color: selectedPillar.color }}>07</span>{" "}
                    Alignment
                  </h2>
                  <Textarea
                    label={`${selectedPillar.alignmentLabel} (300 characters max)`}
                    value={form.whyStudios}
                    onChange={(event) =>
                      handleChange("whyStudios", event.target.value)
                    }
                    maxLength={300}
                    placeholder="Tell us what makes this a meaningful fit..."
                  />
                  <p className="mt-2 text-right text-xs text-ghost">
                    {form.whyStudios.length}/300
                  </p>
                </Card>

                <Card hud={false} className="bg-carbon/50">
                  <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
                    <span style={{ color: selectedPillar.color }}>08</span>{" "}
                    Agreement
                  </h2>
                  <div className="space-y-4">
                    {selectedPillar.asksAboutIP && (
                      <div className="space-y-3">
                        {[
                          [
                            "yes",
                            "Yes, I currently retain my masters/IP",
                            "This is aligned with our model",
                          ],
                          [
                            "no",
                            "No, I don’t currently retain my masters",
                            "We can discuss options during discovery",
                          ],
                          [
                            "unsure",
                            "Unsure",
                            "We can clarify during discovery",
                          ],
                        ].map(([value, title, description]) => (
                          <label
                            key={value}
                            className="flex cursor-pointer items-start gap-3"
                          >
                            <input
                              type="radio"
                              name="retainsIP"
                              value={value}
                              checked={form.retainsIP === value}
                              onChange={() =>
                                handleChange("retainsIP", value as RetainsIP)
                              }
                              className="mt-1"
                              style={{ accentColor: selectedPillar.color }}
                            />
                            <span>
                              <span className="block font-semibold text-bone">
                                {title}
                              </span>
                              <span className="text-sm text-ghost">
                                {description}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${errors.consent ? "border-red-500 bg-red-500/10" : "border-mercury bg-mercury/20"}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(event) =>
                          handleChange("consent", event.target.checked)
                        }
                        className="mt-1 h-4 w-4"
                        style={{ accentColor: selectedPillar.color }}
                      />
                      <span className="text-sm text-ghost">
                        I understand Whole Body {selectedPillar.name} operates
                        through mutual alignment, clear expectations, and
                        respectful stewardship.
                        <span className="mt-1 block">
                          I agree to be contacted about this application.
                        </span>
                      </span>
                    </label>
                  </div>
                </Card>

                {errors.submission && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-500 bg-red-500/10 p-4 text-center text-sm text-red-300"
                  >
                    {errors.submission}
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={submitting || !form.consent}
                >
                  {submitting
                    ? "Submitting..."
                    : `Apply to ${selectedPillar.name} →`}
                </Button>
              </>
            ) : (
              <Card hud={false} className="text-center">
                <p className="font-display text-2xl text-bone">
                  Choose a pillar to begin.
                </p>
                <p className="mt-3 text-sm text-ghost">
                  The application will adapt to the work, practice, or
                  responsibility you are bringing.
                </p>
              </Card>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
