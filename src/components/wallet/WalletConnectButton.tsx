"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnectButton() {
  const { address, chain, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    const connector = connectors[0];
    return (
      <div className="wallet-control">
        <button
          type="button"
          className="wallet-primary-button"
          disabled={!connector || isPending}
          onClick={() => connector && connect({ connector })}
        >
          {isPending ? "Opening wallet…" : connector ? "Connect wallet" : "Install a wallet"}
        </button>
        {error && <p className="observer-form-error">{error.message}</p>}
      </div>
    );
  }

  return (
    <div className="wallet-control wallet-connected-actions">
      <span>{chain?.name ?? "Connected"}</span>
      <code>{address?.slice(0, 6)}…{address?.slice(-4)}</code>
      <button type="button" onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}
