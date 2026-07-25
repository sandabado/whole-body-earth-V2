import type { Metadata } from "next";
import { SharedLayerPage, type SharedLayerItem } from "../components/shared/SharedLayerPage";

export const metadata: Metadata = {
  title: { absolute: "Calendar — Whole Body Earth" },
  description: "The shared rhythm across the five Whole Body Earth pillars.",
};

const items: readonly SharedLayerItem[] = [
  { glyph: "🜂", meta: "Aug 03 · 7pm", title: "Presence Circle", description: "A virtual gathering for embodied attention and honest participation.", status: "Virtual", href: "/presence/events" },
  { glyph: "🜄", meta: "Aug 07 · Midnight", title: "Ground vinyl preorders", description: "The Studios catalog opens the first Living Earth vinyl release.", status: "Worldwide", href: "/studios/catalog" },
  { glyph: "🜁", meta: "Aug 12 · 9am", title: "Volume III manuscript review", description: "The Press reading room opens its next editorial review window.", status: "Reading room", href: "/press/events" },
  { glyph: "🜃", meta: "Aug 19 · 8am", title: "Glory Peak site survey", description: "Field observation and structural planning in Morongo Valley.", status: "California", href: "/foundation/the-build" },
  { glyph: "⊙", meta: "Aug 22 · Private", title: "Guardian consultation", description: "A protected session for agreements, stewardship, and boundary architecture.", status: "Referral", href: "/guardian" },
];

export default function CalendarPage() {
  return (
    <SharedLayerPage
      id="calendar"
      index="08"
      eyebrow="The living calendar"
      title="The rhythm of the whole body."
      introduction="Gatherings, releases, reviews, field work, and protected sessions—held in one observable sequence without flattening the worlds they belong to."
      items={items}
    />
  );
}
