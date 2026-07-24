"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { gallery } from "./data";

const filters = ["ALL", "RETREAT", "CEREMONY", "PRACTICE", "COMMUNITY", "LANDSCAPE", "SPACE"];

export function GalleryExperience() {
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const visible = gallery.map((item, index) => ({ item, index })).filter(({ item }) => filter === "ALL" || item[1] === filter);

  useEffect(() => {
    if (selected === null) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [selected]);

  return <>
    <div className="filter-pills" role="group" aria-label="Filter gallery">
      {filters.map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
    </div>
    <motion.div layout={!reduced} className="gallery-masonry">
      <AnimatePresence mode="popLayout">
        {visible.map(({ item, index }, order) => <motion.figure layout={!reduced} key={item[0]} initial={reduced ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .35, delay: reduced ? 0 : order * .035 }} role="button" tabIndex={0} aria-label={`Open ${item[2]}`} onClick={() => setSelected(index)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(index); } }}>
          <img src={item[0]} alt={item[2]} loading="lazy" />
          <figcaption><b>{item[1]}</b><span>{item[2]}</span><em>OPEN IMAGE ↗</em></figcaption>
        </motion.figure>)}
      </AnimatePresence>
    </motion.div>
    {selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={gallery[selected][2]} onClick={() => setSelected(null)}><button onClick={() => setSelected(null)} aria-label="Close image">CLOSE ×</button><img src={gallery[selected][0]} alt={gallery[selected][2]} onClick={e => e.stopPropagation()} /><p>{gallery[selected][2]} <span>· {gallery[selected][1]}</span></p></div>}
  </>;
}
