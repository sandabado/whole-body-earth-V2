export const PILLARS = {
  presence: { name: "Presence", symbol: "🜂", element: "presence", elementLabel: "Fire", solid: "Tetrahedron", faces: 4, body: "Spiritual body", color: "#d16b45", href: "/pillars/presence", status: "ACTIVE", releaseLabel: "Active" },
  press: { name: "Press", symbol: "🜁", element: "press", elementLabel: "Air", solid: "Octahedron", faces: 8, body: "Mental body", color: "#d4af37", href: "/pillars/press", status: "ACTIVE", releaseLabel: "Planned Q4 2026" },
  studios: { name: "Studios", symbol: "🜄", element: "studios", elementLabel: "Water", solid: "Icosahedron", faces: 20, body: "Emotional body", color: "#2ba8a0", href: "/pillars/studios", status: "ACTIVE", releaseLabel: "Active" },
  foundation: { name: "Foundation", symbol: "🜃", element: "foundation", elementLabel: "Earth", solid: "Cube", faces: 6, body: "Physical body", color: "#84a66e", href: "/pillars/foundation", status: "SOON", releaseLabel: "Planned Q1 2027" },
  guardian: { name: "Guardian", symbol: "☉", element: "law", elementLabel: "Ether", solid: "Dodecahedron", faces: 12, body: "Ethereal body", color: "#8f5bff", href: "/pillars/guardian", status: "SOON", releaseLabel: "Planned 2027" },
} as const;

export type PillarId = keyof typeof PILLARS;
export const PILLAR_IDS = Object.keys(PILLARS) as PillarId[];
export const PILLAR_LIST = PILLAR_IDS.map((id) => ({ id, ...PILLARS[id] }));

export function pillarForPath(pathname: string): PillarId | null {
  return PILLAR_IDS.find((id) => pathname.startsWith(PILLARS[id].href)) ?? null;
}
