export type WebGLQualityTier = "gold" | "silver" | "bronze";

export interface WebGLTierConfig {
  /** Clamp passed to the owning react-three-fiber Canvas. */
  dpr: readonly [minimum: number, maximum: number];
  /** Fixed upper-bounded ray samples used by the fragment shader. */
  raySteps: number;
  /** Enables the final small-scale noise octave. */
  detail: number;
  /** Relative speed of the autonomous field. */
  motionScale: number;
  /** Compatibility value for the original build specification. */
  nominalResolution: 128 | 256 | 512;
}

export interface DeviceCapability {
  tier: WebGLQualityTier;
  deviceMemoryGB?: number;
  hardwareConcurrency?: number;
  mobile: boolean;
  reducedMotion: boolean;
  webgl: boolean;
}

export const WEBGL_TIER_CONFIG: Readonly<Record<WebGLQualityTier, WebGLTierConfig>> = {
  gold: {
    dpr: [1, 1.6],
    raySteps: 24,
    detail: 1,
    motionScale: 1,
    nominalResolution: 512,
  },
  silver: {
    dpr: [0.85, 1.25],
    raySteps: 18,
    detail: 0.55,
    motionScale: 0.9,
    nominalResolution: 256,
  },
  bronze: {
    dpr: [0.7, 1],
    raySteps: 12,
    detail: 0,
    motionScale: 0.72,
    nominalResolution: 128,
  },
};

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

function hasWebGL(): boolean {
  if (typeof document === "undefined") return true;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function detectDeviceCapability(): DeviceCapability {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      tier: "silver",
      mobile: false,
      reducedMotion: false,
      webgl: true,
    };
  }

  const browserNavigator = navigator as NavigatorWithMemory;
  const memory = browserNavigator.deviceMemory;
  const cores = browserNavigator.hardwareConcurrency;
  const mobile = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const webgl = hasWebGL();

  let tier: WebGLQualityTier = "gold";
  if (mobile || (memory !== undefined && memory <= 4) || (cores !== undefined && cores <= 4)) {
    tier = "silver";
  }
  if (
    !webgl ||
    (memory !== undefined && memory <= 2) ||
    (cores !== undefined && cores <= 2)
  ) {
    tier = "bronze";
  }

  return {
    tier,
    deviceMemoryGB: memory,
    hardwareConcurrency: cores,
    mobile,
    reducedMotion,
    webgl,
  };
}

export function qualityFromResolution(resolution?: number): WebGLQualityTier {
  if (resolution === undefined || !Number.isFinite(resolution)) return "gold";
  if (resolution <= 160) return "bronze";
  if (resolution <= 384) return "silver";
  return "gold";
}

export function getNextLowerTier(
  tier: WebGLQualityTier,
): WebGLQualityTier | null {
  if (tier === "gold") return "silver";
  if (tier === "silver") return "bronze";
  return null;
}

export function getAdaptiveDpr(
  tier: WebGLQualityTier,
  devicePixelRatio =
    typeof window === "undefined" ? 1 : window.devicePixelRatio || 1,
): number {
  const [minimum, maximum] = WEBGL_TIER_CONFIG[tier].dpr;
  return Math.min(maximum, Math.max(minimum, devicePixelRatio));
}
