import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PressBookCover } from "@/components/press/PressBookCover";
import { PressBookCard } from "@/components/press/PressBookCard";
import { getPressVolume, pressVolumes } from "@/lib/press-data";

export function generateStaticParams() { return pressVolumes.map((volume) => ({ slug: volume.slug })); }
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { return params.then(({ slug }) => { const volume = getPressVolume(slug); return { title: volume ? `${volume.title} — Whole Body Press` : "Whole Body Press" }; }); }

export default async function VolumePage({ params }: { params: Promise<{ slug: string }> }) {
  const volume = getPressVolume((await params).slug);
  if (!volume) notFound();
  const related = pressVolumes.filter((item) => item.slug !== volume.slug).slice(0, 3);
  return <div className="px-6 py-14 md:py-20"><div className="mx-auto max-w-[1200px]"><Link href="/pillars/press/library" className="font-mono text-xs uppercase tracking-[0.14em] text-press">← Return to library</Link><section className="mt-10 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20"><div><PressBookCover volume={volume} size="hero" /></div><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-press">Volume {volume.number} · {volume.element} · {volume.shape}</p><h1 className="mt-4 font-display text-5xl leading-[1.03] font-bold md:text-6xl">{volume.title}</h1><p className="mt-4 text-xl italic text-ghost">“{volume.tagline}”</p><div className="mt-9 space-y-5 leading-relaxed text-ghost">{volume.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-ghost">{volume.pages} pages · Hardcover & Digital · Jesse Gawlik</p><div className="mt-8 flex flex-wrap gap-3"><span className="border border-press px-4 py-3 font-mono text-xs uppercase tracking-[0.13em] text-press">Digital — $22</span><span className="border border-mercury px-4 py-3 font-mono text-xs uppercase tracking-[0.13em] text-bone">Physical — $77</span></div><p className="mt-4 text-xs text-ghost">Purchase links open with library access in Q4 2026.</p></div></section><section className="my-20 border-y border-press/30 py-12"><p className="font-mono text-xs uppercase tracking-[0.2em] text-press">From the text</p><blockquote className="mt-5 max-w-4xl font-display text-2xl leading-relaxed text-bone md:text-3xl">“{volume.excerpt}”</blockquote></section><section><div className="flex items-end justify-between gap-6"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-press">Continue reading</p><h2 className="mt-3 font-display text-3xl font-bold">Related volumes</h2></div><Link href="/pillars/press/collections" className="font-mono text-xs uppercase tracking-[0.14em] text-press">Reading paths →</Link></div><div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <PressBookCard key={item.slug} volume={item} />)}</div></section></div></div>;
}
