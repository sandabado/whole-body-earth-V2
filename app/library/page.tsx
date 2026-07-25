import type { Metadata } from "next";
import { SharedLayerPage, type SharedLayerItem } from "../components/shared/SharedLayerPage";

export const metadata: Metadata = {
  title: { absolute: "Library — Whole Body Earth" },
  description: "The shared reading index for Whole Body Earth.",
};

const items: readonly SharedLayerItem[] = [
  { glyph: "🜁", meta: "Press · Open shelves", title: "The Press Library", description: "Essays, excerpts, reading paths, and the Living Earth Codex.", status: "Read now", href: "/press/library" },
  { glyph: "🜂", meta: "Presence · Code", title: "The Presence Code", description: "The ethics and agreements that hold embodied community.", status: "Open text", href: "/presence/code" },
  { glyph: "🜃", meta: "Foundation · Build", title: "The Glory Peak record", description: "Plans, phases, and material intelligence from the land.", status: "Field notes", href: "/foundation/the-build" },
  { glyph: "🜄", meta: "Studios · Catalog", title: "The signal archive", description: "Music, release notes, and the artist-owned catalog.", status: "Listen", href: "/studios/catalog" },
  { glyph: "⊙", meta: "Guardian · Protected", title: "Agreements index", description: "The visible threshold to private stewardship architecture.", status: "Limited", href: "/guardian" },
];

export default function LibraryPage() {
  return (
    <SharedLayerPage
      id="library"
      index="12"
      eyebrow="The living library"
      title="Knowledge with a body."
      introduction="A shared reading index for texts, field records, ethical codes, releases, and agreements. The source remains visible; nothing is stripped of context."
      items={items}
    />
  );
}
