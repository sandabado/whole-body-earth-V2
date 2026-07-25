import type { Metadata } from "next";
import { SharedLayerPage, type SharedLayerItem } from "../../components/shared/SharedLayerPage";

export const metadata: Metadata = {
  title: { absolute: "Guild — Whole Body Earth" },
  description: "Open roles and ways to participate across Whole Body Earth.",
};

const items: readonly SharedLayerItem[] = [
  { glyph: "🜂", meta: "Presence · Remote", title: "Circle Keeper", description: "Hold clear rhythm and human continuity around gatherings.", status: "Stipend", href: "/apply?role=Circle%20Keeper" },
  { glyph: "🜄", meta: "Studios · LA preferred", title: "Mix Engineer", description: "Support artist-owned releases without compromising the Feed First covenant.", status: "Per project", href: "/apply?role=Mix%20Engineer" },
  { glyph: "🜁", meta: "Press · Remote", title: "Editorial Reader", description: "Read manuscripts for clarity, rigor, and living usefulness.", status: "Per manuscript", href: "/apply?role=Editorial%20Reader" },
  { glyph: "🜃", meta: "Foundation · Morongo Valley", title: "Site Surveyor", description: "Translate land conditions into trustworthy structural decisions.", status: "Contract", href: "/apply?role=Site%20Surveyor" },
  { glyph: "⊙", meta: "Guardian · Referral", title: "Trust Associate", description: "Support private agreements and stewardship architecture.", status: "Private", href: "/apply?role=Trust%20Associate" },
];

export default function GuildPage() {
  return (
    <SharedLayerPage
      id="guild"
      index="11"
      eyebrow="The working constellation"
      title="Find your seat in the work."
      introduction="The Guild is a routing layer for practical contribution. Every role is attached to a real pillar, a clear scope, and a visible form of exchange."
      items={items}
    />
  );
}
