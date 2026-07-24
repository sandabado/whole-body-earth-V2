import { MEDIA_ATLAS } from "@/lib/media-atlas";

export type StudioRelease = {
  slug: string;
  title: string;
  artist: string;
  format: string;
  year: string;
  status: "Featured" | "Archive";
  image: string;
  sourceHref?: string;
};

/**
 * One editorial record of the Studios music catalog. The current release stays
 * local to Whole Body; archive listings retain a path to their original entry.
 */
export const STUDIO_MUSIC_CATALOG: StudioRelease[] = [
  {
    slug: "infinity-love",
    title: "∞ Love",
    artist: "Sandābādo",
    format: "Album",
    year: "2026",
    status: "Featured",
    image: MEDIA_ATLAS.studios.infinityLove,
  },
  {
    slug: "333",
    title: "333",
    artist: "sandābādo",
    format: "Archive listing",
    year: "2023",
    status: "Archive",
    image: MEDIA_ATLAS.studios.sandabado333,
    sourceHref: "https://jessegawlik.com/portfolio/desert-saints/",
  },
  {
    slug: "joshua-tree-sessions",
    title: "joshua tree sessions",
    artist: "broken stems",
    format: "Album",
    year: "2018",
    status: "Archive",
    image: MEDIA_ATLAS.studios.joshuaTreeSessions,
    sourceHref: "https://jessegawlik.com/portfolio/joshua-tree-sessions/",
  },
  {
    slug: "what-are-you-connected",
    title: "what are you connected",
    artist: "broken stems",
    format: "Album",
    year: "2016",
    status: "Archive",
    image: MEDIA_ATLAS.studios.whatAreYouConnected,
    sourceHref: "https://jessegawlik.com/portfolio/what-are-you-connected/",
  },
  {
    slug: "we-are-home-ep",
    title: "we are home ep",
    artist: "broken stems",
    format: "EP",
    year: "2013",
    status: "Archive",
    image: MEDIA_ATLAS.studios.weAreHomeEp,
    sourceHref: "https://jessegawlik.com/portfolio/we-are-home-ep/",
  },
  {
    slug: "pb-sessions",
    title: "pb sessions",
    artist: "uproot",
    format: "Album",
    year: "2009",
    status: "Archive",
    image: MEDIA_ATLAS.studios.pbSessions,
    sourceHref: "https://jessegawlik.com/portfolio/pb-sessions/",
  },
  {
    slug: "levity",
    title: "levity",
    artist: "uproot",
    format: "Album",
    year: "2007",
    status: "Archive",
    image: MEDIA_ATLAS.studios.levity,
    sourceHref: "https://jessegawlik.com/portfolio/levity/",
  },
];
