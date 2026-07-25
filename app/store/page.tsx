import type { Metadata } from "next";
import { SharedLayerPage, type SharedLayerItem } from "../components/shared/SharedLayerPage";

export const metadata: Metadata = {
  title: { absolute: "Store — Whole Body Earth" },
  description: "Artifacts, texts, music, and plans from across Whole Body Earth.",
};

const items: readonly SharedLayerItem[] = [
  { glyph: "🜄", meta: "Studios · Living Earth", title: "Volume 1", description: "Twelve tracks mapped to twelve houses. Digital and vinyl editions.", status: "From $25", href: "/studios/catalog" },
  { glyph: "🜁", meta: "Press · The Codex", title: "Five-volume collection", description: "Field texts carried outward in digital and physical editions.", status: "From $27", href: "/press/catalog" },
  { glyph: "🜃", meta: "Foundation · Glory Peak", title: "Build documentation", description: "The developing blueprint, phases, and land-based infrastructure record.", status: "Open record", href: "/foundation/the-build" },
  { glyph: "🜂", meta: "Presence · Gatherings", title: "Retreat access", description: "Upcoming circles, retreats, and embodied learning experiences.", status: "By event", href: "/presence/events" },
];

export default function StorePage() {
  return (
    <SharedLayerPage
      id="store"
      index="10"
      eyebrow="The constellation store"
      title="Value returns to its source."
      introduction="Every artifact remains connected to the body that made it. This shared index routes directly to each pillar’s own catalog, release, or offering."
      items={items}
    />
  );
}
