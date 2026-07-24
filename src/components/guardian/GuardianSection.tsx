import type { ReactNode } from "react";
import { PillarSectionHeading } from "@/components/ui/PillarSectionHeading";
export function GuardianSection({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) { return <PillarSectionHeading eyebrow={eyebrow} title={title} color="#8f5bff">{children}</PillarSectionHeading>; }
