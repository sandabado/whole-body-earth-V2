export type PhaseStatus = "complete" | "in-progress" | "planned" | "future";

export interface Phase {
  id: number;
  name: string;
  codename: string;
  description: string;
  status: PhaseStatus;
  startDate: string;
  endDate?: string;
  deliverables: string[];
  glyph: string;
  geometry: "Point" | "Tetrahedron" | "Quincunx" | "Nonagon" | "Dodecahedron";
  progress: number;
}

export const PHASES: Phase[] = [
  {
    id: 0,
    name: "LAND SEARCH",
    codename: "THE FOUNDATION",
    description: "Locating sovereign land in Morongo Valley / Landers, California. Due diligence, zoning review, water feasibility, and the ownership structure come first.",
    status: "in-progress",
    startDate: "JULY 2026",
    deliverables: ["Property identified", "Option agreement", "Well feasibility"],
    glyph: "🜃",
    geometry: "Point",
    progress: 23,
  },
  {
    id: 1,
    name: "THE TRIANGLE",
    codename: "SURVIVAL BASELINE",
    description: "Well, cistern, Living River, solar array, temporary housing, and the Tetrahedron Garden establish the minimum viable village.",
    status: "planned",
    startDate: "Q4 2026",
    deliverables: ["Deep well", "10k gallon cistern", "Solar power", "Garden", "Temporary housing"],
    glyph: "🜄",
    geometry: "Tetrahedron",
    progress: 0,
  },
  {
    id: 2,
    name: "THE QUINCUNX",
    codename: "PERMANENT STRUCTURES",
    description: "Four Elemental Domes and the Central Observer create permanent homes, retreat capacity, and the heart of the village.",
    status: "future",
    startDate: "Q2 2027",
    deliverables: ["Earth Dome", "Fire Dome", "Air Dome", "Water Dome", "Observer space"],
    glyph: "🜃",
    geometry: "Quincunx",
    progress: 0,
  },
  {
    id: 3,
    name: "THE NONAGON",
    codename: "THE VILLAGE SPEAKS",
    description: "The nine-sided Great Hall, recording studio, publishing floor, and broadcast infrastructure give the village a voice.",
    status: "future",
    startDate: "Q4 2027",
    deliverables: ["Great Hall", "Recording studio", "Publishing floor", "Broadcast mast"],
    glyph: "☉",
    geometry: "Nonagon",
    progress: 0,
  },
  {
    id: 4,
    name: "THE DODECAHEDRON",
    codename: "THE FINAL GATE",
    description: "The Prism Cathedral, grand estate, acoustic dome, and federation protocol complete the first village pattern.",
    status: "future",
    startDate: "Q2 2028",
    deliverables: ["Prism Cathedral", "Acoustic dome", "Federation protocol", "Grand estate"],
    glyph: "🝰",
    geometry: "Dodecahedron",
    progress: 0,
  },
];

export const statusLabel: Record<PhaseStatus, string> = {
  complete: "COMPLETE",
  "in-progress": "BUILDING",
  planned: "QUEUED",
  future: "LOCKED",
};
