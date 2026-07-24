import type { PillarId } from "@/lib/pillars";

export type Element = "Fire" | "Air" | "Water" | "Earth";
export type OuterBody = "Spiritual" | "Mental" | "Emotional" | "Physical";
export type Body = OuterBody | "Ethereal";

export const signToElement: Record<string, Element> = {
  aries: "Fire", leo: "Fire", sagittarius: "Fire",
  gemini: "Air", libra: "Air", aquarius: "Air",
  cancer: "Water", scorpio: "Water", pisces: "Water",
  taurus: "Earth", virgo: "Earth", capricorn: "Earth",
};

export const elementToBody: Record<Element, OuterBody> = {
  Fire: "Spiritual",
  Air: "Mental",
  Water: "Emotional",
  Earth: "Physical",
};

export const bodyToPillar: Record<Body, PillarId> = {
  Spiritual: "presence",
  Mental: "press",
  Emotional: "studios",
  Physical: "foundation",
  Ethereal: "guardian",
};

export const placementWeights = {
  sun: { label: "Sun", weight: 10, description: "Core identity and vitality" },
  moon: { label: "Moon", weight: 8, description: "Inner world and instincts" },
  ascendant: { label: "Ascendant", weight: 8, description: "How you meet the world" },
  northNode: { label: "North Node", weight: 7, description: "Growth direction" },
  midheaven: { label: "Midheaven", weight: 6, description: "Purpose and public arc" },
  southNode: { label: "South Node", weight: 5, description: "Innate gifts and comfort zone" },
  descendant: { label: "Descendant", weight: 5, description: "Partnership mirror" },
  mercury: { label: "Mercury", weight: 4, description: "How you process information" },
  venus: { label: "Venus", weight: 4, description: "What you value and attract" },
  mars: { label: "Mars", weight: 4, description: "How you take action" },
} as const;

export type PlacementKey = keyof typeof placementWeights;

export function signToBody(sign: string): OuterBody {
  const element = signToElement[sign.toLowerCase().trim()];
  if (!element) throw new Error(`Unknown zodiac sign: ${sign}`);
  return elementToBody[element];
}
