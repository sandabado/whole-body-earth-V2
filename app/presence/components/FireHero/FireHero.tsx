"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import type { FramePerformanceSample } from "../../lib/webgl/performanceMonitor";
import type { WebGLQualityTier } from "../../lib/webgl/degradationChecker";
import { AmbienceToggle } from "./controls/AmbienceToggle";
import { LoadingFallback } from "./controls/LoadingFallback";
import { useDeviceMemory } from "./hooks/useDeviceMemory";
import {
  usePointerInfluence,
  type PointerInfluenceRef,
} from "./hooks/usePointerInfluence";
import {
  useScrollSpeed,
  type ScrollInfluenceRef,
} from "./hooks/useScrollSpeed";
import styles from "./FireHero.module.css";

type HeroStatus = "loading" | "ready" | "fallback" | "error";

interface RibbonSystemProps {
  pointerRef?: PointerInfluenceRef;
  scrollRef?: ScrollInfluenceRef;
  quality?: WebGLQualityTier;
  resolution?: 128 | 256 | 512;
  reducedMotion?: boolean;
  paused?: boolean;
  targetFps?: number;
  onReady?: () => void;
  onError?: (error?: unknown) => void;
  onPerformanceSample?: (sample: FramePerformanceSample) => void;
  onDegradeRequest?: (
    nextTier: WebGLQualityTier,
    sample: FramePerformanceSample,
  ) => void;
}

const QUALITY_ORDER: readonly WebGLQualityTier[] = [
  "bronze",
  "silver",
  "gold",
];

function lowerQuality(
  deviceTier: WebGLQualityTier,
  degradedTier: WebGLQualityTier | null,
) {
  if (!degradedTier) return deviceTier;
  return QUALITY_ORDER.indexOf(degradedTier) < QUALITY_ORDER.indexOf(deviceTier)
    ? degradedTier
    : deviceTier;
}

export function FireHero() {
  const heroRef = useRef<HTMLElement>(null);
  const capability = useDeviceMemory();
  const pointerRef = usePointerInfluence({
    targetRef: heroRef,
    damping: 7,
    idleTimeout: 1_100,
    strength: 0.72,
  });
  const scrollRef = useScrollSpeed({
    damping: 10,
    decay: 4.5,
    sensitivity: 0.82,
  });
  const [RibbonSystem, setRibbonSystem] =
    useState<ComponentType<RibbonSystemProps> | null>(null);
  const [rendererStatus, setRendererStatus] =
    useState<Exclude<HeroStatus, "fallback">>("loading");
  const [renderAttempt, setRenderAttempt] = useState(0);
  const [degradedTier, setDegradedTier] =
    useState<WebGLQualityTier | null>(null);
  const [paused, setPaused] = useState(false);

  const canRenderWebGL =
    capability.webgl &&
    !capability.reducedMotion &&
    !capability.reducedData &&
    capability.tier !== "fallback";
  const deviceTier: WebGLQualityTier =
    capability.tier === "fallback" ? "bronze" : capability.tier;
  const quality = lowerQuality(deviceTier, degradedTier);
  const status: HeroStatus = canRenderWebGL ? rendererStatus : "fallback";

  useEffect(() => {
    let active = true;

    if (!canRenderWebGL) return;

    void import("./RibbonSystem")
      .then(({ RibbonSystem: Scene }) => {
        if (active) {
          setRendererStatus("loading");
          setRibbonSystem(() => Scene);
        }
      })
      .catch(() => {
        if (active) {
          setRibbonSystem(null);
          setRendererStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [canRenderWebGL, renderAttempt]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !canRenderWebGL) return;

    let heroVisible = true;
    const update = () => setPaused(document.hidden || !heroVisible);
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry?.isIntersecting ?? true;
        update();
      },
      { threshold: 0.01 },
    );

    observer.observe(hero);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [canRenderWebGL]);

  useEffect(() => {
    if (!RibbonSystem || status !== "loading") return;
    const timeout = window.setTimeout(() => {
      setRibbonSystem(null);
      setRendererStatus("error");
    }, 8_000);
    return () => window.clearTimeout(timeout);
  }, [RibbonSystem, status]);

  const handleReady = useCallback(() => setRendererStatus("ready"), []);
  const handleError = useCallback(() => {
    setRibbonSystem(null);
    setRendererStatus("error");
  }, []);
  const handleRetry = useCallback(() => {
    if (!canRenderWebGL) return;
    setDegradedTier("bronze");
    setRibbonSystem(null);
    setRendererStatus("loading");
    setRenderAttempt((attempt) => attempt + 1);
  }, [canRenderWebGL]);
  const handleDegrade = useCallback((nextTier: WebGLQualityTier) => {
    setDegradedTier((current) => {
      if (!current) return nextTier;
      return QUALITY_ORDER.indexOf(nextTier) < QUALITY_ORDER.indexOf(current)
        ? nextTier
        : current;
    });
  }, []);

  const fallbackMode = status === "fallback" || status === "error";
  const fieldLabel =
    status === "ready"
      ? "Living fire · responsive"
      : status === "loading"
        ? "Kindling the field"
        : capability.reducedMotion
          ? "Fire held still"
          : "Fire study · static";

  return (
    <section
      ref={heroRef}
      className={`${styles.hero} ${status === "ready" ? styles.ready : ""} ${fallbackMode ? styles.fallbackMode : ""}`}
      aria-labelledby="presence-fire-hero-title"
      aria-describedby="presence-fire-hero-description"
    >
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.fallback} />
        <div className={styles.canvasSlot}>
          {canRenderWebGL && RibbonSystem ? (
            <RibbonSystem
              pointerRef={pointerRef}
              scrollRef={scrollRef}
              quality={quality}
              resolution={capability.resolution}
              reducedMotion={capability.reducedMotion}
              paused={paused}
              targetFps={capability.targetFps}
              onReady={handleReady}
              onError={handleError}
              onDegradeRequest={handleDegrade}
            />
          ) : null}
        </div>
      </div>

      <p className={styles.fieldStatus} aria-live="polite">
        {fieldLabel}
      </p>

      <AmbienceToggle className={styles.ambience} />

      {status !== "ready" ? (
        <LoadingFallback
          className={styles.loading}
          status={status === "loading" ? "loading" : status}
          onRetry={status === "error" ? handleRetry : undefined}
        />
      ) : null}

      <div className={styles.content}>
        <p className={styles.eyebrow}>
          Whole Body Presence · The Healing Portal
        </p>
        <h1 className={styles.title} id="presence-fire-hero-title">
          Where the fire meets the body.
        </h1>
        <p className={styles.lede} id="presence-fire-hero-description">
          Five energies. Twelve houses. One living fire. Begin with what your
          body is asking for and enter the work from there.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="#quincunx">
            Enter the Quincunx →
          </Link>
          <Link className={styles.secondary} href="#houses">
            Find your house →
          </Link>
        </div>
        <p className={styles.meta}>
          Invite-only beta December 2026 · Open access Q1 2027
        </p>
      </div>

      <p className={styles.gestureHint} aria-hidden="true">
        Move gently · the field listens
      </p>
      <a
        className={styles.scrollCue}
        href="#way-of-fire"
        aria-label="Continue to the Way of Fire"
      >
        <span>Enter the gathering</span>
        <b aria-hidden="true">↓</b>
      </a>
      <span className={styles.srOnly}>
        An abstract, interactive field of slow-moving ember ribbons fills the
        background.
      </span>
    </section>
  );
}

export default FireHero;
