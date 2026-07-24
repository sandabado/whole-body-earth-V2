"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "gold" | "silver" | "bronze" | "fallback";

export interface DeviceCapability {
  tier: DeviceTier;
  resolution: 128 | 256 | 512;
  dpr: number;
  targetFps: 0 | 30 | 45 | 60;
  /** Number of animation frames that may be skipped between renders. */
  frameSkip: number;
  reducedMotion: boolean;
  reducedData: boolean;
  webgl: boolean;
}

interface NetworkInformationLike extends EventTarget {
  effectiveType?: string;
  saveData?: boolean;
}

type NavigatorWithCapabilities = Navigator & {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
};

const SERVER_CAPABILITY: DeviceCapability = {
  // Capability is deliberately unresolved during SSR. This prevents a Canvas
  // from being created before reduced-motion and WebGL support are known.
  tier: "fallback",
  resolution: 128,
  dpr: 1,
  targetFps: 0,
  frameSkip: 0,
  reducedMotion: false,
  reducedData: false,
  webgl: false,
};

function isSameCapability(a: DeviceCapability, b: DeviceCapability) {
  return (
    a.tier === b.tier &&
    a.resolution === b.resolution &&
    a.dpr === b.dpr &&
    a.targetFps === b.targetFps &&
    a.frameSkip === b.frameSkip &&
    a.reducedMotion === b.reducedMotion &&
    a.reducedData === b.reducedData &&
    a.webgl === b.webgl
  );
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    // Three r185's renderer requires WebGL2. WebGL1-only visitors receive the
    // authored still fallback instead of paying for a renderer that cannot run.
    const context = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
    });

    if (!context) return false;

    // This probe should not keep an additional GPU context alive.
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function readCapability(webgl: boolean): DeviceCapability {
  const nav = navigator as NavigatorWithCapabilities;
  const connection =
    nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const mediaReducedData = window.matchMedia(
    "(prefers-reduced-data: reduce)",
  ).matches;
  const constrainedConnection = ["slow-2g", "2g"].includes(
    connection?.effectiveType ?? "",
  );
  const reducedData = Boolean(
    mediaReducedData || connection?.saveData || constrainedConnection,
  );

  if (!webgl || reducedMotion) {
    return {
      tier: "fallback",
      resolution: 128,
      dpr: 1,
      targetFps: 0,
      frameSkip: 0,
      reducedMotion,
      reducedData,
      webgl,
    };
  }

  // deviceMemory is reported in GiB and is intentionally rounded by browsers.
  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency || 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const compactViewport = window.innerWidth <= 820;

  let tier: Exclude<DeviceTier, "fallback"> = "silver";
  if (
    reducedData ||
    memory <= 2 ||
    cores <= 4 ||
    (coarsePointer && compactViewport)
  ) {
    tier = "bronze";
  } else if (memory >= 8 && cores >= 8) {
    tier = "gold";
  }

  const deviceDpr = Math.max(1, window.devicePixelRatio || 1);

  if (tier === "gold") {
    return {
      tier,
      resolution: 512,
      dpr: Math.min(deviceDpr, 1.5),
      targetFps: 60,
      frameSkip: 0,
      reducedMotion,
      reducedData,
      webgl,
    };
  }

  if (tier === "silver") {
    return {
      tier,
      resolution: 256,
      dpr: Math.min(deviceDpr, 1.25),
      targetFps: 45,
      frameSkip: 0,
      reducedMotion,
      reducedData,
      webgl,
    };
  }

  return {
    tier,
    resolution: 128,
    dpr: 1,
    targetFps: 30,
    frameSkip: 1,
    reducedMotion,
    reducedData,
    webgl,
  };
}

/**
 * Returns a conservative, reactive rendering profile for the current device.
 * The server snapshot intentionally starts in fallback mode to keep SSR
 * deterministic and avoid constructing WebGL before preferences are known.
 */
export function useDeviceMemory(): DeviceCapability {
  const [capability, setCapability] =
    useState<DeviceCapability>(SERVER_CAPABILITY);

  useEffect(() => {
    const webgl = supportsWebGL();
    const nav = navigator as NavigatorWithCapabilities;
    const connection =
      nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dataQuery = window.matchMedia("(prefers-reduced-data: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    let resizeTimer = 0;

    const update = () => {
      const next = readCapability(webgl);
      setCapability((current) =>
        isSameCapability(current, next) ? current : next,
      );
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(update, 100);
    };

    update();
    motionQuery.addEventListener("change", update);
    dataQuery.addEventListener("change", update);
    pointerQuery.addEventListener("change", update);
    connection?.addEventListener("change", update);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.clearTimeout(resizeTimer);
      motionQuery.removeEventListener("change", update);
      dataQuery.removeEventListener("change", update);
      pointerQuery.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return capability;
}

export default useDeviceMemory;
