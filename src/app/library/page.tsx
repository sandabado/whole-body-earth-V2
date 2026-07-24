import Link from "next/link";
import { LibraryGrid } from "@/components/press/LibraryGrid";
import { PressSectionHeading } from "@/components/press/PressSectionHeading";

export default function LibraryPage() {
  return <main className="relative px-6 py-16 md:py-24"><div className="mx-auto max-w-[1200px]"><PressSectionHeading eyebrow="Whole Body Press library" title="The Whole Body Series"><p>Books, manuals, and reading paths for the work that carries.</p></PressSectionHeading><div className="mt-12"><LibraryGrid /></div><Link href="/pillars/press" className="mt-10 inline-block font-mono text-[10px] uppercase tracking-[.12em] text-press">Enter Whole Body Press →</Link></div></main>;
}
