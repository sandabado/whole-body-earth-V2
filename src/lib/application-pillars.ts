import { PILLARS } from "@/lib/pillars";

export const APPLICATION_PILLARS = {
  presence: {
    ...PILLARS.presence,
    description:
      "Circles, retreats, and embodied practice for people ready to arrive in the room.",
    nameLabel: "Your name",
    disciplineLabel: "Practice or community focus",
    disciplinePlaceholder: "Somatics, facilitation, movement, ritual...",
    portfolioLabel: "Primary practice link",
    portfolioPlaceholder: "Your site, community page, or social profile",
    buildingLabel: "What kind of gathering or practice are you cultivating?",
    alignmentLabel: "Why does Presence call to you?",
    services: [
      "Join a circle",
      "Host a gathering",
      "Retreat interest",
      "Facilitator pathway",
      "Community partnership",
    ],
    stages: [
      ["WRITING", "Exploring"],
      ["RECORDING", "Practicing"],
      ["RELEASED", "Hosting"],
      ["TOURING", "Facilitating"],
    ],
    asksAboutIP: false,
  },
  press: {
    ...PILLARS.press,
    description:
      "A publishing home for work that carries a signal beyond its author.",
    nameLabel: "Author, imprint, or project name",
    disciplineLabel: "Form or subject",
    disciplinePlaceholder: "Essay, poetry, manual, criticism, ecology...",
    portfolioLabel: "Primary manuscript or portfolio link",
    portfolioPlaceholder: "A reading sample, site, or publication link",
    buildingLabel: "What work are you bringing into language?",
    alignmentLabel: "Why does Whole Body Press fit this work?",
    services: [
      "Editorial development",
      "Book design",
      "Publishing strategy",
      "Distribution",
      "Reader community",
    ],
    stages: [
      ["WRITING", "Drafting"],
      ["RECORDING", "Editing"],
      ["RELEASED", "Publishing"],
      ["TOURING", "In circulation"],
    ],
    asksAboutIP: true,
  },
  studios: {
    ...PILLARS.studios,
    description:
      "Artist-owned production infrastructure for music, film, and culture.",
    nameLabel: "Artist or project name",
    disciplineLabel: "Genre or discipline",
    disciplinePlaceholder: "Electronic, hip-hop, ambient, film...",
    portfolioLabel: "Primary portfolio link",
    portfolioPlaceholder: "Spotify, Bandcamp, site, or reel",
    buildingLabel: "What are you building?",
    alignmentLabel: "Why Whole Body Studios?",
    services: [
      "Production / Recording",
      "Mixing / Mastering",
      "Distribution",
      "Sync Licensing",
      "Artist Booking & Events",
      "Artist Development",
      "Film Scoring",
    ],
    stages: [
      ["WRITING", "Writing"],
      ["RECORDING", "Recording"],
      ["RELEASED", "Released"],
      ["TOURING", "Touring"],
    ],
    asksAboutIP: true,
  },
  foundation: {
    ...PILLARS.foundation,
    description:
      "Land, systems, and durable stewardship for work that needs roots.",
    nameLabel: "Your name or organization",
    disciplineLabel: "Field or offering",
    disciplinePlaceholder: "Regenerative land, architecture, systems, food...",
    portfolioLabel: "Primary project link",
    portfolioPlaceholder: "Your site, proposal, or body of work",
    buildingLabel: "What structure, land practice, or system are you building?",
    alignmentLabel: "Why does Foundation call to you?",
    services: [
      "Garden participation",
      "Dome collaboration",
      "Land stewardship",
      "Visit request",
      "Patron or builder pathway",
    ],
    stages: [
      ["WRITING", "Conceiving"],
      ["RECORDING", "Planning"],
      ["RELEASED", "Building"],
      ["TOURING", "Stewarding"],
    ],
    asksAboutIP: false,
  },
  guardian: {
    ...PILLARS.guardian,
    description:
      "A referral-led path for stewards ready to hold a larger pattern.",
    nameLabel: "Your name or organization",
    disciplineLabel: "Sector or stewardship focus",
    disciplinePlaceholder: "Governance, finance, systems, facilitation...",
    portfolioLabel: "Primary organization or work link",
    portfolioPlaceholder: "A site, annual report, or public body of work",
    buildingLabel: "What responsibility or system are you ready to hold?",
    alignmentLabel: "Why are you seeking the Guardian path?",
    services: [
      "Partner referral",
      "Guardian audit",
      "Network placement",
      "Resource stewardship",
      "Succession planning",
    ],
    stages: [
      ["WRITING", "Preparing"],
      ["RECORDING", "Established"],
      ["RELEASED", "Qualified"],
      ["TOURING", "Referred"],
    ],
    asksAboutIP: false,
  },
} as const;

export type ApplicationPillar = keyof typeof APPLICATION_PILLARS;

export const APPLICATION_PILLAR_IDS = Object.keys(
  APPLICATION_PILLARS,
) as ApplicationPillar[];

export function isApplicationPillar(value: string): value is ApplicationPillar {
  return value in APPLICATION_PILLARS;
}
