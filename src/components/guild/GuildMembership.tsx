"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

const BENEFITS = [
  {
    title: "Archive",
    description:
      "Return to member readings, field notes, and the growing Whole Body record.",
  },
  {
    title: "Gatherings",
    description:
      "Enter members-only circles, seasonal sessions, and live constellation events.",
  },
  {
    title: "Directory",
    description:
      "Find aligned creators, practitioners, and stewards across all twelve Houses.",
  },
  {
    title: "Voting",
    description:
      "Help shape Guild priorities through transparent member proposals and votes.",
  },
  {
    title: "AMAs",
    description:
      "Join recurring conversations with builders, teachers, artists, and advisors.",
  },
  {
    title: "Discounts",
    description:
      "Receive member pricing on readings, gatherings, publications, and services.",
  },
] as const;

type CheckoutResponse = {
  url?: string;
  error?: string;
};

export function GuildMembership() {
  const { address, isConnected } = useAccount();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function beginCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConnected || !address) {
      setError("Connect your wallet before opening membership checkout.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim();
      const response = await fetch("/api/guild/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          ...(normalizedEmail ? { email: normalizedEmail } : {}),
        }),
      });
      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout could not be opened.");
      }

      window.location.assign(data.url);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Checkout could not be opened. Please try again.",
      );
      setLoading(false);
    }
  }

  return (
    <main className="observer-guild-page mx-auto w-[min(1120px,calc(100%_-_32px))] py-16 sm:py-24">
      <header className="observer-guild-hero mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a99fe1]">
          Dodecanic application / 02
        </p>
        <h1 className="mt-5 font-display text-5xl font-medium leading-[0.94] text-[#f2eff9] sm:text-7xl">
          Enter the Sovereign Guild.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#9b95a3] sm:text-lg">
          The reading shows your coordinates. The Guild gives those coordinates
          a living network in which to practice, gather, and build.
        </p>
      </header>

      <section
        className="observer-guild-benefits mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3"
        aria-label="Guild membership benefits"
      >
        {BENEFITS.map((benefit, index) => (
          <article
            className="observer-guild-benefit min-h-52 border border-[#373141] bg-[linear-gradient(145deg,rgba(143,91,255,.11),rgba(13,12,18,.88))] p-6"
            key={benefit.title}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8f5bff]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-8 font-display text-3xl font-medium text-[#f2eff9]">
              {benefit.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#96909e]">
              {benefit.description}
            </p>
          </article>
        ))}
      </section>

      <section className="observer-guild-checkout mt-4 grid gap-8 border border-[#8f5bff]/50 bg-[radial-gradient(circle_at_85%_0%,rgba(143,91,255,.18),transparent_46%),rgba(13,11,19,.92)] p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="observer-guild-price">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b8ff5a]">
            Whole Body Guild membership
          </p>
          <p className="mt-5 flex items-end gap-2 text-[#f2eff9]">
            <strong className="font-display text-6xl font-medium leading-none sm:text-7xl">
              $11.11
            </strong>
            <span className="pb-2 font-mono text-xs uppercase tracking-[0.12em] text-[#8f8999]">
              / month
            </span>
          </p>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#96909e]">
            Cancel through Stripe at any time. Card and other eligible payment
            methods appear in secure hosted checkout.
          </p>
          <p className="mt-3 max-w-md font-mono text-[9px] uppercase leading-5 tracking-[0.08em] text-[#746e7d]">
            Stablecoin subscriptions appear only when Stripe has enabled that
            capability for this account and customer region.
          </p>
        </div>

        <form
          className="observer-guild-form border border-[#373141] bg-[#09080d]/80 p-5 sm:p-6"
          onSubmit={beginCheckout}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#a99fe1]">
            Wallet-bound access
          </p>
          <p className="mt-3 text-sm leading-6 text-[#96909e]">
            Connect the wallet that will identify your Guild profile. Signing
            up creates no on-chain transaction.
          </p>

          <WalletConnectButton />

          <label className="observer-guild-email mt-5 grid gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#aaa4b2]">
              Email <em className="font-normal not-italic text-[#746e7d]">Optional</em>
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              maxLength={254}
              placeholder="you@example.com"
              className="min-h-12 w-full border border-[#3a3544] bg-[#09080d] px-4 text-[#f2eff9] outline-none transition placeholder:text-[#625d69] focus:border-[#8f5bff]"
            />
          </label>

          <button
            type="submit"
            disabled={!isConnected || !address || loading}
            className="observer-guild-subscribe mt-5 min-h-12 w-full border border-[#8f5bff] bg-[#6d4aff] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#7a59ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Opening secure checkout…"
              : isConnected
                ? "Subscribe for $11.11 / month"
                : "Connect wallet to subscribe"}
          </button>

          {error ? (
            <p
              className="observer-guild-error mt-4 border border-[#a64c4c] bg-[#a64c4c]/10 px-4 py-3 text-center text-xs leading-5 text-[#ff8a83]"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </form>
      </section>

      <aside className="observer-guild-reading mt-6 border border-[#34303e] bg-[#0d0c12]/80 p-6 text-center">
        <p className="text-sm leading-6 text-[#96909e]">
          Haven&apos;t decoded your House yet? Start with the private reading
          before you enter the network.
        </p>
        <Link
          href="/observer/reading"
          className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.13em] text-[#b8adf2] transition hover:text-white"
        >
          Take the Dodecanic reading →
        </Link>
      </aside>
    </main>
  );
}
