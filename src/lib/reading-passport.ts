import { PILLARS, type PillarId } from "@/lib/pillars";
import type { Body, OuterBody } from "@/lib/astrology";
import type {
  BodyScore,
  PlacementDetail,
  ReadingResult,
} from "@/lib/reading-engine";

const BODY_ORDER: OuterBody[] = [
  "Spiritual",
  "Mental",
  "Emotional",
  "Physical",
];

const BODY_GUIDANCE: Record<
  Body,
  { status: string; shadow: string; remedy: string; action: string }
> = {
  Spiritual: {
    status: "Ignited",
    shadow: "Urgency can outrun the container that holds it.",
    remedy: "Make one promise you can keep this week, then keep it in public.",
    action: "Return to the circle",
  },
  Mental: {
    status: "Sharp",
    shadow: "Analysis can become a substitute for making contact.",
    remedy: "Turn one thought into a named page, signal, or conversation.",
    action: "Build the signal",
  },
  Emotional: {
    status: "Flowing",
    shadow: "Sensitivity can become diffusion without a vessel.",
    remedy:
      "Give one feeling a form: a song, image, voice note, or honest ask.",
    action: "Make the work",
  },
  Physical: {
    status: "Grounded",
    shadow: "Stability can harden into delay or over-control.",
    remedy:
      "Tend the smallest physical system that will support your next move.",
    action: "Tend what holds",
  },
  Ethereal: {
    status: "Holding",
    shadow: "The whole disappears when every part tries to lead at once.",
    remedy: "Create a quiet pause before choosing the next structure.",
    action: "Hold the whole",
  },
};

const PLANET_SYMBOLS: Record<PlacementDetail["key"], string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  northNode: "☊",
  southNode: "☋",
  ascendant: "↑",
  midheaven: "MC",
  descendant: "↓",
};

export type PassportBody = {
  body: Body;
  pillarId: PillarId;
  score: number;
  measure: "weight" | "coherence";
  status: string;
  shadow: string;
  remedy: string;
  action: string;
};

function statusFor(score: BodyScore, leadingScore: BodyScore) {
  const base = BODY_GUIDANCE[score.body].status;
  if (score.body === leadingScore.body) return `${base} · leading`;
  if (score.percentage >= 25) return `${base} · active`;
  return `${base} · supporting`;
}

export function bodyMatrix(result: ReadingResult): PassportBody[] {
  const scores = new Map(result.scores.map((score) => [score.body, score]));
  const leading = result.scores[0];
  const outerBodies = BODY_ORDER.map((body) => {
    const score = scores.get(body)!;
    const pillarId = score.pillarId;
    return {
      body,
      pillarId,
      score: score.percentage,
      measure: "weight" as const,
      ...BODY_GUIDANCE[body],
      status: statusFor(score, leading),
    };
  });
  const values = result.scores.map((score) => score.percentage);
  const coherence = Math.max(
    0,
    Math.round(100 - (Math.max(...values) - Math.min(...values)) * 1.5),
  );

  return [
    ...outerBodies,
    {
      body: "Ethereal",
      pillarId: "guardian",
      score: result.isGuardian ? 100 : coherence,
      measure: "coherence",
      ...BODY_GUIDANCE.Ethereal,
      status: result.isGuardian
        ? "Humming · integrated"
        : "Holding · integrating",
    },
  ];
}

export function formatDegrees(degrees?: number) {
  if (typeof degrees !== "number") return null;
  const minutes = Math.round((degrees % 1) * 60);
  return `${Math.floor(degrees)}°${String(minutes).padStart(2, "0")}′`;
}

export function placementSymbol(placement: PlacementDetail) {
  return PLANET_SYMBOLS[placement.key];
}

export function primaryPractice(result: ReadingResult) {
  const pillar = PILLARS[result.dominantPillar];
  return {
    title: BODY_GUIDANCE[result.dominantBody].action,
    detail: BODY_GUIDANCE[result.dominantBody].remedy,
    href: pillar.href,
    pillar,
  };
}
