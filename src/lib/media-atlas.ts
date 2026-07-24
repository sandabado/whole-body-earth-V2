/**
 * The single registry for public, editorial media. Values here must be stable
 * build-time assets from /public — never Supabase Storage URLs.
 */
export const MEDIA_ATLAS = {
  foundation: {
    gardenSun: "/images/foundation/tetrahedron-garden-sun.png",
    gardenEmber: "/images/foundation/tetrahedron-garden-ember.png",
    gardenDawn: "/images/foundation/tetrahedron-garden-dawn.png",
  },
  studios: {
    infinityLove: "/images/releases/sandabado-infinity-love.png",
    sandabado333: "/images/releases/archive/sandabado-333.jpg",
    joshuaTreeSessions: "/images/releases/archive/broken-stems-joshua-tree-sessions.jpg",
    whatAreYouConnected: "/images/releases/archive/broken-stems-what-are-you-connected.jpg",
    weAreHomeEp: "/images/releases/archive/broken-stems-we-are-home-ep.jpg",
    pbSessions: "/images/releases/archive/uproot-pb-sessions.jpg",
    levity: "/images/releases/archive/uproot-levity.jpg",
    desertSession: "/images/studio/desert-session.png",
    objectsSession: "/images/studio/objects-session.png",
  },
} as const;

/** The five-pillar color layer applied to the three functional media frames. */
export const PILLAR_MEDIA_COLORS = {
  presence: "#d16b45",
  press: "#d4af37",
  studios: "#2ba8a0",
  foundation: "#84a66e",
  guardian: "#8f5bff",
} as const;

const STATIC_MEDIA_PREFIXES = ["/images/", "/books/", "/music/", "/logos/", "/testimonials/"];

export function isStaticMediaPath(path: string | null | undefined): path is string {
  return Boolean(path && STATIC_MEDIA_PREFIXES.some((prefix) => path.startsWith(prefix)));
}
