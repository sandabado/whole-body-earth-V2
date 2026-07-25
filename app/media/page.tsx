import type { Metadata } from "next";
import { SharedLayerPage, type SharedLayerItem } from "../components/shared/SharedLayerPage";

export const metadata: Metadata = {
  title: { absolute: "Media — Whole Body Earth" },
  description: "The shared media signal across Whole Body Earth.",
};

const items: readonly SharedLayerItem[] = [
  { glyph: "🜄", meta: "Audio · Studios", title: "Living Earth catalog", description: "Music released as infrastructure for artists and rooms.", status: "24 tracks", href: "/studios/catalog" },
  { glyph: "🜂", meta: "Image · Presence", title: "Gathering gallery", description: "A visual record of rooms, practices, and embodied community.", status: "View gallery", href: "/presence/gallery" },
  { glyph: "🜁", meta: "Text · Press", title: "Editorial signal", description: "Current editions, authors, events, and reading paths.", status: "Browse", href: "/press/catalog" },
  { glyph: "🜃", meta: "Field · Foundation", title: "The build in motion", description: "Visual and technical records from the developing land project.", status: "Phase I", href: "/foundation/the-build" },
];

export default function MediaPage() {
  return (
    <SharedLayerPage
      id="media"
      index="13"
      eyebrow="The shared signal"
      title="See what the body is making."
      introduction="Sound, image, text, and field documentation gathered into one neutral index, then returned to the pillar where each work lives."
      items={items}
    />
  );
}
