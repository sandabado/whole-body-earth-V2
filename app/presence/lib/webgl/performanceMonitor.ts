import {
  getNextLowerTier,
  type WebGLQualityTier,
} from "./degradationChecker";

export interface FramePerformanceSample {
  fps: number;
  averageFrameMs: number;
  slowFrameRatio: number;
  frames: number;
  elapsedMs: number;
}

export interface PerformanceMonitorOptions {
  sampleWindowMs?: number;
  warmupMs?: number;
  slowFrameMs?: number;
  minimumFps?: number;
  consecutiveSlowWindows?: number;
}

export interface PerformanceMonitorResult {
  sample: FramePerformanceSample;
  sustainedPressure: boolean;
}

const DEFAULT_OPTIONS: Required<PerformanceMonitorOptions> = {
  sampleWindowMs: 1_500,
  warmupMs: 3_000,
  slowFrameMs: 34,
  minimumFps: 31,
  consecutiveSlowWindows: 2,
};

/**
 * Passive frame sampler. The render loop owns scheduling, so this never leaves
 * an orphaned requestAnimationFrame running after the canvas unmounts.
 */
export class WebGLPerformanceMonitor {
  private readonly options: Required<PerformanceMonitorOptions>;
  private totalElapsedMs = 0;
  private windowElapsedMs = 0;
  private frameCount = 0;
  private slowFrameCount = 0;
  private slowWindowCount = 0;

  constructor(options: PerformanceMonitorOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  sample(deltaSeconds: number): PerformanceMonitorResult | null {
    const frameMs = Math.min(Math.max(deltaSeconds * 1_000, 0), 250);
    this.totalElapsedMs += frameMs;
    this.windowElapsedMs += frameMs;
    this.frameCount += 1;
    if (frameMs >= this.options.slowFrameMs) this.slowFrameCount += 1;

    if (this.windowElapsedMs < this.options.sampleWindowMs) return null;

    const sample: FramePerformanceSample = {
      fps:
        this.windowElapsedMs > 0
          ? (this.frameCount * 1_000) / this.windowElapsedMs
          : 60,
      averageFrameMs:
        this.frameCount > 0 ? this.windowElapsedMs / this.frameCount : 0,
      slowFrameRatio:
        this.frameCount > 0 ? this.slowFrameCount / this.frameCount : 0,
      frames: this.frameCount,
      elapsedMs: this.totalElapsedMs,
    };

    const underPressure =
      sample.fps < this.options.minimumFps || sample.slowFrameRatio > 0.35;

    if (this.totalElapsedMs >= this.options.warmupMs) {
      this.slowWindowCount = underPressure ? this.slowWindowCount + 1 : 0;
    }

    const result = {
      sample,
      sustainedPressure:
        this.slowWindowCount >= this.options.consecutiveSlowWindows,
    };

    this.windowElapsedMs = 0;
    this.frameCount = 0;
    this.slowFrameCount = 0;
    return result;
  }

  reset(): void {
    this.totalElapsedMs = 0;
    this.windowElapsedMs = 0;
    this.frameCount = 0;
    this.slowFrameCount = 0;
    this.slowWindowCount = 0;
  }
}

export function recommendedDegradation(
  tier: WebGLQualityTier,
  result: PerformanceMonitorResult,
): WebGLQualityTier | null {
  return result.sustainedPressure ? getNextLowerTier(tier) : null;
}
