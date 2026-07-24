import Link from "next/link";
import type { PressVolume } from "@/lib/press-data";
import { PressBookCover } from "./PressBookCover";

export function PressBookCard({ volume }: { volume: PressVolume }) {
  return (
    <article className="group flex flex-col">
      <Link href={`/pillars/press/${volume.slug}`} className="block transition-transform duration-300 group-hover:-translate-y-1">
        <PressBookCover volume={volume} />
      </Link>
      <div className="px-1 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-press">Volume {volume.number} · {volume.element}</p>
        <h2 className="mt-2 font-display text-xl font-bold text-bone"><Link href={`/pillars/press/${volume.slug}`} className="text-bone hover:text-press">{volume.title}</Link></h2>
        <p className="mt-1 text-sm italic text-ghost">“{volume.tagline}”</p>
        <p className="mt-4 font-mono text-xs text-ghost">Digital $22 · Physical $77</p>
      </div>
    </article>
  );
}
