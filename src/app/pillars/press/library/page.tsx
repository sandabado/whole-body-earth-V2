import Link from "next/link";
import { LibraryGrid } from "@/components/press/LibraryGrid";
import { PressSectionHeading } from "@/components/press/PressSectionHeading";

export default function PressLibraryPage() { return <div className="px-6 py-14 md:py-20"><div className="mx-auto max-w-[1200px]"><Link href="/pillars/press" className="font-mono text-xs uppercase tracking-[0.14em] text-press">← Press home</Link><div className="mt-10"><PressSectionHeading eyebrow="Whole Body Press library" title="The Whole Body Series"><p>Every available title, gathered in one place.</p></PressSectionHeading></div><section className="mt-14"><LibraryGrid /></section></div></div>; }
