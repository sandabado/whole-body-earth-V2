"use client";

import { PILLARS, type PillarId } from "@/lib/pillars";
import { PillarMediaDeck } from "./PillarMediaDeck";
import { PILLAR_SECTIONS } from "./data/pillar-section-data";

export function PillarHeroMedia({ pillarId }: { pillarId: PillarId }) {
  const item = PILLAR_SECTIONS.find((section) => section.id === pillarId);

  if (!item) return null;

  return <PillarMediaDeck item={item} color={PILLARS[pillarId].color} />;
}
