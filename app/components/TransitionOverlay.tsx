"use client";

import {
  useEffect,
  useRef,
  type PointerEvent,
} from "react";
import type { ActivePillar } from "./HeroEngine/config";
import type { TransitionPhase, TransitionTarget } from "./WholeBodyTransition";
import AirTransition from "./transitions/AirTransition";
import EarthTransition from "./transitions/EarthTransition";
import EtherTransition from "./transitions/EtherTransition";
import FireTransition from "./transitions/FireTransition";
import ObservatoryTransition from "./transitions/ObservatoryTransition";
import WaterTransition from "./transitions/WaterTransition";
import styles from "./TransitionOverlay.module.css";

type TransitionOverlayProps = {
  activePillar: ActivePillar;
  phase: TransitionPhase;
  cancelling: boolean;
  reducedMotion: boolean;
  onCancel: () => void;
};

type TouchOrigin = {
  pointerId: number;
  x: number;
  y: number;
};

const SWIPE_CANCEL_THRESHOLD_PX = 72;

const names: Record<TransitionTarget, string> = {
  presence: "the Fire Pillar",
  press: "the Air Pillar",
  studios: "the Water Pillar",
  foundation: "the Earth Pillar",
  guardian: "the Ether Pillar",
  whole: "the Constellation",
};

function TransitionScene({ pillar }: { pillar: TransitionTarget }) {
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
    case "whole":
      return <ObservatoryTransition />;
  }
}

export function TransitionOverlay({
  activePillar,
  phase,
  cancelling,
  reducedMotion,
  onCancel,
}: TransitionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchOriginRef = useRef<TouchOrigin | null>(null);
  const phaseRef = useRef(phase);
  const cancellableRef = useRef(false);
  const pillar = activePillar === "none" ? null : activePillar;
  const cancellable = phase === "animating" || phase === "prefetching";

  useEffect(() => {
    phaseRef.current = phase;
    cancellableRef.current = cancellable;
  }, [cancellable, phase]);

  useEffect(() => {
    if (!pillar) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    overlayRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && cancellableRef.current) {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key === "Tab" && phaseRef.current !== "dissolving") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      const previousFocus = previousFocusRef.current;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      previousFocusRef.current = null;
    };
  }, [onCancel, pillar]);

  if (!pillar || phase === "idle" || phase === "done") return null;

  const beginSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (!cancellable || event.pointerType !== "touch") return;
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
    if (!cancellable || !origin || origin.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - origin.x;
    const deltaY = event.clientY - origin.y;
    if (
      deltaX >= SWIPE_CANCEL_THRESHOLD_PX
      && deltaX > Math.abs(deltaY) * 1.2
    ) {
      onCancel();
    }
  };

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-pillar={pillar}
      data-phase={phase}
      data-cancelling={cancelling ? "true" : "false"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      role="dialog"
      aria-modal={phase === "dissolving" ? undefined : "true"}
      aria-hidden={phase === "dissolving" ? true : undefined}
      aria-labelledby="whole-body-transition-announcement"
      tabIndex={-1}
      onPointerDown={beginSwipe}
      onPointerUp={endSwipe}
      onPointerCancel={() => {
        touchOriginRef.current = null;
      }}
    >
      <TransitionScene pillar={pillar} />
      <div className={styles.handoffStatus} aria-hidden="true">
        <i />
        <span>Entering…</span>
      </div>
      <p
        id="whole-body-transition-announcement"
        className={styles.srOnly}
        aria-live="assertive"
      >
        Entering {names[pillar]}.
        {cancellable ? " Press Escape or swipe right to cancel." : ""}
      </p>
    </div>
  );
}

export default TransitionOverlay;
