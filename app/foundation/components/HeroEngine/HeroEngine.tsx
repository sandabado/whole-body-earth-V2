"use client";

import { Component, Suspense, lazy, useCallback, useEffect, useState, type CSSProperties, type ErrorInfo, type ReactNode } from "react";
import { FOUNDATION_HERO_CONFIG } from "./config";
import styles from "./HeroEngine.module.css";

const EarthCanvas = lazy(() => import("./EarthCanvas"));
type Tier = "low" | "medium" | "high";

class CanvasBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Foundation Earth renderer failed", error, info.componentStack);
    this.props.onError();
  }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function FoundationHeroEngine({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) {
  const config = FOUNDATION_HERO_CONFIG;
  const [capability, setCapability] = useState({ checked: false, webgl2: false, reducedMotion: false, reducedData: false, tier: "low" as Tier, pixelRatio: 1 });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const hints = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
      const memory = hints.deviceMemory ?? 4;
      const cores = navigator.hardwareConcurrency ?? 4;
      const tier: Tier = memory <= 2 || cores <= 2 ? "low" : memory < 6 || cores < 6 || innerWidth < 760 ? "medium" : "high";
      setCapability({
        checked: true,
        webgl2: Boolean(document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true })),
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        reducedData: hints.connection?.saveData === true,
        tier,
        pixelRatio: tier === "high" ? Math.min(devicePixelRatio || 1, 1.6) : tier === "medium" ? Math.min(devicePixelRatio || 1, 1.2) : 1,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const shouldRender = capability.checked && capability.webgl2 && !capability.reducedMotion
    && !capability.reducedData && capability.tier !== "low" && !failed && config.isActive;
  const stageReady = capability.checked && (!shouldRender || ready);
  const onReady = useCallback(() => setReady(true), []);
  const style = {
    "--earth-base": config.colorBase,
    "--earth-root": config.colorPrimary,
    backgroundColor: config.colorBase,
  } as CSSProperties;

  return <section className="foundation-earth-hero" style={style} aria-label={ariaLabel}>
    <div className={`${styles.stage} ${stageReady ? styles.ready : ""}`} aria-hidden="true">
      <div className={styles.fallback} />
      {shouldRender && <CanvasBoundary onError={() => setFailed(true)}><Suspense fallback={null}>
        <div className={styles.canvas}><EarthCanvas config={config} pixelRatio={capability.pixelRatio} tier={capability.tier as "medium" | "high"} onReady={onReady} /></div>
      </Suspense></CanvasBoundary>}
      <div className={styles.atmosphere} />
      {!stageReady && <div className={styles.loading}>CALIBRATING EARTH</div>}
      <div className={styles.telemetry}>TERRAIN / {config.resolutionQuality.toUpperCase()}<br />DRIFT / 0.0002</div>
    </div>
    {children}
  </section>;
}
