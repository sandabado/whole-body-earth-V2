import {
  bodyToPillar,
  placementWeights,
  signToBody,
  type Body,
  type OuterBody,
  type PlacementKey,
} from "@/lib/astrology";
import { PILLARS, type PillarId } from "@/lib/pillars";

export type NatalChart = Record<
  PlacementKey,
  { sign: string; degrees?: number; house?: number }
>;

export type PlacementDetail = {
  key: PlacementKey;
  label: string;
  sign: string;
  degrees?: number;
  house?: number;
  body: OuterBody;
  weight: number;
  description: string;
};

export type BodyScore = {
  body: OuterBody;
  pillarId: PillarId;
  score: number;
  percentage: number;
  color: string;
  placements: PlacementDetail[];
};

export type ReadingResult = {
  dominantPillar: PillarId;
  dominantBody: Body;
  secondaryPillar: PillarId | null;
  isGuardian: boolean;
  scores: BodyScore[];
  placements: PlacementDetail[];
  confidence: number;
  confidenceLabel: string;
  warning: string | null;
};

const OUTER_BODIES: OuterBody[] = [
  "Physical",
  "Mental",
  "Emotional",
  "Spiritual",
];
const TIME_BOUND_KEYS: PlacementKey[] = [
  "ascendant",
  "midheaven",
  "descendant",
];

export function calculateReading(
  chart: NatalChart,
  hasBirthTime: boolean,
): ReadingResult {
  const scoreMap = Object.fromEntries(
    OUTER_BODIES.map((body) => [
      body,
      { score: 0, placements: [] as PlacementDetail[] },
    ]),
  ) as Record<OuterBody, { score: number; placements: PlacementDetail[] }>;
  const placements: PlacementDetail[] = [];

  for (const key of Object.keys(placementWeights) as PlacementKey[]) {
    if (!hasBirthTime && TIME_BOUND_KEYS.includes(key)) continue;
    const placement = chart[key];
    const weight = placementWeights[key];
    const body = signToBody(placement.sign);
    const detail: PlacementDetail = {
      key,
      label: weight.label,
      sign: placement.sign,
      degrees: placement.degrees,
      house: placement.house,
      body,
      weight: weight.weight,
      description: weight.description,
    };
    scoreMap[body].score += weight.weight;
    scoreMap[body].placements.push(detail);
    placements.push(detail);
  }

  const total = OUTER_BODIES.reduce(
    (sum, body) => sum + scoreMap[body].score,
    0,
  );
  const scores = OUTER_BODIES.map((body) => {
    const pillarId = bodyToPillar[body];
    return {
      body,
      pillarId,
      score: scoreMap[body].score,
      percentage: total ? Math.round((scoreMap[body].score / total) * 100) : 0,
      color: PILLARS[pillarId].color,
      placements: scoreMap[body].placements,
    };
  }).sort((a, b) => b.score - a.score);

  const values = scores.map((score) => score.score);
  const average = values.reduce((sum, score) => sum + score, 0) / values.length;
  const isGuardian =
    average > 0 && Math.max(...values) - Math.min(...values) <= average * 0.5;
  const leader = scores[0];
  const secondary =
    scores[1].percentage > 0 && leader.percentage - scores[1].percentage <= 15
      ? scores[1]
      : null;

  return {
    dominantPillar: isGuardian ? "guardian" : leader.pillarId,
    dominantBody: isGuardian ? "Ethereal" : leader.body,
    secondaryPillar: isGuardian
      ? leader.pillarId
      : (secondary?.pillarId ?? null),
    isGuardian,
    scores,
    placements,
    confidence: isGuardian
      ? 85
      : Math.min(95, Math.max(58, 55 + leader.percentage)),
    confidenceLabel: isGuardian
      ? "Ethereal integration"
      : leader.percentage >= 35
        ? "Strong alignment"
        : "Clear alignment",
    warning: hasBirthTime
      ? null
      : "Birth time was not supplied, so Ascendant, Midheaven, and Descendant are excluded from this reading.",
  };
}
