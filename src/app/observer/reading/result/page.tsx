"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BindReadingToWallet } from "@/components/reading/BindReadingToWallet";
import {
  PENDING_READING_KEY,
  type ReadingApplication,
} from "@/components/reading/DodecaReadingForm";

export default function ReadingResultPage() {
  const [reading, setReading] = useState<ReadingApplication | null | undefined>(undefined);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.sessionStorage.getItem(PENDING_READING_KEY);
        setReading(stored ? JSON.parse(stored) as ReadingApplication : null);
      } catch {
        setReading(null);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (reading === undefined) {
    return <div className="observer-loading">Resolving your coordinates…</div>;
  }
  if (!reading) {
    return (
      <main className="observer-result-page is-empty">
        <h1>No reading found.</h1>
        <p>Your private result may have expired with this browser session.</p>
        <Link href="/observer/reading">Take the reading →</Link>
      </main>
    );
  }

  return (
    <main className="observer-result-page">
      <header>
        <p>Your coordinates are</p>
        <span>House {reading.house}</span>
        <h1>{reading.archetype}</h1>
        <h2>{reading.element} · {reading.pillar}</h2>
        <small>{reading.confidenceLabel} alignment · {Math.round(reading.confidence)}% modeled confidence</small>
      </header>
      <BindReadingToWallet reading={reading} />
      <nav>
        <Link href="/observer/reading">Recalculate</Link>
        <Link href="/observer/quincunx">View Living Quincunx →</Link>
      </nav>
    </main>
  );
}
