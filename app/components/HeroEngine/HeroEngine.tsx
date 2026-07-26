"use client";

import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useState,
  type CSSProperties,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { useDeviceCapability } from "./hooks/useDeviceCapability";
import { useHeroConfig } from "./useHeroConfig";
import {
  COMMAND_PILLAR_COLORS,
  type ActivePillar,
} from "./config";
import { WholeEarthGlobe } from "../WholeEarthGlobe";
import styles from "./HeroEngine.module.css";

const WaterCanvas = lazy(() => import("./WaterCanvas"));
const CosmicCanvas = lazy(() => import("./CosmicCanvas"));

export type HeroBackgroundVariant = "water" | "cosmic";

type HeroEngineProps = {
  siteSlug: string;
  children: ReactNode;
  ariaLabel: string;
  autoRotate?: boolean;
  activePillar?: ActivePillar;
  transitioning?: boolean;
  showWholeEarthGlobe?: boolean;
  onWholeActivate?: () => void;
  backgroundVariant?: HeroBackgroundVariant;
};

type HeroStyle = CSSProperties & {
  "--hero-base": string;
  "--hero-primary": string;
  "--hero-secondary": string;
  "--hero-surface": string;
  "--hero-headline-delay": string;
  "--hero-focus-color": string;
  "--hero-focus-strength": string;
};

class CanvasBoundary extends Component<{
  children: ReactNode;
  onError: () => void;
}, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Hero background renderer failed", error, info.componentStack);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroEngine({
  siteSlug,
  children,
  ariaLabel,
  autoRotate = false,
  activePillar = "none",
  transitioning = false,
  showWholeEarthGlobe = false,
  onWholeActivate,
  backgroundVariant = "water",
}: HeroEngineProps) {
  const { config, loading: configLoading, source, version } = useHeroConfig(siteSlug);
  const capability = useDeviceCapability();
  const [canvasReady, setCanvasReady] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const onCanvasReady = useCallback(() => setCanvasReady(true), []);
  const onCanvasError = useCallback(() => setDegraded(true), []);
  const requestedPixelRatio = config.resolutionQuality === "low"
    ? 1
    : config.resolutionQuality === "medium"
      ? Math.min(capability.pixelRatio, 1.25)
      : capability.pixelRatio;
  const renderedPixelRatio =
    backgroundVariant === "cosmic" && capability.tier === "medium"
      ? Math.max(0.75, requestedPixelRatio * 0.75)
      : requestedPixelRatio;
  const shouldRender = capability.checked
    && capability.webgl2
    && !capability.reducedMotion
    && !capability.reducedData
    && capability.tier !== "low"
    && !degraded
    && config.isActive;
  const ready = capability.checked && (!shouldRender || canvasReady);
  const focusColor = activePillar === "none"
    ? config.colorPrimary
    : COMMAND_PILLAR_COLORS[activePillar];
  const focusStrength = activePillar === "none"
    ? "0"
    : activePillar === "whole"
      ? "0.18"
      : "1";
  const heroStyle: HeroStyle = {
    "--hero-base": config.colorBase,
    "--hero-primary": config.colorPrimary,
    "--hero-secondary": config.colorSecondary ?? config.colorBase,
    "--hero-surface": config.colorSurface,
    "--hero-headline-delay": `${config.headlineDelayMs}ms`,
    "--hero-focus-color": focusColor,
    "--hero-focus-strength": focusStrength,
    backgroundColor: config.colorBase,
  };

  return (
    <section
      className={`hero water-hero ${ready ? "water-hero--ready" : ""}`}
      style={heroStyle}
      aria-label={ariaLabel}
      data-config-source={source}
      data-config-version={version}
      data-active-pillar={activePillar}
      data-transitioning={transitioning ? "true" : "false"}
      data-background-variant={backgroundVariant}
    >
      <div className={`${styles.stage} ${ready ? styles.ready : ""}`} aria-hidden="true">
        <div
          className={`${styles.fallback} ${
            backgroundVariant === "cosmic" ? styles.cosmicFallback : ""
          }`}
        />
        {shouldRender && (
          <CanvasBoundary onError={onCanvasError}>
            <Suspense fallback={null}>
              <div className={styles.canvas}>
                {backgroundVariant === "cosmic" ? (
                  <CosmicCanvas
                    pixelRatio={renderedPixelRatio}
                    tier={capability.tier}
                    onReady={onCanvasReady}
                  />
                ) : (
                  <WaterCanvas
                    config={config}
                    pixelRatio={renderedPixelRatio}
                    tier={capability.tier}
                    autoRotate={autoRotate}
                    activePillar={activePillar}
                    onReady={onCanvasReady}
                  />
                )}
              </div>
            </Suspense>
          </CanvasBoundary>
        )}
        {showWholeEarthGlobe && onWholeActivate ? (
          <WholeEarthGlobe
            activePillar={activePillar}
            transitioning={transitioning}
            onActivate={onWholeActivate}
          />
        ) : null}
        <div className={styles.depth} />
        <div className={styles.surfaceLight} />
        {!ready && (
          <div className={styles.loading}>
            CALIBRATING {backgroundVariant === "cosmic" ? "COSMOS" : "WATER"}
          </div>
        )}
        <div className={styles.telemetry}>
          {backgroundVariant === "cosmic" ? "COSMOS" : "FLUID"} / {config.resolutionQuality.toUpperCase()}<br />
          CONFIG / {configLoading ? "SYNC" : source.toUpperCase()}
        </div>
      </div>
      {children}
    </section>
  );
}
