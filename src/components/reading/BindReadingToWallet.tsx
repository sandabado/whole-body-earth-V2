"use client";

import { useMemo, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { buildReadingClaimMessage, type PublicReadingClaim } from "@/lib/wallet/reading-claim";
import type { ReadingApplication } from "./DodecaReadingForm";

type BindStatus = "idle" | "signing" | "verifying" | "bound" | "error";

async function readingCommitment(reading: ReadingApplication) {
  const encoded = new TextEncoder().encode(JSON.stringify({
    house: reading.house,
    houseName: reading.houseName,
    element: reading.element,
    archetype: reading.archetype,
    pillar: reading.pillar,
    birthData: reading.birthData,
  }));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return `0x${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export function BindReadingToWallet({ reading }: { reading: ReadingApplication }) {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [status, setStatus] = useState<BindStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [boundAddress, setBoundAddress] = useState<string | null>(null);
  const publicReading = useMemo<PublicReadingClaim>(() => ({
    house: reading.house,
    element: reading.element,
    archetype: reading.archetype,
    pillar: reading.pillar,
  }), [reading]);

  async function handleSign() {
    if (!address || !chainId) return;
    setStatus("signing");
    setError(null);

    try {
      const nonceResponse = await fetch("/api/reading/bind/nonce", {
        method: "POST",
        cache: "no-store",
      });
      const nonceData = (await nonceResponse.json()) as { nonce?: string; expiresAt?: string };
      if (!nonceResponse.ok || !nonceData.nonce || !nonceData.expiresAt) {
        throw new Error("Could not create a secure signing request.");
      }

      const claimHash = await readingCommitment(reading);
      const issuedAt = new Date().toISOString();
      const expirationTime = nonceData.expiresAt;
      const message = buildReadingClaimMessage({
        domain: window.location.host,
        address,
        uri: window.location.origin,
        chainId,
        nonce: nonceData.nonce,
        issuedAt,
        expirationTime,
        claimHash,
        reading: publicReading,
      });
      const signature = await signMessageAsync({ message });

      setStatus("verifying");
      const verifyResponse = await fetch("/api/reading/bind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          signature,
          chainId,
          nonce: nonceData.nonce,
          issuedAt,
          expirationTime,
          claimHash,
          reading: publicReading,
        }),
      });
      const verified = (await verifyResponse.json()) as { bound?: boolean; error?: string };
      if (!verifyResponse.ok || !verified.bound) {
        throw new Error(verified.error || "The signature could not be verified.");
      }

      window.localStorage.setItem("wholebody:bound-reading", JSON.stringify({
        address,
        signature,
        claimHash,
        reading,
        boundAt: new Date().toISOString(),
        persisted: false,
      }));
      setBoundAddress(address);
      setStatus("bound");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Signature rejected.");
      setStatus("error");
    }
  }

  if (!isConnected) {
    return (
      <section className="wallet-bind-card">
        <span>Cryptographic application</span>
        <h2>Bind this reading to your wallet</h2>
        <p>Your wallet proves control of a public address. Birth coordinates remain private in this browser.</p>
        <WalletConnectButton />
        <small>Connecting is free. Signing the claim is not a transaction and spends no gas.</small>
      </section>
    );
  }

  if (status === "bound") {
    return (
      <section className="wallet-bind-card is-bound">
        <span>Signature verified</span>
        <h2>Reading bound ✓</h2>
        <p>House {reading.house} · {reading.archetype} is cryptographically claimed by this wallet.</p>
        <code>{boundAddress}</code>
        <div className="wallet-next-actions">
          <a href={`/pillars/${reading.pillar.toLowerCase()}`}>Begin in {reading.pillar} →</a>
          <a href="/observer/quincunx">View Living Quincunx →</a>
        </div>
        <small>This Phase 1 binding is verified but stored only in this browser.</small>
      </section>
    );
  }

  return (
    <section className={`wallet-bind-card${status === "error" ? " has-error" : ""}`}>
      <span>Wallet connected</span>
      <h2>{status === "signing" ? "Check your wallet…" : status === "verifying" ? "Verifying signature…" : "Claim your House"}</h2>
      <p>The message contains the public House result and a one-way commitment. It does not contain your birth date, time, or location.</p>
      <WalletConnectButton />
      <button className="wallet-primary-button" type="button" disabled={status === "signing" || status === "verifying"} onClick={() => void handleSign()}>
        {status === "signing" ? "Awaiting signature…" : status === "verifying" ? "Verifying…" : "Sign & bind reading"}
      </button>
      {error && <p className="observer-form-error" role="alert">{error}</p>}
      <small>No transaction · No gas · One-time nonce · Five-minute expiry</small>
    </section>
  );
}
