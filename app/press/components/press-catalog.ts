export type PressFormat = {
  id: "digital" | "paperback" | "hardcover" | "hand-bound" | "ceremonial" | "archive";
  label: string;
  price: number;
  detail: string;
  availability?: string;
};

export type PressTitle = {
  slug: string;
  title: string;
  subtitle?: string;
  authorSlugs: string[];
  imprint: "Root Editions" | "Desert Press" | "Frequency Imprint";
  category: string;
  description: string;
  longDescription: string[];
  publicationDate: string;
  status: "Pre-order" | "Forthcoming";
  isbn?: string;
  cover: {
    glyph: string;
    folio: string;
    tone: "ember" | "gold" | "earth" | "violet" | "water";
  };
  formats: PressFormat[];
};

export type PressAuthor = {
  slug: string;
  name: string;
  initials: string;
  credentials: string;
  shortBio: string;
  longBio: string[];
  quote: string;
  website?: string;
};

export type PressEvent = {
  id: string;
  title: string;
  type: "Reading" | "Launch" | "Workshop" | "Signing" | "Discussion";
  date: string;
  dateTime: string;
  endTime: string;
  location: string;
  locationType: "Desert Studio" | "Virtual";
  price: number;
  authorSlugs: string[];
  titleSlug?: string;
  description: string;
  capacity: number;
};

const coreFormats: PressFormat[] = [
  { id: "digital", label: "Digital Edition", price: 12, detail: "DRM-free PDF + EPUB" },
  { id: "paperback", label: "Trade Paperback", price: 24, detail: "Perfect bound · acid-free paper" },
];

export const pressAuthors: PressAuthor[] = [
  {
    slug: "jesse-gawlik",
    name: "Jesse Gawlik",
    initials: "JG",
    credentials: "Somatic practitioner · Builder · Founder, Whole Body Guild",
    shortBio: "Jesse writes from the intersection of somatic practice, sovereign enterprise, and ecological culture.",
    longBio: [
      "Jesse writes from the intersection of ancient geometry, somatic practice, and sovereign enterprise. The work is not self-help. It is infrastructure for people building real things in the physical world.",
      "He lives in the Morongo Valley, where the desert, the studio, and the writing desk occupy the same room.",
    ],
    quote: "A book should leave the writer freer than it found them.",
  },
  {
    slug: "sarah-veya",
    name: "Sarah Veya",
    initials: "SV",
    credentials: "Frequency practitioner · Writer · Field researcher",
    shortBio: "Sarah works with creative attention, resonance, and the quiet disciplines that make collaboration possible.",
    longBio: [
      "Sarah Veya studies the conditions that allow people to hear one another clearly. Her writing moves between practical companionship, frequency work, and creative rebellion.",
      "Her first Press edition is designed as a marked-up field companion rather than a book to be kept clean.",
    ],
    quote: "Attention is the first material we share.",
  },
  {
    slug: "press-collective",
    name: "Press Collective",
    initials: "PC",
    credentials: "Ceremony keepers · Editors · Contributing practitioners",
    shortBio: "A rotating editorial collective documenting practices held in common rather than claimed by one voice.",
    longBio: [
      "The Press Collective gathers work that belongs to a practiced commons: seasonal rites, land-based observations, and ceremonies that can be shared without exposing what is closed.",
      "Every contribution is credited. Stewardship is named. No lineage is flattened into content.",
    ],
    quote: "Some knowledge arrives as a chorus.",
  },
  {
    slug: "living-earth-contributors",
    name: "Living Earth Contributors",
    initials: "LE",
    credentials: "Growers · Ecologists · Land stewards",
    shortBio: "A field network recording what land, water, and community infrastructure teach in practice.",
    longBio: [
      "Living Earth Contributors are growers, ecologists, builders, and neighbors working in distinct bioregions.",
      "Their reports privilege measured outcomes, local specificity, and repairable systems over universal prescriptions.",
    ],
    quote: "The ground is always part of the authorship.",
  },
  {
    slug: "marcus",
    name: "Marcus",
    initials: "M",
    credentials: "Breathwork facilitator · Former firefighter · 12-year practitioner",
    shortBio: "Marcus knows what fire does to a body. He also knows what breath can undo.",
    longBio: [
      "A twelve-year practitioner and former firefighter turned breathwork facilitator, Marcus writes from direct contact with pressure, recovery, and the nervous system.",
      "His forthcoming work treats breath as a practiced bridge—not a performance, shortcut, or promise of transcendence.",
    ],
    quote: "Breath is the bridge between what happened and what can heal.",
  },
];

export const pressTitles: PressTitle[] = [
  {
    slug: "the-way-of-fire",
    title: "The Way of Fire",
    subtitle: "Practice at the edge of pressure",
    authorSlugs: ["jesse-gawlik"],
    imprint: "Root Editions",
    category: "Somatic & Bodywork",
    description: "A field manual for embodied attention, clean action, and presence that holds under pressure.",
    longDescription: [
      "The Way of Fire begins with the body as the first instrument. It follows heat, urgency, instinct, and attention through practices built for real conditions.",
      "This is a book to carry, annotate, and revisit when the room gets loud. Each chapter moves from lived encounter to repeatable practice without reducing the body to a technique.",
    ],
    publicationDate: "2027-03-21",
    status: "Pre-order",
    isbn: "ISBN assigned before first printing",
    cover: { glyph: "🜂", folio: "ROOT / 001", tone: "ember" },
    formats: [
      ...coreFormats,
      { id: "hand-bound", label: "Hand-Bound Limited", price: 150, detail: "Hand-stitched · numbered 1–50", availability: "COMING Q2 2027 · 50 PLANNED" },
    ],
  },
  {
    slug: "feed-first",
    title: "Feed First",
    subtitle: "An economy that remembers the maker",
    authorSlugs: ["jesse-gawlik"],
    imprint: "Desert Press",
    category: "Creative Rebellion",
    description: "A practical inversion of extraction economics for artists, builders, authors, and guilds.",
    longDescription: [
      "Feed First asks a plain question: what changes when the person who made the work is fed before the system around it?",
      "The book maps author-owned rights, guild treasuries, production costs, and distribution into a model that can be examined, adapted, and held accountable.",
    ],
    publicationDate: "2027-04-09",
    status: "Pre-order",
    cover: { glyph: "🜁", folio: "DESERT / 001", tone: "gold" },
    formats: [
      ...coreFormats,
      { id: "archive", label: "Archive Edition", price: 650, detail: "Linen binding · slipcase · archival paper", availability: "PHASE 3 · 12 PLANNED" },
    ],
  },
  {
    slug: "desert-ceremonies",
    title: "Desert Ceremonies",
    subtitle: "Practices for open sky",
    authorSlugs: ["press-collective"],
    imprint: "Root Editions",
    category: "Ceremony & Ritual",
    description: "A carefully held collection of seasonal, communal, and solitary practices for desert life.",
    longDescription: [
      "Desert Ceremonies gathers practices that can be shared without appropriating what is closed. The book names contributors, origins, limits, and responsibilities.",
      "Printed with wide margins and durable signatures, it is designed to accompany use rather than observe it from a shelf.",
    ],
    publicationDate: "2027-06-20",
    status: "Forthcoming",
    cover: { glyph: "🜄", folio: "ROOT / 002", tone: "water" },
    formats: [
      ...coreFormats,
      { id: "ceremonial", label: "Ceremonial Edition", price: 325, detail: "Custom embossed · ritual material folio", availability: "PLANNED · 24 COPY STUDY" },
    ],
  },
  {
    slug: "living-earth-vol-1",
    title: "Living Earth Vol. 1",
    subtitle: "Field notes from practiced ground",
    authorSlugs: ["living-earth-contributors"],
    imprint: "Desert Press",
    category: "Ecology & Land",
    description: "Measured accounts of land, water, food, shelter, and community infrastructure in practice.",
    longDescription: [
      "Living Earth is an ongoing record of situated experiments. Each report identifies climate, constraints, methods, failures, and what actually changed.",
      "Volume One begins in the high desert and expands outward through contributions from growers, builders, and land stewards.",
    ],
    publicationDate: "2027-09-22",
    status: "Forthcoming",
    cover: { glyph: "🜃", folio: "DESERT / 002", tone: "earth" },
    formats: [
      ...coreFormats,
      { id: "hand-bound", label: "Hand-Bound Limited", price: 175, detail: "Linen cloth · field-map endpapers", availability: "COMING Q2 2027 · 40 PLANNED" },
    ],
  },
  {
    slug: "sandabado-companion",
    title: "Sandabado Companion",
    subtitle: "Exercises in shared frequency",
    authorSlugs: ["sarah-veya"],
    imprint: "Frequency Imprint",
    category: "Creative Rebellion",
    description: "A practical companion for creative partnership, attention, resonance, and collaborative repair.",
    longDescription: [
      "Sandabado Companion is built to be used by two or more people. Prompts, scores, and field exercises create a shared surface for difficult or generative work.",
      "The edition opens flat, leaves space for multiple hands, and treats annotation as part of the object.",
    ],
    publicationDate: "2027-11-11",
    status: "Forthcoming",
    cover: { glyph: "☉", folio: "FREQUENCY / 001", tone: "violet" },
    formats: [
      ...coreFormats,
      { id: "ceremonial", label: "Ceremonial Edition", price: 285, detail: "Pair-bound set · custom foil mark", availability: "PLANNED · 33 SET STUDY" },
    ],
  },
];

export const pressEvents: PressEvent[] = [
  {
    id: "desert-fire-reading",
    title: "Desert Fire Reading",
    type: "Reading",
    date: "March 15, 2027 · 2:00 PM PST",
    dateTime: "2027-03-15T14:00:00-08:00",
    endTime: "2027-03-15T16:00:00-08:00",
    location: "Desert Studio · Morongo Valley, California",
    locationType: "Desert Studio",
    price: 0,
    authorSlugs: ["jesse-gawlik"],
    titleSlug: "the-way-of-fire",
    description: "An open-sky reading from The Way of Fire, followed by a practice conversation and first-edition preview.",
    capacity: 28,
  },
  {
    id: "feed-first-launch",
    title: "Feed First: Launch Discussion",
    type: "Launch",
    date: "April 9, 2027 · 5:00 PM PST",
    dateTime: "2027-04-09T17:00:00-08:00",
    endTime: "2027-04-09T18:30:00-08:00",
    location: "Proton Meet · Private link sent after registration",
    locationType: "Virtual",
    price: 15,
    authorSlugs: ["jesse-gawlik"],
    titleSlug: "feed-first",
    description: "A live examination of author ownership, guild economics, and what it means to feed the maker before the platform.",
    capacity: 120,
  },
  {
    id: "binding-the-first-edition",
    title: "Binding the First Edition",
    type: "Workshop",
    date: "May 22, 2027 · 11:00 AM PST",
    dateTime: "2027-05-22T11:00:00-08:00",
    endTime: "2027-05-22T14:00:00-08:00",
    location: "Desert Studio · Morongo Valley, California",
    locationType: "Desert Studio",
    price: 45,
    authorSlugs: ["press-collective"],
    description: "A tactile introduction to signatures, thread, cloth, foil, and the decisions that make a book survive use.",
    capacity: 16,
  },
];

export const pressCategories = [
  { name: "Somatic & Bodywork", glyph: "🜂", tone: "ember", note: "The practiced body" },
  { name: "Ecology & Land", glyph: "🜃", tone: "earth", note: "Ground, water, repair" },
  { name: "Creative Rebellion", glyph: "🜁", tone: "gold", note: "Work outside extraction" },
  { name: "Ceremony & Ritual", glyph: "🜄", tone: "water", note: "Practices held with care" },
  { name: "Translations & Classics", glyph: "☉", tone: "violet", note: "Enduring source texts" },
  { name: "Children & Family", glyph: "✦", tone: "mixed", note: "Future imprint" },
] as const;

export const editionTiers = [
  { name: "Digital Edition", range: "$9–15", detail: "DRM-free PDF + EPUB" },
  { name: "Trade Paperback", range: "$18–28", detail: "Perfect bound · acid-free" },
  { name: "Hardcover First", range: "$35–55", detail: "Cloth-bound · foil-stamped" },
  { name: "Hand-Bound Limited", range: "$125–300", detail: "Hand-stitched · numbered" },
  { name: "Ceremonial Edition", range: "$250–500", detail: "Custom embossed · ritual materials" },
  { name: "Archive Edition", range: "$500–1,200", detail: "Archival paper · linen · slipcase" },
] as const;

export function getAuthor(slug: string) {
  return pressAuthors.find((author) => author.slug === slug);
}

export function getTitle(slug: string) {
  return pressTitles.find((title) => title.slug === slug);
}

export function getEvent(id: string) {
  return pressEvents.find((event) => event.id === id);
}

export function authorsForTitle(title: PressTitle) {
  return title.authorSlugs.map(getAuthor).filter((author): author is PressAuthor => Boolean(author));
}

export function titlesForAuthor(slug: string) {
  return pressTitles.filter((title) => title.authorSlugs.includes(slug));
}

export function eventsForAuthor(slug: string) {
  return pressEvents.filter((event) => event.authorSlugs.includes(slug));
}
