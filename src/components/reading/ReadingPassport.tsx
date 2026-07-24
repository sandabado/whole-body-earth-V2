"use client";

import Link from "next/link";
import { PILLARS } from "@/lib/pillars";
import type { ReadingResult } from "@/lib/reading-engine";
import {
  bodyMatrix,
  formatDegrees,
  placementSymbol,
  primaryPractice,
} from "@/lib/reading-passport";
import { QuincunxDisplay } from "@/components/reading/QuincunxDisplay";
import { PassportOffers } from "@/components/reading/PassportOffers";
import { ReadingMath } from "@/components/reading/ReadingMath";

type Props = {
  generatedAt: Date;
  passportId: string;
  result: ReadingResult;
  saved: boolean;
  onRestart: () => void;
};

export function ReadingPassport({
  generatedAt,
  passportId,
  result,
  saved,
  onRestart,
}: Props) {
  const pillar = PILLARS[result.dominantPillar];
  const secondary = result.secondaryPillar
    ? PILLARS[result.secondaryPillar]
    : null;
  const dominantBody = pillar.body.replace(" body", "");
  const secondaryBody = secondary?.body.replace(" body", "");
  const placements = [...result.placements].sort(
    (first, second) => second.weight - first.weight,
  );
  const matrix = bodyMatrix(result);
  const practice = primaryPractice(result);
  const sun = placements.find((placement) => placement.key === "sun");
  const moon = placements.find((placement) => placement.key === "moon");
  const ascendant = placements.find(
    (placement) => placement.key === "ascendant",
  );
  const midheaven = placements.find(
    (placement) => placement.key === "midheaven",
  );

  return (
    <section className="space-y-6 pb-8">
      <header className="relative overflow-hidden border border-press/50 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,.2),transparent_52%),linear-gradient(145deg,rgba(25,25,38,.96),rgba(5,5,8,.96))] p-6 shadow-[0_22px_70px_rgba(0,0,0,.36)] sm:p-10">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 rounded-full border border-press/35"
        />
        <div
          aria-hidden="true"
          className="absolute right-10 bottom-[-3.5rem] h-44 w-44 rotate-45 border border-guardian/25"
        />
        <div className="relative flex flex-wrap items-start justify-between gap-5 border-b border-mercury/80 pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-press">
              Your Star Passport
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[.13em] text-ghost">
              Whole Body Design Reading · {passportId}
            </p>
          </div>
          <span className="border border-press/65 bg-press/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[.13em] text-press">
            Alignment {result.confidence}%
          </span>
        </div>
        <div className="relative pt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[.17em] text-ghost">
            Your chart, held as a {pillar.solid}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[.95] text-bone sm:text-6xl">
            {pillar.symbol} {dominantBody}{" "}
            <span style={{ color: pillar.color }}>/{" "}{pillar.elementLabel}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl font-display text-xl leading-8 text-bone/90 sm:text-2xl">
            You are not seeking information. You are remembering your
            coordinates.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-ghost">
            This passport maps the placements that shape your work through the
            five bodies, then gives you one practical doorway back into the
            constellation.
          </p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[.92fr_1.08fr]">
        <article className="border border-mercury bg-carbon/88 p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-press">
            01 · Core identity
          </p>
          <h3 className="mt-3 font-display text-3xl text-bone sm:text-4xl">
            The {pillar.body.toLowerCase()} leads.
          </h3>
          <p className="mt-5 leading-7 text-ghost">
            {sun
              ? `Your Sun in ${sun.sign} is weighted through your ${dominantBody.toLowerCase()} body: ${pillar.elementLabel}, ${pillar.solid}, and the ${pillar.body.toLowerCase()}.`
              : `Your ${dominantBody.toLowerCase()} body is the current doorway into your work.`}{" "}
            {moon
              ? `Your Moon in ${moon.sign} names the emotional weather that needs to be held alongside it.`
              : ""}
          </p>
          <dl className="mt-7 grid grid-cols-2 gap-px border border-mercury bg-mercury">
            <Coordinate
              label="Dominant element"
              value={pillar.elementLabel}
              color={pillar.color}
            />
            <Coordinate
              label="Geometry"
              value={pillar.solid}
              color={pillar.color}
            />
            <Coordinate
              label="Sun"
              value={
                sun
                  ? `${sun.sign}${formatDegrees(sun.degrees) ? ` · ${formatDegrees(sun.degrees)}` : ""}`
                  : "—"
              }
              color={pillar.color}
            />
            <Coordinate
              label="Moon"
              value={
                moon
                  ? `${moon.sign}${formatDegrees(moon.degrees) ? ` · ${formatDegrees(moon.degrees)}` : ""}`
                  : "—"
              }
              color={pillar.color}
            />
          </dl>
          {secondary ? (
            <p
              className="mt-6 border-l-2 pl-4 text-sm leading-6 text-ghost"
              style={{ borderColor: secondary.color }}
            >
              Secondary activation:{" "}
              <span style={{ color: secondary.color }}>
                {secondaryBody} / {secondary.elementLabel}
              </span>.
              Let it support the lead body instead of competing for the wheel.
            </p>
          ) : null}
        </article>

        <article className="border border-mercury bg-steel/75 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-press">
                Quincunx field
              </p>
              <h3 className="mt-2 font-display text-2xl text-bone">
                The five bodies in relation.
              </h3>
            </div>
            <span className="inline-flex items-center gap-2 border border-mercury px-3 py-2 font-mono text-[10px] uppercase tracking-[.13em] text-bone">
              <span className="pulse-dot" />
              {result.confidenceLabel}
            </span>
          </div>
          <div className="mt-3">
            <QuincunxDisplay
              scores={result.scores}
              guardian={result.isGuardian}
            />
          </div>
          <p className="mx-auto max-w-md text-center text-sm leading-6 text-ghost">
            The outer four bodies show weighted placement patterns. The center
            reflects how evenly those bodies are held—not a separate
            astrological placement.
          </p>
        </article>
      </section>

      {result.warning ? (
        <p className="border border-press/55 bg-press/10 px-5 py-4 text-sm leading-6 text-bone">
          {result.warning}
        </p>
      ) : null}

      <ReadingMath result={result} />

      <section className="border border-mercury bg-carbon/82 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-press">
              02 · Body matrix
            </p>
            <h3 className="mt-2 font-display text-3xl text-bone">
              How your five bodies inhabit the work.
            </h3>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ghost">
            Weight is derived from the calculated placements. Coherence
            describes the relative balance of the four outer bodies.
          </p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {matrix.map((entry) => {
            const entryPillar = PILLARS[entry.pillarId];
            return (
              <article
                key={entry.body}
                className="flex min-h-72 flex-col border p-5"
                style={{
                  borderColor: `${entryPillar.color}88`,
                  backgroundColor: `${entryPillar.color}10`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="text-2xl"
                    style={{ color: entryPillar.color }}
                  >
                    {entryPillar.symbol}
                  </span>
                  <span
                    className="font-mono text-2xl"
                    style={{ color: entryPillar.color }}
                  >
                    {entry.score}%
                  </span>
                </div>
                <p
                  className="mt-5 font-mono text-[10px] uppercase tracking-[.15em]"
                  style={{ color: entryPillar.color }}
                >
                  {entry.body} · {entry.measure}
                </p>
                <h4 className="mt-2 font-display text-xl text-bone">
                  {entry.status}
                </h4>
                <p className="mt-4 text-sm leading-6 text-ghost">
                  <span className="text-bone">Shadow:</span> {entry.shadow}
                </p>
                <p
                  className="mt-auto border-t pt-4 text-sm leading-6 text-bone/90"
                  style={{ borderColor: `${entryPillar.color}55` }}
                >
                  {entry.remedy}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.18fr_.82fr]">
        <article className="border border-mercury bg-carbon/82 p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-press">
            03 · Arrival conditions
          </p>
          <h3 className="mt-2 font-display text-3xl text-bone">
            The placements that carry the pattern.
          </h3>
          <div className="mt-7 divide-y divide-mercury/80 border-y border-mercury/80">
            {placements.map((placement) => (
              <div
                key={placement.key}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto]"
              >
                <span className="font-display text-xl text-press">
                  {placementSymbol(placement)}
                </span>
                <span>
                  <span className="block text-sm text-bone">
                    {placement.label}{" "}
                    <span className="text-ghost">in {placement.sign}</span>
                  </span>
                  <span className="mt-1 block font-mono text-[9px] uppercase tracking-[.12em] text-ghost">
                    {placement.description}
                  </span>
                </span>
                <span className="font-mono text-xs text-press">
                  {formatDegrees(placement.degrees) || "—"}
                </span>
                <span className="hidden font-mono text-[10px] uppercase text-ghost sm:block">
                  {placement.house
                    ? `House ${placement.house}`
                    : `+${placement.weight}`}
                </span>
              </div>
            ))}
          </div>
          {!result.warning && (ascendant || midheaven) ? (
            <p className="mt-5 text-sm leading-6 text-ghost">
              {ascendant ? `Ascendant ${ascendant.sign}` : ""}
              {ascendant && midheaven ? " · " : ""}
              {midheaven ? `Midheaven ${midheaven.sign}` : ""}. These time-bound
              points are included because a birth time was supplied.
            </p>
          ) : null}
        </article>
        <article
          className="border p-6 sm:p-8"
          style={{
            borderColor: `${practice.pillar.color}99`,
            backgroundColor: `${practice.pillar.color}12`,
          }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[.18em]"
            style={{ color: practice.pillar.color }}
          >
            04 · One grounded next step
          </p>
          <h3 className="mt-3 font-display text-3xl text-bone">
            {practice.title}
          </h3>
          <p className="mt-5 leading-7 text-ghost">{practice.detail}</p>
          <Link
            href={practice.href}
            className="mt-8 inline-flex border px-4 py-3 font-mono text-[10px] uppercase tracking-[.13em] transition hover:bg-white/10"
            style={{
              color: practice.pillar.color,
              borderColor: practice.pillar.color,
            }}
          >
            Explore {practice.pillar.body.replace(" body", "")} practices →
          </Link>
          <div className="mt-8 border-t border-mercury pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[.15em] text-ghost">
              Continue with intention
            </p>
            <Link
              href="/events"
              className="mt-3 inline-block text-sm text-bone transition hover:text-press"
            >
              See gatherings, releases, and open fieldwork →
            </Link>
          </div>
        </article>
      </section>

      <PassportOffers passportId={passportId} />

      <footer className="border-t border-mercury px-1 pt-6 text-center">
        <p className="font-display text-xl text-bone">
          This is not fortune-telling. These are coordinates.
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-ghost">
          Generated{" "}
          {generatedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · Quincunx v1 · Swiss Ephemeris natal calculation.{" "}
          {saved
            ? "Saved to your account."
            : "Guest birth details are not stored."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="border border-mercury px-4 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-bone transition hover:border-press hover:text-press"
          >
            Print / Save PDF
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="px-4 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-ghost transition hover:text-press"
          >
            ← Take another reading
          </button>
        </div>
      </footer>
    </section>
  );
}

function Coordinate({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-carbon p-4">
      <dt className="font-mono text-[9px] uppercase tracking-[.13em] text-ghost">
        {label}
      </dt>
      <dd className="mt-2 font-display text-lg" style={{ color }}>
        {value}
      </dd>
    </div>
  );
}
