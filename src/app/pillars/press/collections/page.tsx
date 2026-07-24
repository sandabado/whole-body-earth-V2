import Link from "next/link";
import { PressSectionHeading } from "@/components/press/PressSectionHeading";
import { readingPaths } from "@/lib/press-data";

export default function CollectionsPage() {
  return <div className="px-6 py-14 md:py-20"><div className="mx-auto max-w-[1000px]"><PressSectionHeading eyebrow="Curated reading paths" title="Not every reader enters at the same door."><p>Choose the path that matches where you are.</p></PressSectionHeading><div className="mt-14 divide-y divide-press/35 border-y border-press/35">{readingPaths.map((path) => <article key={path.title} className="py-10"><div className="grid gap-7 md:grid-cols-[0.8fr_1.2fr]"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-press">{path.audience}</p><h2 className="mt-3 font-display text-3xl font-bold">{path.title}</h2><p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-press">{path.volumes.join(" → ")}</p></div><div><p className="font-display text-lg text-bone">{path.route.join(" → ")}</p><p className="mt-4 leading-relaxed text-ghost">{path.description}</p><p className="mt-5 font-mono text-xs text-press">{path.price}</p><Link href="/pillars/press/readers" className="mt-5 inline-block font-mono text-xs uppercase tracking-[0.13em] text-press">View library access →</Link></div></div></article>)}</div></div></div>;
}
