import type { ReactNode } from "react";
import { PillarSectionHeading } from "@/components/ui/PillarSectionHeading";

export function PressSectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return <PillarSectionHeading eyebrow={eyebrow} title={title} color="#d4af37">{children}</PillarSectionHeading>;
}
