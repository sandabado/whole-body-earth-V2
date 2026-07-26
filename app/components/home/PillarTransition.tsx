"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import type { ActivePillar } from "../HeroEngine/config";
import AirTransition from "../transitions/AirTransition";
import EarthTransition from "../transitions/EarthTransition";
import EtherTransition from "../transitions/EtherTransition";
import FireTransition from "../transitions/FireTransition";
import WaterTransition from "../transitions/WaterTransition";
import styles from "./TransitionOverlay.module.css";

export type PortalPillar = Exclude<ActivePillar, "none" | "whole">;

type PillarTransitionProps = {
  activePillar: PortalPillar | "none";
  onCancel: () => void;
  onComplete: () => void;
};

type TouchOrigin = {
  pointerId: number;
  x: number;
  y: number;
};

const TRANSITION_DURATION_MS = 1200;
const CANCEL_DURATION_MS = 220;
const SWIPE_CANCEL_THRESHOLD_PX = 72;

const routes: Record<PortalPillar, string> = {
  presence: "/presence",
  press: "/press",
  studios: "/studios",
  foundation: "/foundation",
  guardian: "/guardian",
};

const names: Record<PortalPillar, string> = {
  presence: "the Fire Pillar",
  press: "the Air Pillar",
  studios: "the Water Pillar",
  foundation: "the Earth Pillar",
  guardian: "the Ether Pillar",
};

function TransitionScene({ pillar }: { pillar: PortalPillar }) {
  switch (pillar) {
    case "presence":
      return <FireTransition />;
    case "press":
      return <AirTransition />;
    case "studios":
      return <WaterTransition />;
    case "foundation":
      return <EarthTransition />;
    case "guardian":
      return <EtherTransition />;
  }
}

export function PillarTransition({
  activePillar,
  onCancel,
  onComplete,
}: PillarTransitionProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const completionTimerRef = useRef<number | null>(null);
  const cancelTimerRef = useRef<number | null>(null);
  const cancellingRef = useRef(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchOriginRef = useRef<TouchOrigin | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const pillar = activePillar === "none" ? null : activePillar;

  const clearTimers = useCallback(() => {
    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    if (cancelTimerRef.current !== null) {
      window.clearTimeout(cancelTimerRef.current);
      cancelTimerRef.current = null;
    }
  }, []);

  const cancelTransition = useCallback(() => {
    if (!pillar || cancellingRef.current) return;
    clearTimers();
    cancellingRef.current = true;
    setCancelling(true);
    cancelTimerRef.current = window.setTimeout(() => {
      cancelTimerRef.current = null;
      cancellingRef.current = false;
      setCancelling(false);
      onCancel();
    }, CANCEL_DURATION_MS);
  }, [clearTimers, onCancel, pillar]);

  useEffect(() => {
    if (!pillar) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    overlayRef.current?.focus({ preventScroll: true });
    cancellingRef.current = false;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      onComplete();
      router.push(routes[pillar]);
      return;
    }

    completionTimerRef.current = window.setTimeout(() => {
      completionTimerRef.current = null;
      onComplete();
      router.push(routes[pillar]);
    }, TRANSITION_DURATION_MS);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelTransition();
        return;
      }
      if (event.key === "Tab") event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      clearTimers();
      previousFocusRef.current?.focus({ preventScroll: true });
      previousFocusRef.current = null;
    };
  }, [cancelTransition, clearTimers, onComplete, pillar, router]);

  if (!pillar) return null;

  const beginSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    touchOriginRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const endSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const origin = touchOriginRef.current;
    touchOriginRef.current = null;
    if (!origin || origin.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - origin.x;
    const deltaY = event.clientY - origin.y;
    if (
      deltaX >= SWIPE_CANCEL_THRESHOLD_PX
      && deltaX > Math.abs(deltaY) * 1.2
    ) {
      cancelTransition();
    }
  };

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-pillar={pillar}
      data-cancelling={cancelling ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pillar-transition-announcement"
      tabIndex={-1}
      onPointerDown={beginSwipe}
      onPointerUp={endSwipe}
      onPointerCancel={() => {
        touchOriginRef.current = null;
      }}
    >
      <TransitionScene pillar={pillar} />
      <p
        id="pillar-transition-announcement"
        className={styles.srOnly}
        aria-live="assertive"
      >
        Entering {names[pillar]}. Press Escape or swipe right to cancel.
      </p>
    </div>
  );
}

export default PillarTransition;
