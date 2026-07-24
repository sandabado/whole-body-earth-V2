import { PILLARS, type PillarId } from "@/lib/pillars";

export type PillarSectionData = {
  id: PillarId;
  number: string;
  tagline: string;
  description: string[];
  live: { title: string; subtitle: string; status: string; href: string; action: string };
  activity: { intro: string; details: string[]; cta: string };
  cta: string;
  media: "presence" | "garden" | "books" | "album" | "guardian";
};

export const PILLAR_SECTIONS: PillarSectionData[] = [
  { id: "presence", number: "01", tagline: "The shape of ignition.", description: ["Fire is the circle that holds you. Weekly gatherings, monthly retreats, and rites of passage—no hierarchy, no guru, just belonging.", "The tetrahedron is the minimum stable form. So is a circle: everyone can be seen, and no one sits at the head."], live: { title: "Next Circle", subtitle: "Tuesday · 7 PM PT · Free", status: "ACTIVE", href: "/pillars/presence/gatherings", action: "Join" }, activity: { intro: "A live Circle is a simple, held room: arrive as you are, practice attention, and leave with a little more of yourself.", details: ["Tuesday at 7 PM Pacific", "Open to new arrivals", "No preparation required"], cta: "View gatherings" }, cta: "Enter Presence", media: "presence" },
  { id: "press", number: "02", tagline: "The shape that carries.", description: ["Books are technology: tools for transformation, not commodities. The Whole Body Series is five volumes and one operating system.", "Authors retain their copyright and IP. The author eats first."], live: { title: "The Whole Body Series", subtitle: "Volumes I–V · Q4 2026", status: "PLANNED Q4 2026", href: "/pillars/press/library", action: "Browse" }, activity: { intro: "The reader is a growing shelf for the Whole Body Series: books, manuals, and paths into the work.", details: ["Five volumes in the first series", "Permanent reader access with each edition", "Author-first publishing terms"], cta: "Visit the library" }, cta: "Enter the Library", media: "books" },
  { id: "studios", number: "03", tagline: "The shape that remembers.", description: ["Music and film are infrastructure—current and truth, never content. Artists retain their masters, publishing, and IP.", "We earn on production, distribution, and placement, never on ownership."], live: { title: "Now Playing", subtitle: "Sandābādo · ∞ Love", status: "ACTIVE", href: "/pillars/studios", action: "Enter" }, activity: { intro: "Studios holds artist-owned music, moving image, and the practical infrastructure that helps a release travel without extraction.", details: ["∞ Love by Sandābādo now in the archive", "Artist-owned masters and publishing", "Production, distribution, and placement support"], cta: "Enter studios" }, cta: "Enter Studios", media: "album" },
  { id: "foundation", number: "04", tagline: "The shape that endures.", description: ["Rammed earth. Off-grid. Carbon negative. A place to stand that cannot be taken. The Tetrahedron Garden is planted and growing.", "The cube holds equal pressure on every face. Without ground, everything floats away."], live: { title: "Garden Status", subtitle: "Morongo Valley · Growing", status: "PLANNED Q1 2027", href: "/pillars/foundation/garden", action: "Visit" }, activity: { intro: "The Tetrahedron Garden is the first built form of Foundation: a place for planting, tending, harvest, and careful arrival.", details: ["Morongo Valley, California", "Visits open with the next phase", "Garden notes and field sessions in development"], cta: "Explore the garden" }, cta: "Enter Foundation", media: "garden" },
  { id: "guardian", number: "05", tagline: "The shape that holds.", description: ["Sovereign systems, trust architecture, and IP shielding for creators with something real to protect.", "Referral only. The final gate is a container for work that outlasts you."], live: { title: "Eligibility", subtitle: "$50k+/yr · Partner referral", status: "RESTRICTED", href: "/pillars/guardian", action: "Learn" }, activity: { intro: "Guardian is a referral-led stewardship path for people already holding meaningful responsibility and ready for a larger pattern.", details: ["Partner referral required", "$50k+ annual revenue threshold", "Audit, placement, and succession support"], cta: "Read eligibility" }, cta: "Enter Guardian", media: "guardian" },
];

export function pillarDefinition(id: PillarId) {
  return PILLARS[id];
}
