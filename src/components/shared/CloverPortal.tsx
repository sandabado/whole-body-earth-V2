"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const DISSOLVE_DURATION_MS = 600;

export function CloverPortal() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isCrossing, setIsCrossing] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function crossThreshold(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (isCrossing) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setIsCrossing(true);
    timeoutRef.current = setTimeout(() => {
      window.location.assign("/observer");
    }, DISSOLVE_DURATION_MS);
  }

  return (
    <>
      <a
        href="/observer"
        className="clover-portal"
        aria-label="Apply with your birth chart"
        aria-busy={isCrossing}
        onClick={crossThreshold}
      >
        <span aria-hidden="true">🍀</span>
      </a>
      {isCrossing ? (
        <div
          className="clover-portal-dissolve"
          aria-hidden="true"
          style={
            {
              "--clover-dissolve-duration": `${DISSOLVE_DURATION_MS}ms`,
            } as CSSProperties
          }
        />
      ) : null}
    </>
  );
}
