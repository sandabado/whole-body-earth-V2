"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const announcements = [
  "Now live: Sandābādo — ∞ Love",
  "The Whole Body Series · Volumes I–V",
  "Weekly Whole Body Circle · Every Tuesday",
];

export default function AnnouncementTicker() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % announcements.length);
    }, 6_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <Link
      href="/events"
      className="group hidden h-5 min-w-0 max-w-[23rem] items-center border-x border-mercury px-3 text-[9px] text-ghost transition-colors hover:text-bone lg:flex"
      aria-label="View the Whole Body calendar: releases and gatherings"
    >
      <span className="shrink-0 bg-void pr-2 font-mono uppercase tracking-[0.16em] text-press">Live</span>
      <span className="sr-only">Current releases and upcoming gatherings: </span>
      <span className="min-w-0 flex-1 overflow-hidden" aria-hidden="true">
        <span key={announcements[activeIndex]} className="announcement-fade block truncate font-mono uppercase tracking-[0.11em]">
          {announcements[activeIndex]}<span className="mx-2 text-press">✦</span>
        </span>
      </span>
    </Link>
  );
}
