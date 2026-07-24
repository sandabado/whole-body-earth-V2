"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

type AccountReading = {
  house: number;
  element: string;
  archetype: string;
  pillar: string;
};

type StoredReading = {
  address?: string;
  reading?: Partial<AccountReading>;
  house?: number;
  element?: string;
  archetype?: string;
  pillar?: string;
};

function parseReading(raw: string | null): {
  address: string | null;
  reading: AccountReading;
} | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredReading;
    const candidate = parsed.reading ?? parsed;
    if (
      typeof candidate.house !== "number" ||
      typeof candidate.element !== "string" ||
      typeof candidate.archetype !== "string" ||
      typeof candidate.pillar !== "string"
    ) {
      return null;
    }

    return {
      address: typeof parsed.address === "string" ? parsed.address : null,
      reading: {
        house: candidate.house,
        element: candidate.element,
        archetype: candidate.archetype,
        pillar: candidate.pillar,
      },
    };
  } catch {
    return null;
  }
}

export function AccountDashboard({
  checkoutReturned,
}: {
  checkoutReturned: boolean;
}) {
  const { address, isConnected } = useAccount();
  const [storedReading, setStoredReading] = useState<ReturnType<
    typeof parseReading
  > | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const current = parseReading(
        window.localStorage.getItem("wholebody:bound-reading"),
      );
      const legacy =
        current ??
        parseReading(window.localStorage.getItem("wholebody_reading"));
      setStoredReading(legacy);
      setHasLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const readingBelongsToConnectedWallet =
    !storedReading?.address ||
    !address ||
    storedReading.address.toLowerCase() === address.toLowerCase();

  return (
    <main className="observer-account-page">
      <header className="observer-account-hero">
        <p>Wallet-bound profile</p>
        <h1>Your Observer Account</h1>
        <span>
          One public address. One private reading. One place to re-enter the
          field.
        </span>
      </header>

      {checkoutReturned ? (
        <section className="observer-account-success" role="status">
          <strong>Guild checkout complete ✓</strong>
          <p>
            Stripe returned successfully. Phase 2 will display webhook-verified
            subscription status here.
          </p>
        </section>
      ) : null}

      <section className="observer-account-wallet">
        <div>
          <span>Identity</span>
          <h2>{isConnected ? "Wallet connected" : "Connect your wallet"}</h2>
          <p>
            {address ??
              "Connect the wallet used to claim your Dodecanic reading."}
          </p>
        </div>
        <WalletConnectButton />
      </section>

      {!hasLoaded ? (
        <div className="observer-account-loading">Loading local reading…</div>
      ) : storedReading ? (
        <section className="observer-account-reading">
          <header>
            <div>
              <span>Dodecanic identity</span>
              <h2>House {storedReading.reading.house}</h2>
            </div>
            <strong>{storedReading.reading.pillar}</strong>
          </header>
          <div>
            <article>
              <span>House</span>
              <strong>{storedReading.reading.house}</strong>
            </article>
            <article>
              <span>Element</span>
              <strong>{storedReading.reading.element}</strong>
            </article>
            <article>
              <span>Archetype</span>
              <strong>{storedReading.reading.archetype}</strong>
            </article>
            <article>
              <span>Pillar</span>
              <strong>{storedReading.reading.pillar}</strong>
            </article>
          </div>
          {!readingBelongsToConnectedWallet ? (
            <p className="observer-account-warning" role="alert">
              This browser reading was claimed by a different wallet. Reconnect
              that wallet or take a new reading before joining the Guild.
            </p>
          ) : null}
        </section>
      ) : (
        <section className="observer-account-empty">
          <span>No bound reading found</span>
          <h2>Decode your House first.</h2>
          <p>
            Your reading remains private in this browser until you choose to
            bind its public result to a wallet.
          </p>
          <Link href="/observer/reading">Take the Dodecanic reading →</Link>
        </section>
      )}

      <nav className="observer-account-actions" aria-label="Account actions">
        <Link href="/observer/quincunx">
          <span>Living instrument</span>
          <strong>Open the Quincunx →</strong>
        </Link>
        {!checkoutReturned ? (
          <Link href="/observer/guild">
            <span>Membership</span>
            <strong>Enter the Guild →</strong>
          </Link>
        ) : (
          <Link href="/observer">
            <span>Observer OS</span>
            <strong>Return to the field →</strong>
          </Link>
        )}
      </nav>
    </main>
  );
}
