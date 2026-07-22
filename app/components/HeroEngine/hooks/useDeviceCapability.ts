"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "low" | "medium" | "high";

export type DeviceCapability = {
  checked: boolean;
  webgl2: boolean;
  reducedMotion: boolean;
  reducedData: boolean;
  tier: DeviceTier;
  pixelRatio: number;
};

const initialCapability: DeviceCapability = {
  checked: false,
  webgl2: false,
  reducedMotion: false,
  reducedData: false,
  tier: "low",
  pixelRatio: 1,
};

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState(initialCapability);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const navigatorWithHints = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const reducedData = navigatorWithHints.connection?.saveData === true;
      const canvas = document.createElement("canvas");
      const webgl2 = Boolean(canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }));
      const memory = navigatorWithHints.deviceMemory ?? 4;
      const cores = navigator.hardwareConcurrency ?? 4;
      const compact = window.innerWidth < 760;
      const tier: DeviceTier = memory <= 2 || cores <= 2
        ? "low"
        : memory < 6 || cores < 6 || compact
          ? "medium"
          : "high";
      const pixelRatio = tier === "high"
        ? Math.min(window.devicePixelRatio || 1, 1.75)
        : tier === "medium"
          ? Math.min(window.devicePixelRatio || 1, 1.25)
          : 1;

      setCapability({ checked: true, webgl2, reducedMotion, reducedData, tier, pixelRatio });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return capability;
}
