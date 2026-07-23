"use client";

import {
  Component,
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useState,
  type CSSProperties,
  type ErrorInfo,
  type ReactNode,
} from "react";
import type { HeroConfig } from "./config";
import { useDeviceCapability } from "./hooks/useDeviceCapability";
import { useHeroConfig } from "./useHeroConfig";
import styles from "./HeroEngine.module.css";

const AirCanvas = lazy(() => import("./AirCanvas"));
const HeroConfigContext = createContext<HeroConfig | null>(null);

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
    console.error("Air hero renderer failed", error, info.componentStack);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function useHeroEngineConfig() {
  const config = useContext(HeroConfigContext);
  if (!config) throw new Error("useHeroEngineConfig must be used within HeroEngine");
  return config;
}

export default function HeroEngine({ siteSlug, children, ariaLabel }: HeroEngineProps) {
  const { config, loading: configLoading, source, version } = useHeroConfig(siteSlug);
  const capability = useDeviceCapability();
  const [canvasReady, setCanvasReady] = useState(false);
  const [degraded, setDegraded] = useState(false);
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
    backgroundColor: config.colorBase,
  };
  const onCanvasReady = useCallback(() => setCanvasReady(true), []);
  const onCanvasError = useCallback(() => setDegraded(true), []);

  return (
    <HeroConfigContext.Provider value={config}>
      <section
        className={`press-hero air-hero ${ready ? "air-hero--ready" : ""}`}
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
                  <AirCanvas
                    config={config}
                    pixelRatio={requestedPixelRatio}
                    tier={capability.tier}
                    onReady={onCanvasReady}
                  />
                </div>
              </Suspense>
            </CanvasBoundary>
          )}
          <div className={styles.atmosphere} />
          <div className={styles.lightVault} />
          {!ready && <div className={styles.loading}>CALIBRATING AIR</div>}
          <div className={styles.telemetry}>
            PARTICULATE / {config.resolutionQuality.toUpperCase()}<br />
            CONFIG / {configLoading ? "SYNC" : source.toUpperCase()}
          </div>
        </div>
        {children}
      </section>
    </HeroConfigContext.Provider>
  );
}
