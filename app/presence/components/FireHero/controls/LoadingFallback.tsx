"use client";

import type { CSSProperties } from "react";

export type LoadingFallbackStatus = "loading" | "fallback" | "error";

export interface LoadingFallbackProps {
  status: LoadingFallbackStatus;
  className?: string;
  onRetry?: () => void;
}

const containerStyle: CSSProperties = {
  alignItems: "center",
  color: "rgba(237, 237, 237, 0.52)",
  display: "flex",
  flexDirection: "column",
  fontFamily: "var(--font-mono), monospace",
  fontSize: 8,
  fontWeight: 500,
  gap: 12,
  letterSpacing: "0.16em",
  maxWidth: 260,
  textAlign: "center",
  textTransform: "uppercase",
};

const retryStyle: CSSProperties = {
  alignItems: "center",
  background: "rgba(5, 5, 5, 0.68)",
  border: "1px solid rgba(232, 84, 42, 0.58)",
  borderRadius: 2,
  color: "#E8542A",
  cursor: "pointer",
  display: "inline-flex",
  fontFamily: "inherit",
  fontSize: 8,
  fontWeight: 500,
  justifyContent: "center",
  letterSpacing: "0.15em",
  minHeight: 44,
  padding: "10px 14px",
  textTransform: "uppercase",
};

const copyByStatus: Record<LoadingFallbackStatus, string> = {
  loading: "Gathering the fire",
  fallback: "A quieter fire is present",
  error: "The fire could not begin",
};

/**
 * Compact status UI for the progressive WebGL path. The full visual fallback
 * remains owned by FireHero, so this never masks the hero copy.
 */
export function LoadingFallback({
  status,
  className,
  onRetry,
}: LoadingFallbackProps) {
  const isError = status === "error";

  return (
    <div
      className={className}
      data-fire-status={status}
      role={isError ? "alert" : "status"}
      aria-busy={status === "loading"}
      aria-live={isError ? "assertive" : "polite"}
      style={{
        ...containerStyle,
        opacity: status === "fallback" ? 0.46 : 1,
        pointerEvents: isError && onRetry ? "auto" : "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          border:
            status === "error"
              ? "1px solid rgba(237, 237, 237, 0.3)"
              : "1px solid rgba(232, 84, 42, 0.48)",
          borderRadius: "50%",
          display: "inline-flex",
          height: 18,
          justifyContent: "center",
          width: 18,
        }}
      >
        <span
          style={{
            background: status === "error" ? "transparent" : "#E8542A",
            borderRadius: "50%",
            boxShadow:
              status === "loading"
                ? "0 0 12px rgba(232, 84, 42, 0.72)"
                : "none",
            color: "rgba(237, 237, 237, 0.66)",
            display: "block",
            fontSize: 12,
            height: status === "error" ? "auto" : 4,
            lineHeight: 1,
            width: status === "error" ? "auto" : 4,
          }}
        >
          {status === "error" ? "×" : null}
        </span>
      </span>
      <span>{copyByStatus[status]}</span>
      {isError && onRetry ? (
        <button type="button" onClick={onRetry} style={retryStyle}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export default LoadingFallback;
