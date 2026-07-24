"use client";

import { useState } from "react";

const OFFERS = [
  {
    slug: "star-passport-tarot-astrology-reading",
    eyebrow: "With Shannon · $111",
    title: "Tarot + Astrology Reading",
    body: "A personal Tarot and astrology reading prepared from your Star Passport, then delivered to you as a digital download.",
    note: "Personalized delivery · no subscription",
    color: "#d16b45",
    cta: "Order your reading →",
  },
  {
    slug: "whole-body-deep-dive-jesse-gawlik",
    eyebrow: "With Jesse Gawlik · $333",
    title: "Whole Body Deep Dive",
    body: "Build the next layer of your sovereign business, clarify your operating structure, and explore the first aligned path into the Guild.",
    note: "Strategic consultation · personalized follow-up",
    color: "#8f5bff",
    cta: "Start the deep dive →",
  },
] as const;

export function PassportOffers({ passportId }: { passportId: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function beginCheckout(slug: string) {
    setLoading(slug);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, passportId }),
      });
      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !payload.url)
        throw new Error(payload.error || "Checkout could not be opened.");
      window.location.assign(payload.url);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Checkout could not be opened.",
      );
      setLoading(null);
    }
  }

  return (
    <section className="border border-press/45 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,.14),transparent_46%),rgba(12,12,19,.92)] p-6 sm:p-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-press">
          Continue the work
        </p>
        <h3 className="mt-3 font-display text-3xl text-bone sm:text-4xl">
          Two deeper paths from your coordinates.
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-ghost">
          Your Star Passport is the map. Choose a focused interpretation or a
          strategic working session when you are ready to carry it into
          practice.
        </p>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {OFFERS.map((offer) => (
          <article
            key={offer.slug}
            className="flex min-h-72 flex-col border p-6"
            style={{
              borderColor: `${offer.color}99`,
              backgroundColor: `${offer.color}12`,
            }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[.16em]"
              style={{ color: offer.color }}
            >
              {offer.eyebrow}
            </p>
            <h4 className="mt-3 font-display text-3xl text-bone">
              {offer.title}
            </h4>
            <p className="mt-4 text-sm leading-7 text-ghost">{offer.body}</p>
            <p className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[.13em] text-bone/75">
              {offer.note}
            </p>
            <button
              type="button"
              onClick={() => void beginCheckout(offer.slug)}
              disabled={loading !== null}
              className="mt-5 border px-4 py-3 font-mono text-[10px] uppercase tracking-[.13em] transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
              style={{ color: offer.color, borderColor: offer.color }}
            >
              {loading === offer.slug ? "Opening secure checkout…" : offer.cta}
            </button>
          </article>
        ))}
      </div>
      {error ? (
        <p
          role="alert"
          className="mx-auto mt-5 max-w-2xl border border-fire/60 bg-fire/10 px-4 py-3 text-center text-sm text-bone"
        >
          {error}
        </p>
      ) : null}
      <p className="mt-6 text-center text-xs leading-5 text-ghost">
        Payments are handled by Stripe. The Deep Dive is educational and
        strategic support, not legal, tax, or financial advice.
      </p>
    </section>
  );
}
