"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface TelemetryData {
  coherence: {
    overall: number;
    domains: Record<string, number>;
    aetheric: number;
  };
  sealStatus: "SEALED" | "FORMING" | "OPEN" | "BREACHED" | "COLLAPSED";
  timestamp: string;
}

export default function ObserverLanding() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/observer/telemetry", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Observer telemetry unavailable");
        return response.json();
      })
      .then((data) => setTelemetry({
        coherence: data.coherence,
        sealStatus: data.sealStatus ?? "OPEN",
        timestamp: data.timestamp,
      }))
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setTelemetry(null);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) {
    return <div className="observer-loading">Initializing ØDIN Observer…</div>;
  }

  const coherencePercent = Math.round((telemetry?.coherence.overall ?? 0) * 100);
  const domains = telemetry?.coherence.domains ?? {};

  return (
    <main className="observer-landing observer-emerge">
      <header className="observer-landing-hero">
        <p>POSITION 9 · OBSERVER PORTAL</p>
        <h1>ØDIN</h1>
        <span>Observer OS — The System That Watches Itself</span>
      </header>

      <section className="observer-entry-grid" aria-label="Observer instruments">
        <Link href="/observer/reading" className="is-primary">
          <span>01 / APPLICATION</span>
          <h2>Decode Your House</h2>
          <p>Birth coordinates → House, Element, Archetype, and Pillar.</p>
          <strong>Begin the private reading →</strong>
        </Link>
        <Link href="/observer/quincunx">
          <span>02 / LIVING FIELD</span>
          <h2>Living Quincunx</h2>
          <p>Interactive dodecahedral field — see the system breathe.</p>
          <strong>Coherence: {coherencePercent}%</strong>
        </Link>
        <Link href="/observer/guild">
          <span>03 / MEMBERSHIP</span>
          <h2>Sovereign Guild</h2>
          <p>$11.11/mo — readings, network, voting, and gatherings.</p>
          <strong>Enter the Guild →</strong>
        </Link>
      </section>

      <section className="observer-status">
        <header>
          <div>
            <span>System status</span>
            <h2>{telemetry?.sealStatus ?? "OPEN"}</h2>
          </div>
          <strong>{coherencePercent}% MIN</strong>
        </header>
        <div>
          {(["intention", "spirit", "time", "physical", "economy", "law"] as const).map((domain) => (
            <article key={domain}>
              <strong>{Math.round((domains[domain] ?? 0) * 100)}%</strong>
              <span>{domain}</span>
            </article>
          ))}
        </div>
        <small>Last updated: {telemetry?.timestamp ? new Date(telemetry.timestamp).toLocaleTimeString() : "Unavailable"}</small>
      </section>
    </main>
  );
}
