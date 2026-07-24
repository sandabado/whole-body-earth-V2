export type PressCategory = "The Whole Body Series" | "Manuals" | "Practice Guides" | "Forthcoming";

export type PressVolume = {
  number: string;
  slug: string;
  title: string;
  tagline: string;
  element: string;
  shape: string;
  category: PressCategory;
  pages: number;
  description: string[];
  excerpt: string;
  cover: { from: string; to: string; accent: string };
};

export const pressVolumes: PressVolume[] = [
  {
    number: "I", slug: "whole-body-presence", title: "Whole Body Presence", tagline: "Build the instrument.", element: "Fire", shape: "Tetrahedron", category: "The Whole Body Series", pages: 240,
    description: ["The first volume. The foundation. Fire. The tetrahedron. The spark that starts everything.", "Your body is the instrument. Before you play, before you sing, before you build — you tune. Presence work is the tuning. This volume establishes the physical and spiritual architecture that every subsequent volume builds upon.", "You were told to go alone. To bootstrap. To grind. That was the extraction. Presence is the return to the circle — where everyone can be seen and no one sits at the head."],
    excerpt: "Your body is the first room. Before the work has a name, before it has an audience, there is the instrument and the act of tuning it.", cover: { from: "#261512", to: "#08070a", accent: "#d16b45" },
  },
  {
    number: "II", slug: "twelvefold-harmonics", title: "Twelvefold Harmonics", tagline: "Play the song.", element: "Air", shape: "Octahedron", category: "The Whole Body Series", pages: 320,
    description: ["The second volume. The architecture of pattern. Air. The octahedron. Equilibrium — what rises meets what descends.", "Twelve frequencies. Twelve rooms in the architecture. This volume maps the harmonic structure that underlies the Living Earth system. Not astrology. Not personality typing. A frequency map — each position a room you enter, a resonance you carry, a role you play in the larger pattern.", "The word becomes structure. Structure becomes life. The mental body needs infrastructure that carries the signal to the one who needs it."],
    excerpt: "A pattern is not a cage. It is a room with a door, waiting for the person who can recognize its frequency.", cover: { from: "#191437", to: "#07070e", accent: "#6d4aff" },
  },
  {
    number: "III", slug: "infinite-presence", title: "Infinite Presence", tagline: "Be the silence.", element: "Water", shape: "Icosahedron", category: "The Whole Body Series", pages: 180,
    description: ["The third volume. The dissolving. Water. The icosahedron. The shape that remembers.", "Beyond the instrument. Beyond the song. The space between notes where music actually lives. This volume explores the contemplative core of the system — the practice of being present without agenda, without framework, without framework-as-performance.", "The emotional body remembers what the song makes possible. This is the manual for what happens after the song ends. The silence that holds everything."],
    excerpt: "Silence is not the absence of signal. It is the field in which the signal can finally be heard.", cover: { from: "#102b32", to: "#06090d", accent: "#53b8c3" },
  },
  {
    number: "IV", slug: "the-living-spiral", title: "The Living Spiral", tagline: "Dance the turn.", element: "Earth", shape: "Cube", category: "The Whole Body Series", pages: 280,
    description: ["The fourth volume. The movement. Earth. The cube. What holds. What roots. What remains.", "Growth is not linear. It spirals. This volume addresses the cycles of building — the seasons of creation, the geometry of expansion, the moments where the system turns and you must turn with it.", "The cube is the most stable form. Six faces. Equal pressure from all sides. Foundation work is the practice of building structures that can hold the spiral's force without collapsing."],
    excerpt: "The turn is not a detour from the path. The turn is how the path learns to hold more life.", cover: { from: "#26301d", to: "#080b07", accent: "#9fb26a" },
  },
  {
    number: "V", slug: "triangle-of-trust", title: "Triangle of Trust", tagline: "Build the home.", element: "Ether", shape: "Dodecahedron", category: "The Whole Body Series", pages: 350,
    description: ["The fifth volume. The integration. Ether. The dodecahedron. The shape that holds all others.", "The final volume of the Whole Body Series. Everything converges here. The instrument, the song, the silence, the dance — all become the home. The triangle of trust is the relational architecture: self, other, and the space between.", "This is the operating manual for the Living Earth Constellation. Not a conclusion. An origin point. Everything after this is practice."],
    excerpt: "Home is not a place you arrive. It is an agreement made again and again between self, other, and the space that holds both.", cover: { from: "#2d203b", to: "#0b0810", accent: "#c28cda" },
  },
];

export const readingPaths = [
  { title: "The Foundation Path", audience: "For the person starting from zero.", volumes: ["I", "V", "IV"], route: ["Whole Body Presence", "Triangle of Trust", "The Living Spiral"], description: "Build the instrument. Build the home. Then dance. This sequence is for builders, founders, and creators who need the physical and relational architecture before they can move.", price: "$66 digital · $220 physical" },
  { title: "The Practitioner Path", audience: "For the person already in practice.", volumes: ["III", "II", "V"], route: ["Infinite Presence", "Twelvefold Harmonics", "Triangle of Trust"], description: "Be the silence. Learn the pattern. Build the home. This sequence is for practitioners, healers, and guides who already have a practice and need the framework to deepen it.", price: "$66 digital · $220 physical" },
  { title: "The Builder's Path", audience: "For the entrepreneur and systems thinker.", volumes: ["I", "IV", "V"], route: ["Whole Body Presence", "The Living Spiral", "Triangle of Trust"], description: "Tune the instrument. Understand cycles. Build the structure. This sequence is for people building organizations, products, or communities who need the operating manual.", price: "$66 digital · $220 physical" },
  { title: "The Complete Descent", audience: "All five volumes in sequence.", volumes: ["I", "II", "III", "IV", "V"], route: ["Whole Body Presence", "Twelvefold Harmonics", "Infinite Presence", "The Living Spiral", "Triangle of Trust"], description: "The full architecture. Start at the spark. End at the home. This is how it was written. This is how it is meant to be read.", price: "$111 digital · $333 physical" },
];

export function getPressVolume(slug: string) {
  return pressVolumes.find((volume) => volume.slug === slug);
}
