"use client";

import { useState } from "react";
import { pressVolumes, type PressCategory } from "@/lib/press-data";
import { PressBookCard } from "./PressBookCard";

const filters: Array<"All Titles" | PressCategory> = ["All Titles", "The Whole Body Series", "Manuals", "Practice Guides", "Forthcoming"];

export function LibraryGrid() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All Titles");
  const volumes = activeFilter === "All Titles" ? pressVolumes : pressVolumes.filter((volume) => volume.category === activeFilter);
  return <><div className="flex flex-wrap gap-2 border-y border-mercury py-5">{filters.map((filter) => <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] transition-colors ${activeFilter === filter ? "border-press bg-press text-void" : "border-mercury text-ghost hover:border-press hover:text-bone"}`}>{filter}</button>)}</div>{volumes.length ? <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{volumes.map((volume) => <PressBookCard key={volume.slug} volume={volume} />)}</div> : <p className="py-20 text-center text-ghost">This shelf is being prepared. Join the library when the next title arrives.</p>}</>;
}
