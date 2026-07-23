export type FoundationHeroConfig = {
  colorBase: string;
  colorPrimary: string;
  colorSecondary: string;
  colorSurface: string;
  cameraDriftSpeed: number;
  ambientFlareIntervalMs: number;
  resolutionQuality: "low" | "medium" | "high";
  fluidDissipation: number;
  flowVelocityScale: number;
  isActive: boolean;
};

export const FOUNDATION_HERO_CONFIG: FoundationHeroConfig = {
  colorBase: "#080A08",
  colorPrimary: "#22C55E",
  colorSecondary: "#3A3A3A",
  colorSurface: "#EDEDED",
  cameraDriftSpeed: 0.00006,
  ambientFlareIntervalMs: 90_000,
  resolutionQuality: "high",
  fluidDissipation: 0.99,
  flowVelocityScale: 0.028,
  isActive: true,
};
