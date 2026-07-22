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
import styles from "./HeroEngine.module.css";

const WaterCanvas = lazy(() => import("./WaterCanvas"));

type HeroEngineProps = {
  siteSlug: string;
  children: ReactNode;
  ariaLabel: string;
};

type HeroStyle = CSSProperties & {
  "--hero-base": string;
  "--hero-primary": string;
  "--hero-secondary": string;
  "--hero-surface": string;
  "--hero-headline-delay": string;
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
    console.error("Water hero renderer failed", error, info.componentStack);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroEngine({ siteSlug, children, ariaLabel }: HeroEngineProps) {
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
  const shouldRender = capability.checked
    && capability.webgl2
    && !capability.reducedMotion
    && !capability.reducedData
    && capability.tier !== "low"
    && !degraded
    && config.isActive;
  const ready = capability.checked && (!shouldRender || canvasReady);
  const heroStyle: HeroStyle = {
    "--hero-base": config.colorBase,
    "--hero-primary": config.colorPrimary,
    "--hero-secondary": config.colorSecondary ?? config.colorBase,
    "--hero-surface": config.colorSurface,
    "--hero-headline-delay": `${config.headlineDelayMs}ms`,
    backgroundColor: config.colorBase,
  };

  return (
    <section
      className={`hero water-hero ${ready ? "water-hero--ready" : ""}`}
      style={heroStyle}
      aria-label={ariaLabel}
      data-config-source={source}
      data-config-version={version}
    >
      <div className={`${styles.stage} ${ready ? styles.ready : ""}`} aria-hidden="true">
        <div className={styles.fallback} />
        {shouldRender && (
          <CanvasBoundary onError={onCanvasError}>
            <Suspense fallback={null}>
              <div className={styles.canvas}>
                <WaterCanvas
                  config={config}
                  pixelRatio={requestedPixelRatio}
                  tier={capability.tier}
                  onReady={onCanvasReady}
                />
              </div>
            </Suspense>
          </CanvasBoundary>
        )}
        <div className={styles.depth} />
        <div className={styles.surfaceLight} />
        {!ready && <div className={styles.loading}>CALIBRATING WATER</div>}
        <div className={styles.telemetry}>
          FLUID / {config.resolutionQuality.toUpperCase()}<br />
          CONFIG / {configLoading ? "SYNC" : source.toUpperCase()}
        </div>
      </div>
      {children}
    </section>
  );
}
