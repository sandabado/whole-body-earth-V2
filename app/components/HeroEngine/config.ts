import fallbackSource from "./hero-configs.json";

export type HeroElement = "fire" | "water" | "earth" | "air" | "aether";
export type ResolutionQuality = "low" | "medium" | "high";

export interface HeroConfig {
  element: HeroElement;
  colorBase: string;
  colorPrimary: string;
  colorSecondary?: string;
  colorSurface: string;
  cameraDriftSpeed: number;
  cameraRotationDegrees: number;
  pointerInfluenceStrength: number;
  scrollAccelerationMultiplier: number;
  headlineDelayMs: number;
  introDurationMs: number;
  ambientFlareIntervalMs: number;
  resolutionQuality: ResolutionQuality;
  fluidDissipation: number;
  flowVelocityScale: number;
  curlNoiseAmplitude: number;
  audioEnabledByDefault: boolean;
  audioVolume: number;
  audioUrl?: string;
  isActive: boolean;
}

export type HeroConfigSource = "database" | "fallback";

export type HeroConfigResponse = {
  config: HeroConfig;
  siteSlug: string;
  source: HeroConfigSource;
  updatedAt: string | null;
  version: number;
};

export const DEFAULT_HERO_CONFIGS = fallbackSource.heroConfigs as Record<string, HeroConfig>;

export function getDefaultHeroConfig(siteSlug: string): HeroConfig {
  return DEFAULT_HERO_CONFIGS[siteSlug] ?? DEFAULT_HERO_CONFIGS.studios;
}

const hexPattern = /^#[0-9a-f]{6}$/i;

const numberInRange = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

const hexColor = (value: unknown, fallback: string) =>
  typeof value === "string" && hexPattern.test(value) ? value.toUpperCase() : fallback;

export function normalizeHeroConfig(input: unknown, fallback: HeroConfig): HeroConfig {
  const value = input && typeof input === "object" ? input as Partial<HeroConfig> : {};
  const element = ["fire", "water", "earth", "air", "aether"].includes(String(value.element))
    ? value.element as HeroElement
    : fallback.element;
  const resolutionQuality = ["low", "medium", "high"].includes(String(value.resolutionQuality))
    ? value.resolutionQuality as ResolutionQuality
    : fallback.resolutionQuality;

  return {
    element,
    colorBase: hexColor(value.colorBase, fallback.colorBase),
    colorPrimary: hexColor(value.colorPrimary, fallback.colorPrimary),
    colorSecondary: hexColor(value.colorSecondary, fallback.colorSecondary ?? fallback.colorBase),
    colorSurface: hexColor(value.colorSurface, fallback.colorSurface),
    cameraDriftSpeed: numberInRange(value.cameraDriftSpeed, fallback.cameraDriftSpeed, 0, 0.02),
    cameraRotationDegrees: numberInRange(value.cameraRotationDegrees, fallback.cameraRotationDegrees, 0, 12),
    pointerInfluenceStrength: numberInRange(value.pointerInfluenceStrength, fallback.pointerInfluenceStrength, 0, 0.2),
    scrollAccelerationMultiplier: numberInRange(value.scrollAccelerationMultiplier, fallback.scrollAccelerationMultiplier, 0, 4),
    headlineDelayMs: Math.round(numberInRange(value.headlineDelayMs, fallback.headlineDelayMs, 0, 12000)),
    introDurationMs: Math.round(numberInRange(value.introDurationMs, fallback.introDurationMs, 1000, 30000)),
    ambientFlareIntervalMs: Math.round(numberInRange(value.ambientFlareIntervalMs, fallback.ambientFlareIntervalMs, 5000, 120000)),
    resolutionQuality,
    fluidDissipation: numberInRange(value.fluidDissipation, fallback.fluidDissipation, 0.75, 1),
    flowVelocityScale: numberInRange(value.flowVelocityScale, fallback.flowVelocityScale, 0.02, 1.5),
    curlNoiseAmplitude: numberInRange(value.curlNoiseAmplitude, fallback.curlNoiseAmplitude, 0, 1.5),
    audioEnabledByDefault: value.audioEnabledByDefault === true,
    audioVolume: numberInRange(value.audioVolume, fallback.audioVolume, 0, 1),
    audioUrl: typeof value.audioUrl === "string" ? value.audioUrl.slice(0, 500) : fallback.audioUrl,
    isActive: value.isActive !== false,
  };
}
