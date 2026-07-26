"use client";

import { lazy, Suspense } from "react";
import { getDefaultHeroConfig } from "../HeroEngine/config";
import { useDeviceCapability } from "../HeroEngine/hooks/useDeviceCapability";
import styles from "../home/TransitionOverlay.module.css";

const WaterCanvas = lazy(() => import("../HeroEngine/WaterCanvas"));
const waterConfig = getDefaultHeroConfig("studios");

export function WaterTransition() {
  const capability = useDeviceCapability();
  const useShader = capability.checked
    && capability.webgl2
    && capability.tier !== "low"
    && !capability.reducedMotion
    && !capability.reducedData;

  return (
    <div className={`${styles.scene} ${styles.water}`} aria-hidden="true">
      {useShader ? (
        <div className={styles.waterCanvas}>
          <Suspense fallback={<div className={styles.waterFallback} />}>
            <WaterCanvas
              config={waterConfig}
              pixelRatio={capability.pixelRatio}
              tier={capability.tier}
              autoRotate
              activePillar="studios"
              onReady={() => undefined}
            />
          </Suspense>
        </div>
      ) : (
        <div className={styles.waterFallback} />
      )}
      <div className={styles.surfaceRipple} />
      <div className={`${styles.solid} ${styles.icosahedron}`} />
      <div className={styles.ritualCopy}>
        <p className={styles.ritualKicker}>The Flow · Studios</p>
        <p className={styles.ritualTitle}>Entering the Water Pillar</p>
      </div>
    </div>
  );
}

export default WaterTransition;
