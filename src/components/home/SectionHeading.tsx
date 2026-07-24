import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
type Props = { eyebrow: string; title: ReactNode; description?: string; align?: "left" | "center"; className?: string };
export function SectionHeading({ eyebrow, title, description, align = "left", className }: Props) { const centered = align === "center"; return <div className={cn(centered && "mx-auto text-center", className)}><p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-water">{eyebrow}</p><h2 className="font-display text-3xl leading-[1.08] font-bold text-bone md:text-5xl">{title}</h2>{description && <p className={cn("mt-5 max-w-2xl leading-relaxed text-ghost", centered && "mx-auto")}>{description}</p>}</div>; }
