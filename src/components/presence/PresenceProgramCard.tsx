import Link from "next/link";
import type { PRESENCE_PROGRAMS } from "@/lib/presence-data";

export function PresenceProgramCard({ program }: { program: (typeof PRESENCE_PROGRAMS)[number] }) {
  return <article className="border border-fire/45 bg-carbon/55 p-7 transition-colors hover:bg-steel"><p className="text-3xl">{program.icon}</p><p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-fire">{program.type}</p><h2 className="mt-2 font-display text-2xl font-bold">{program.title}</h2><p className="mt-4 leading-relaxed text-ghost">{program.detail}</p><p className="mt-6 font-mono text-xs text-bone">{program.meta}</p><Link href={program.href} className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.13em] text-fire">{program.cta}</Link></article>;
}
