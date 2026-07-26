"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ActivePillar } from "./HeroEngine/config";
import { TransitionOverlay } from "./TransitionOverlay";

export type TransitionTarget = Exclude<ActivePillar, "none">;
export type TransitionPhase =
  | "idle"
  | "prefetching"
  | "animating"
  | "handoff"
  | "dissolving"
  | "done";

type TransitionContextValue = {
  activePillar: ActivePillar;
  phase: TransitionPhase;
  transitioning: boolean;
  beginTransition: (pillar: TransitionTarget) => void;
};

const TRANSITION_DURATION_MS = 1200;
const DISSOLVE_DURATION_MS = 300;
const REDUCED_DISSOLVE_DURATION_MS = 200;
const CANCEL_DURATION_MS = 220;

export const TRANSITION_ROUTES: Record<TransitionTarget, string> = {
  presence: "/presence",
  press: "/press",
  studios: "/studios",
  foundation: "/foundation",
  guardian: "/guardian",
  whole: "/calendar",
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function WholeBodyTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activePillar, setActivePillar] = useState<ActivePillar>("none");
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [cancelling, setCancelling] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const phaseRef = useRef<TransitionPhase>("idle");
  const activeRef = useRef<ActivePillar>("none");
  const navigationTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const frameRefs = useRef<number[]>([]);

  const setCurrentPhase = useCallback((nextPhase: TransitionPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const clearScheduledWork = useCallback(() => {
    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    for (const frame of frameRefs.current) window.cancelAnimationFrame(frame);
    frameRefs.current = [];
  }, []);

  const resetTransition = useCallback(() => {
    clearScheduledWork();
    activeRef.current = "none";
    setActivePillar("none");
    setCancelling(false);
    setReducedMotion(false);
    setCurrentPhase("done");
    const frame = window.requestAnimationFrame(() => setCurrentPhase("idle"));
    frameRefs.current.push(frame);
  }, [clearScheduledWork, setCurrentPhase]);

  const beginTransition = useCallback((pillar: TransitionTarget) => {
    if (phaseRef.current !== "idle") return;

    const route = TRANSITION_ROUTES[pillar];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    clearScheduledWork();
    activeRef.current = pillar;
    setActivePillar(pillar);
    setCancelling(false);
    setReducedMotion(prefersReducedMotion);
    setCurrentPhase("prefetching");
    router.prefetch(route);

    if (prefersReducedMotion) {
      setCurrentPhase("handoff");
      router.push(route);
      return;
    }

    setCurrentPhase("animating");
    navigationTimerRef.current = window.setTimeout(() => {
      navigationTimerRef.current = null;
      setCurrentPhase("handoff");
      router.push(route);
    }, TRANSITION_DURATION_MS);
  }, [clearScheduledWork, router, setCurrentPhase]);

  const cancelTransition = useCallback(() => {
    if (
      cancelling
      || (phaseRef.current !== "animating" && phaseRef.current !== "prefetching")
    ) {
      return;
    }

    clearScheduledWork();
    setCancelling(true);
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null;
      resetTransition();
    }, CANCEL_DURATION_MS);
  }, [cancelling, clearScheduledWork, resetTransition]);

  useEffect(() => {
    const pillar = activeRef.current;
    if (phase !== "handoff" || pillar === "none") return;
    if (pathname !== TRANSITION_ROUTES[pillar]) return;

    const firstFrame = window.requestAnimationFrame(() => {
      const secondFrame = window.requestAnimationFrame(() => {
        setCurrentPhase("dissolving");
        settleTimerRef.current = window.setTimeout(
          resetTransition,
          reducedMotion ? REDUCED_DISSOLVE_DURATION_MS : DISSOLVE_DURATION_MS,
        );
      });
      frameRefs.current.push(secondFrame);
    });
    frameRefs.current.push(firstFrame);

    return () => {
      window.cancelAnimationFrame(firstFrame);
    };
  }, [pathname, phase, reducedMotion, resetTransition, setCurrentPhase]);

  useEffect(() => clearScheduledWork, [clearScheduledWork]);

  const value = useMemo<TransitionContextValue>(() => ({
    activePillar,
    phase,
    transitioning: phase !== "idle" && phase !== "done",
    beginTransition,
  }), [activePillar, beginTransition, phase]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <TransitionOverlay
        activePillar={activePillar}
        phase={phase}
        cancelling={cancelling}
        reducedMotion={reducedMotion}
        onCancel={cancelTransition}
      />
    </TransitionContext.Provider>
  );
}

export function useWholeBodyTransition(): TransitionContextValue {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "useWholeBodyTransition must be used inside WholeBodyTransitionProvider",
    );
  }
  return context;
}

