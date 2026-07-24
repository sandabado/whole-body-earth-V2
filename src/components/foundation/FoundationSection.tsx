import type { ReactNode } from "react";
import { PillarSectionHeading } from "@/components/ui/PillarSectionHeading";
export function FoundationSection({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) { return <PillarSectionHeading eyebrow={eyebrow} title={title} color="#84a66e">{children}</PillarSectionHeading>; }
