import { PILLARS } from "@/lib/pillars";
import type { ReadingResult } from "@/lib/reading-engine";

export function ReadingMath({ result }: { result: ReadingResult }) {
  const total = result.scores.reduce((sum, score) => sum + score.score, 0);
  const rawScores = result.scores.map((score) => score.score);
  const percentages = result.scores.map((score) => score.percentage);
  const maximum = Math.max(...rawScores);
  const minimum = Math.min(...rawScores);
  const average = rawScores.reduce((sum, score) => sum + score, 0) / rawScores.length;
  const guardianThreshold = average * 0.5;
  const leader = result.scores[0];
  const runnerUp = result.scores[1];
  const secondaryGap = leader.percentage - runnerUp.percentage;
  const coherence = Math.max(
    0,
    Math.round(
      100 - (Math.max(...percentages) - Math.min(...percentages)) * 1.5,
    ),
  );

  return (
    <section className="border border-press/55 bg-[linear-gradient(145deg,rgba(212,175,55,.1),rgba(14,14,22,.9))] p-6 sm:p-8">
      <div className="grid gap-5 border-b border-mercury/80 pb-6 lg:grid-cols-[1fr_.8fr] lg:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-press">
            Calculation receipt
          </p>
          <h3 className="mt-2 font-display text-3xl text-bone">
            The math behind this reading.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-ghost">
            Every placement is assigned to a body by its sign&apos;s element, then
            multiplied by a fixed weight. No points are added for the degree or
            house.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase leading-5 tracking-[.12em] text-ghost lg:text-right">
          Fire → Spiritual · Air → Mental
          <br />
          Water → Emotional · Earth → Physical
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {result.scores.map((score) => {
          const scorePillar = PILLARS[score.pillarId];
          return (
            <article
              key={score.body}
              className="border bg-void/35 p-5"
              style={{ borderColor: `${scorePillar.color}66` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[.15em]"
                    style={{ color: scorePillar.color }}
                  >
                    {score.body} / {scorePillar.elementLabel}
                  </p>
                  <p className="mt-2 font-display text-xl text-bone">
                    {score.placements.length
                      ? score.placements
                          .map(
                            (placement) =>
                              `${placement.label} in ${placement.sign} (${placement.weight})`,
                          )
                          .join(" + ")
                      : "No placements"}
                  </p>
                </div>
                <span
                  className="shrink-0 font-mono text-2xl"
                  style={{ color: scorePillar.color }}
                >
                  {score.score}
                </span>
              </div>
              <p className="mt-5 border-t border-mercury/70 pt-4 font-mono text-[11px] text-bone/85">
                round(({score.score} ÷ {total}) × 100) = {score.percentage}%
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-px border border-mercury bg-mercury md:grid-cols-2 xl:grid-cols-4">
        <MathRule
          label={result.isGuardian ? "Highest outer score" : "Lead body"}
          equation={`${leader.score} is the highest score`}
          result={`${leader.body} / ${PILLARS[leader.pillarId].elementLabel}`}
        />
        <MathRule
          label="Guardian test"
          equation={`${maximum} − ${minimum} = ${formatNumber(maximum - minimum)}; limit = ${formatNumber(guardianThreshold)}`}
          result={
            result.isGuardian
              ? "Pass: spread ≤ limit"
              : "No: spread > limit"
          }
        />
        <MathRule
          label={result.isGuardian ? "Supporting pillar" : "Secondary test"}
          equation={
            result.isGuardian
              ? "Guardian uses the highest outer score"
              : `${leader.percentage}% − ${runnerUp.percentage}% = ${secondaryGap} points; limit = 15`
          }
          result={
            result.isGuardian
              ? PILLARS[leader.pillarId].name
              : result.secondaryPillar
              ? `${PILLARS[result.secondaryPillar].name} qualifies`
              : "No secondary qualifies"
          }
        />
        <MathRule
          label="Alignment"
          equation={
            result.isGuardian
              ? "Guardian readings use 85"
              : `clamp(55 + ${leader.percentage}, 58, 95)`
          }
          result={`${result.confidence}%`}
        />
      </div>

      <p className="mt-5 font-mono text-[10px] leading-5 tracking-[.08em] text-ghost">
        Ethereal coherence = round(100 − (highest percentage − lowest
        percentage) × 1.5) = {coherence}%
        {result.isGuardian
          ? "; the displayed Ethereal score becomes 100% when the Guardian test passes."
          : "."}
      </p>
    </section>
  );
}

function MathRule({
  label,
  equation,
  result,
}: {
  label: string;
  equation: string;
  result: string;
}) {
  return (
    <div className="bg-carbon p-5">
      <p className="font-mono text-[9px] uppercase tracking-[.14em] text-ghost">
        {label}
      </p>
      <p className="mt-3 font-mono text-[11px] leading-5 text-bone/75">
        {equation}
      </p>
      <p className="mt-2 text-sm text-press">{result}</p>
    </div>
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
