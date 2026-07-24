export type Testimonial = {
  id: string;
  quote: string;
  author_name: string;
  house_number: number | null;
  pillar: "presence" | "press" | "studios" | "foundation" | "guardian";
  avatar_url: string | null;
  role: string | null;
};

/** A graceful local wall while the shared testimonial table is still empty. */
export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: "maya", quote: "I came for the reading and stayed for the circle. I didn’t know I was lonely until I wasn’t.", author_name: "Maya R.", house_number: 3, pillar: "presence", avatar_url: null, role: "Member" },
  { id: "david", quote: "The Codex gave me the language for what I’ve been building for 10 years. I read Vol I in one night.", author_name: "David K.", house_number: 5, pillar: "press", avatar_url: null, role: "Reader" },
  { id: "sandabado", quote: "I released my album through Studios and kept 100% of my masters. No label. No extraction.", author_name: "Sandabado", house_number: 8, pillar: "studios", avatar_url: null, role: "Artist" },
  { id: "ren", quote: "I stood in the garden and understood the tetrahedron. Not as a concept. As a place.", author_name: "Ren T.", house_number: 4, pillar: "foundation", avatar_url: null, role: "Visitor" },
  { id: "tyler", quote: "The Old World told me to grind alone. The circle told me to sit down. I chose the circle.", author_name: "Tyler M.", house_number: 1, pillar: "presence", avatar_url: null, role: "Member" },
  { id: "evelyn", quote: "I retain 100% of my IP. The author eats first is not a slogan. It’s the contract.", author_name: "Evelyn T.", house_number: 2, pillar: "press", avatar_url: null, role: "Author" },
  { id: "alana", quote: "This is different because it doesn’t stop at diagnosis. It sends you to work.", author_name: "Alana B.", house_number: 8, pillar: "presence", avatar_url: null, role: "Member" },
  { id: "anonymous", quote: "Guardian isn’t networking. It’s stewardship.", author_name: "Anonymous", house_number: 12, pillar: "guardian", avatar_url: null, role: "Partner" },
];
