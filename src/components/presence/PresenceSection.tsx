import type { ReactNode } from "react";
import { PillarSectionHeading } from "@/components/ui/PillarSectionHeading";

export function PresenceSection({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return <PillarSectionHeading eyebrow={eyebrow} title={title} color="#d16b45">{children}</PillarSectionHeading>;
}
