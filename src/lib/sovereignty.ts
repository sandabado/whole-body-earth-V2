import { HOUSE_DEFINITIONS, type HouseNumber } from "@/types/houses";
import { HOUSE_ROMAN } from "@/lib/house-spectrum";

export const SOVEREIGNTY_STORAGE_KEY = "dodecanic.sovereignty-ledger.v1";

export type SovereigntyMetric = "action" | "minutes" | "spend" | "revenue";

export interface SovereigntyEntry {
  id: string;
  date: string;
  house: HouseNumber;
  description: string;
  metric: SovereigntyMetric;
  value: number;
  createdAt: string;
}

export interface SovereigntyPillar {
  house: HouseNumber;
  operatingLabel: string;
  function: string;
  measures: readonly string[];
}

export interface SovereigntyHouseSummary {
  house: HouseNumber;
  actions: number;
  minutes: number;
  spend: number;
  revenue: number;
  entries: SovereigntyEntry[];
}

export interface SovereigntySuggestion {
  title: string;
  body: string;
  disclosure: string;
}

export const SOVEREIGNTY_PILLARS: Readonly<Record<HouseNumber, SovereigntyPillar>> = {
  1: { house: 1, operatingLabel: "Starlight Mesa Holdings", function: "Property, physical assets, workspace", measures: ["property activity", "asset spend", "physical workspace time"] },
  2: { house: 2, operatingLabel: "Whole Body Records", function: "Revenue, resources, cash flow", measures: ["revenue", "expenses", "runway decisions"] },
  3: { house: 3, operatingLabel: "Tetra OS Systems", function: "Digital infrastructure and automation", measures: ["development time", "technology spend", "automation output"] },
  4: { house: 4, operatingLabel: "Whole Body Presence", function: "Care, retreats, mentorship", measures: ["sessions", "practice time", "consented outcomes"] },
  5: { house: 5, operatingLabel: "Sandabado Music", function: "Music, performance, creative work", measures: ["releases", "studio time", "music revenue"] },
  6: { house: 6, operatingLabel: "Ragnars Reviews", function: "Publishing, broadcasting, media", measures: ["content", "distribution", "inbound response"] },
  7: { house: 7, operatingLabel: "Jesse Gawlik Portfolio", function: "Narrative, reputation, case studies", measures: ["case studies", "testimonials", "referrals"] },
  8: { house: 8, operatingLabel: "Ghosthand Studios", function: "Production, collaboration, gatherings", measures: ["projects", "collaboration time", "events"] },
  9: { house: 9, operatingLabel: "Living Earth Codex", function: "Learning, documentation, authored IP", measures: ["pages", "research time", "knowledge reuse"] },
  10: { house: 10, operatingLabel: "Legal + Governance", function: "Contracts, compliance, entity stewardship", measures: ["contracts", "deadlines", "professional review"] },
  11: { house: 11, operatingLabel: "Strategic Planning", function: "Vision, roadmap, opportunity pipeline", measures: ["milestones", "planning time", "qualified opportunities"] },
  12: { house: 12, operatingLabel: "Legacy + Brand + Community", function: "Community, recognition, succession", measures: ["community actions", "mentions", "succession work"] },
};

export const SOVEREIGNTY_METRIC_LABELS: Record<SovereigntyMetric, string> = {
  action: "Action",
  minutes: "Time / minutes",
  spend: "Spend / USD",
  revenue: "Revenue / USD",
};

export function isSovereigntyEntry(value: unknown): value is SovereigntyEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<SovereigntyEntry>;
  return typeof entry.id === "string"
    && typeof entry.date === "string"
    && Number.isInteger(entry.house)
    && entry.house! >= 1
    && entry.house! <= 12
    && typeof entry.description === "string"
    && ["action", "minutes", "spend", "revenue"].includes(entry.metric ?? "")
    && typeof entry.value === "number"
    && Number.isFinite(entry.value)
    && entry.value >= 0
    && typeof entry.createdAt === "string";
}

export function summarizeSovereigntyEntries(
  entries: readonly SovereigntyEntry[],
  startDate: string,
): Record<HouseNumber, SovereigntyHouseSummary> {
  return Object.fromEntries(Object.values(HOUSE_DEFINITIONS).map((house) => {
    const houseEntries = entries.filter((entry) => entry.house === house.number && entry.date >= startDate);
    return [house.number, {
      house: house.number,
      actions: houseEntries.length,
      minutes: houseEntries.filter((entry) => entry.metric === "minutes").reduce((sum, entry) => sum + entry.value, 0),
      spend: houseEntries.filter((entry) => entry.metric === "spend").reduce((sum, entry) => sum + entry.value, 0),
      revenue: houseEntries.filter((entry) => entry.metric === "revenue").reduce((sum, entry) => sum + entry.value, 0),
      entries: houseEntries,
    }];
  })) as Record<HouseNumber, SovereigntyHouseSummary>;
}

export function buildSovereigntySuggestion(
  summaries: Record<HouseNumber, SovereigntyHouseSummary>,
): SovereigntySuggestion {
  const ordered = Object.values(summaries).sort((left, right) => left.house - right.house);
  const totalEntries = ordered.reduce((sum, summary) => sum + summary.actions, 0);
  if (totalEntries === 0) {
    return {
      title: "Begin with one true action",
      body: "Log one thing you actually did. The instrument needs your record before it can reflect a pattern.",
      disclosure: "No comparison or recommendation was calculated.",
    };
  }

  const mostActive = [...ordered].sort((left, right) => right.actions - left.actions || left.house - right.house)[0];
  const leastActive = [...ordered].sort((left, right) => left.actions - right.actions || left.house - right.house)[0];
  const mostHouse = HOUSE_DEFINITIONS[mostActive.house];
  const leastHouse = HOUSE_DEFINITIONS[leastActive.house];
  return {
    title: `${mostHouse.name} is carrying the most logged activity`,
    body: `${mostActive.actions} of ${totalEntries} entries are in House ${HOUSE_ROMAN[mostHouse.number]}. House ${HOUSE_ROMAN[leastHouse.number]} has ${leastActive.actions}. Consider: ${leastHouse.question}`,
    disclosure: "Based only on entry counts in the selected period. This is a Dodecanic suggestion, not business, financial, legal, or medical advice.",
  };
}
