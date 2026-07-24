"use client";

import { useState } from "react";
import type { ReadingResult } from "@/lib/reading-engine";
import { ReadingPassport } from "@/components/reading/ReadingPassport";
import { ReadingEngineLoader } from "@/components/reading/ReadingEngineLoader";

type ReadingResponse = { result: ReadingResult; saved: boolean };

export function ReadingWorkbench() {
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [passportId, setPassportId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(form: HTMLFormElement) {
    setLoading(true);
    setError(null);
    const data = new FormData(form);
    const loadingStart = Date.now();
    const completeLoadingTransition = async () => {
      const remaining = 4800 - (Date.now() - loadingStart);
      if (remaining > 0)
        await new Promise<void>((resolve) => window.setTimeout(resolve, remaining));
    };
    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: data.get("birthDate"),
          birthTime: data.get("birthTime"),
          birthPlace: data.get("birthPlace"),
          website: data.get("website"),
        }),
      });
      const payload = (await response.json()) as Partial<ReadingResponse> & {
        error?: string;
      };
      if (!response.ok || !payload.result) {
        throw new Error(payload.error || "The reading could not be calculated.");
      }
      await completeLoadingTransition();
      setResult(payload.result);
      setSaved(Boolean(payload.saved));
      setGeneratedAt(new Date());
      setPassportId(
        `WB-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`,
      );
    } catch (reason) {
      await completeLoadingTransition();
      setError(
        reason instanceof Error ? reason.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!result) {
    return (
      <form
        id="start-reading"
        className="relative border border-mercury bg-steel/80 p-7 shadow-[0_24px_80px_rgba(0,0,0,.36)] sm:p-9 lg:p-10"
          onSubmit={(event) => {
            event.preventDefault();
            void submit(event.currentTarget);
          }}
        >
          {loading ? (
            <ReadingEngineLoader />
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-5 border-b border-mercury pb-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.2em] text-press">
                    Reading intake / 01
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-bone">
                    Begin your passport.
                  </h2>
                </div>
                <span className="inline-flex items-center gap-2 border border-press/40 bg-press/5 px-3 py-2 font-mono text-[9px] uppercase tracking-[.13em] text-press">
                  <span className="h-1.5 w-1.5 rounded-full bg-press" />
                  Private by default
                </span>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-ghost">
                Birth time makes the reading more precise. If you don&apos;t know
                it, we&apos;ll create a complete core reading without it.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Date of birth" required htmlFor="birthDate">
                  <input
                    required
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    autoComplete="bday"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Time of birth" hint="Optional" htmlFor="birthTime">
                  <input
                    id="birthTime"
                    name="birthTime"
                    type="time"
                    autoComplete="off"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Place of birth" required htmlFor="birthPlace" className="sm:col-span-2">
                  <input
                    required
                    id="birthPlace"
                    name="birthPlace"
                    placeholder="City, State, Country"
                    autoComplete="off"
                    className={fieldClass}
                  />
                </Field>
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
              </div>
              {error ? (
                <p role="alert" className="mt-5 border border-fire/50 bg-fire/10 px-4 py-3 text-sm text-bone">
                  {error}
                </p>
              ) : null}
              <button
                disabled={loading}
                className="mt-7 flex w-full items-center justify-between bg-press px-5 py-4 text-left font-mono text-[11px] uppercase tracking-[.14em] text-void transition hover:bg-[#f3d26e] disabled:cursor-wait disabled:opacity-60"
              >
                <span>Generate my Star Passport</span>
                <span className="font-display text-xl leading-none">→</span>
              </button>
              <div className="mt-5 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-mercury pt-4 font-mono text-[9px] uppercase tracking-[.12em] text-ghost">
                <span>No email required</span>
                <span>Guest details aren&apos;t stored</span>
                <span>4 minute experience</span>
              </div>
              <p className="mt-5 text-xs leading-5 text-ghost/80">
                A reflective framework for self-inquiry—not medical,
                psychological, legal, or financial advice.
              </p>
            </>
          )}
      </form>
    );
  }

  return (
    <ReadingPassport
      generatedAt={generatedAt ?? new Date()}
      passportId={passportId}
      result={result}
      saved={saved}
      onRestart={() => {
        setResult(null);
        setSaved(false);
        setGeneratedAt(null);
        setPassportId("");
      }}
    />
  );
}

const fieldClass =
  "mt-2 block w-full border border-mercury bg-carbon px-4 py-3 text-bone outline-none transition placeholder:text-ghost/55 focus:border-press focus:bg-void";

function Field({
  label,
  hint,
  required,
  htmlFor,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={`block ${className ?? ""}`}>
      <span className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[.15em] text-ghost">
        <span>
          {label}
          {required ? <span className="ml-1 text-press">*</span> : null}
        </span>
        {hint ? <span className="normal-case tracking-normal text-ghost/70">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}
