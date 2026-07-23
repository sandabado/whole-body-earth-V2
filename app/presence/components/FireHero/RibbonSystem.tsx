"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";
import {
  qualityFromResolution,
  getAdaptiveDpr,
  WEBGL_TIER_CONFIG,
  type WebGLQualityTier,
} from "@/app/presence/lib/webgl/degradationChecker";
import {
  recommendedDegradation,
  WebGLPerformanceMonitor,
  type FramePerformanceSample,
} from "@/app/presence/lib/webgl/performanceMonitor";
import compositingShader from "./shaders/compositing.glsl?raw";
import noiseShader from "./shaders/noise.glsl?raw";
import ribbonFragmentShader from "./shaders/ribbon.frag?raw";
import vertexShader from "./shaders/vertex.glsl?raw";

export interface RibbonPointerState {
  /** Centered normalized device coordinate, from -1 to 1. */
  x: number;
  /** Centered normalized device coordinate, from -1 to 1. */
  y: number;
  /** False while the pointer is outside the hero. */
  active?: boolean;
}

export interface RibbonScrollState {
  /** Normalized absolute scroll impulse, from 0 to 1. */
  speed: number;
  velocity?: number;
  direction?: -1 | 0 | 1;
}

export interface RibbonStateRef<T> {
  readonly current: T | null;
}

export interface RibbonSystemProps {
  pointerRef?: RibbonStateRef<RibbonPointerState>;
  scrollRef?: RibbonStateRef<RibbonScrollState>;
  /** Non-ref compatibility input. Prefer pointerRef to avoid React renders. */
  pointer?: RibbonPointerState;
  /** Non-ref compatibility input. Prefer scrollRef to avoid React renders. */
  scrollSpeed?: number;
  quality?: WebGLQualityTier;
  /** Maps the original 128/256/512 spec onto bronze/silver/gold. */
  resolution?: number;
  reducedMotion?: boolean;
  paused?: boolean;
  targetFps?: number;
  motionScale?: number;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onPerformanceSample?: (sample: FramePerformanceSample) => void;
  onDegradeRequest?: (
    nextTier: WebGLQualityTier,
    sample: FramePerformanceSample,
  ) => void;
}

interface FlareSchedule {
  index: number;
  centerSeconds: number;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function damp(current: number, target: number, lambda: number, delta: number): number {
  return THREE.MathUtils.lerp(
    current,
    target,
    1 - Math.exp(-lambda * delta),
  );
}

function smoothstep(minimum: number, maximum: number, value: number): number {
  const normalized = clamp((value - minimum) / (maximum - minimum), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

function deterministicUnit(index: number): number {
  const value = Math.sin((index + 1) * 12.9898 + 78.233) * 43_758.5453;
  return value - Math.floor(value);
}

function initialFlareSchedule(): FlareSchedule {
  return {
    index: 0,
    centerSeconds: 28 + deterministicUnit(0) * 4,
  };
}

/** Smooth, deterministic flare windows separated by 30 seconds, plus/minus 2.5. */
function sampleFlare(
  elapsedSeconds: number,
  schedule: FlareSchedule,
): number {
  while (elapsedSeconds > schedule.centerSeconds + 3.4) {
    schedule.index += 1;
    schedule.centerSeconds += 27.5 + deterministicUnit(schedule.index) * 5;
  }

  const phase = elapsedSeconds - schedule.centerSeconds;
  const rise = smoothstep(-1.8, 0.15, phase);
  const fall = 1 - smoothstep(0.15, 3.2, phase);
  return rise * fall;
}

const fragmentShader = ribbonFragmentShader
  .replace("/*__NOISE__*/", noiseShader)
  .replace("/*__COMPOSITING__*/", compositingShader);

function RibbonVolume({
  pointerRef,
  scrollRef,
  pointer,
  scrollSpeed = 0,
  quality,
  resolution,
  reducedMotion = false,
  paused = false,
  motionScale = 1,
  onReady,
  onError,
  onPerformanceSample,
  onDegradeRequest,
}: RibbonSystemProps) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const tier = quality ?? qualityFromResolution(resolution);
  const tierConfig = WEBGL_TIER_CONFIG[tier];
  const frozen = reducedMotion || paused;

  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const onPerformanceSampleRef = useRef(onPerformanceSample);
  const onDegradeRequestRef = useRef(onDegradeRequest);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        name: "PresenceMoltenRibbonMaterial",
        uniforms: {
          uTime: { value: 0 },
          uTravel: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uPointerPresence: { value: 0 },
          uScrollSpeed: { value: 0 },
          uWhiteHotFlare: { value: 0 },
          uRaySteps: { value: WEBGL_TIER_CONFIG.gold.raySteps },
          uDetail: { value: WEBGL_TIER_CONFIG.gold.detail },
          uMotionScale: { value: WEBGL_TIER_CONFIG.gold.motionScale },
        },
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
        transparent: false,
        blending: THREE.NormalBlending,
        toneMapped: false,
        precision: "highp",
      }),
    [],
  );
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const elapsedRef = useRef(reducedMotion ? 5.6 : 0);
  const travelRef = useRef(reducedMotion ? 0.55 : 0);
  const wallElapsedRef = useRef(0);
  const flareScheduleRef = useRef<FlareSchedule>(initialFlareSchedule());
  const performanceMonitorRef = useRef(new WebGLPerformanceMonitor());
  const requestedTierRef = useRef<WebGLQualityTier | null>(null);
  const observedRendererFrameRef = useRef<number | null>(null);
  const readyRef = useRef(false);
  const drawingBufferSizeRef = useRef(new THREE.Vector2());

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
    onPerformanceSampleRef.current = onPerformanceSample;
    onDegradeRequestRef.current = onDegradeRequest;
  }, [onDegradeRequest, onError, onPerformanceSample, onReady]);

  useEffect(() => {
    const shaderMaterial = materialRef.current;
    if (!shaderMaterial) return;
    const uniforms = shaderMaterial.uniforms;
    uniforms.uRaySteps.value = tierConfig.raySteps;
    uniforms.uDetail.value = tierConfig.detail;
    uniforms.uMotionScale.value = tierConfig.motionScale * motionScale;
    performanceMonitorRef.current.reset();
    requestedTierRef.current = null;
  }, [motionScale, tierConfig]);

  useEffect(() => {
    // Two invalidations also allow onReady to work when the parent Canvas uses
    // frameloop="demand" for a reduced-motion visitor.
    invalidate();
    const frame = window.requestAnimationFrame(() => invalidate());
    return () => window.cancelAnimationFrame(frame);
  }, [invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      readyRef.current = false;
      observedRendererFrameRef.current = null;
      onErrorRef.current?.(
        new Error("The Presence WebGL rendering context was lost."),
      );
    };
    const handleContextRestored = () => {
      performanceMonitorRef.current.reset();
      invalidate();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
      canvas.removeEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false,
      );
    };
  }, [gl, invalidate]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, frameDelta) => {
    const shaderMaterial = materialRef.current;
    if (!shaderMaterial) return;
    const uniforms = shaderMaterial.uniforms;
    const rendererFrame = state.gl.info.render.frame;
    if (observedRendererFrameRef.current === null) {
      observedRendererFrameRef.current = rendererFrame;
    } else if (
      !readyRef.current &&
      rendererFrame > observedRendererFrameRef.current
    ) {
      const programs = state.gl.info.programs as
        | Array<{ diagnostics?: { runnable?: boolean } }>
        | null;
      if (programs?.some((program) => program.diagnostics?.runnable === false)) {
        readyRef.current = true;
        onErrorRef.current?.(
          new Error("The Presence fire shader could not compile on this GPU."),
        );
        return;
      }
      readyRef.current = true;
      onReadyRef.current?.();
    }

    gl.getDrawingBufferSize(drawingBufferSizeRef.current);
    uniforms.uResolution.value.copy(drawingBufferSizeRef.current);

    const delta = Math.min(Math.max(frameDelta, 0), 0.05);
    const pointerState = pointerRef?.current ?? pointer;
    const pointerActive = pointerState?.active ?? Boolean(pointerState);
    const targetPointerX = pointerActive
      ? clamp(pointerState?.x ?? 0, -1, 1)
      : 0;
    const targetPointerY = pointerActive
      ? clamp(pointerState?.y ?? 0, -1, 1)
      : 0;
    uniforms.uPointer.value.set(
      damp(uniforms.uPointer.value.x, targetPointerX, 3.8, delta),
      damp(uniforms.uPointer.value.y, targetPointerY, 3.8, delta),
    );
    uniforms.uPointerPresence.value = damp(
      uniforms.uPointerPresence.value,
      frozen ? 0 : pointerActive ? 1 : 0,
      3.2,
      delta,
    );

    const targetScrollSpeed = clamp(
      scrollRef?.current?.speed ?? scrollSpeed,
      0,
      1,
    );
    uniforms.uScrollSpeed.value = damp(
      uniforms.uScrollSpeed.value,
      frozen ? 0 : targetScrollSpeed,
      targetScrollSpeed > uniforms.uScrollSpeed.value ? 7.5 : 2.4,
      delta,
    );

    if (!frozen) {
      const smoothedScroll = uniforms.uScrollSpeed.value;
      const effectiveMotion = tierConfig.motionScale * motionScale;
      elapsedRef.current += delta * (0.82 + smoothedScroll * 0.68) * effectiveMotion;
      travelRef.current += delta * (0.085 + smoothedScroll * 0.34) * effectiveMotion;
      wallElapsedRef.current += delta;

      uniforms.uTime.value = elapsedRef.current;
      uniforms.uTravel.value = travelRef.current;
      uniforms.uWhiteHotFlare.value = sampleFlare(
        wallElapsedRef.current,
        flareScheduleRef.current,
      );

      const performanceResult = performanceMonitorRef.current.sample(frameDelta);
      if (performanceResult) {
        onPerformanceSampleRef.current?.(performanceResult.sample);
        const nextTier = recommendedDegradation(tier, performanceResult);
        if (nextTier && requestedTierRef.current !== nextTier) {
          requestedTierRef.current = nextTier;
          onDegradeRequestRef.current?.(nextTier, performanceResult.sample);
        }
      }
    } else {
      uniforms.uWhiteHotFlare.value = 0;
    }
  });

  return (
    <mesh
      frustumCulled={false}
      renderOrder={-1_000}
      scale={[1, 1, 1]}
    >
      <planeGeometry args={[2, 2, 1, 1]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

function FrameScheduler({
  paused,
  targetFps,
}: {
  paused: boolean;
  targetFps: number;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (paused || targetFps <= 0) {
      invalidate();
      return;
    }

    const frameInterval = 1_000 / clamp(targetFps, 24, 60);
    let animationFrame = 0;
    let previousFrame = performance.now() - frameInterval;

    const schedule = (time: number) => {
      const elapsed = time - previousFrame;
      if (elapsed >= frameInterval - 1) {
        previousFrame = time - (elapsed % frameInterval);
        invalidate();
      }
      animationFrame = window.requestAnimationFrame(schedule);
    };

    animationFrame = window.requestAnimationFrame(schedule);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [invalidate, paused, targetFps]);

  return null;
}

interface RenderBoundaryProps {
  children: ReactNode;
  onError?: (error: Error) => void;
}

class RenderBoundary extends Component<
  RenderBoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The public boundary owns its Canvas so the entire Three/Fiber stack stays
 * behind FireHero's post-capability dynamic import.
 */
export function RibbonSystem(props: RibbonSystemProps) {
  const tier = props.quality ?? qualityFromResolution(props.resolution);
  const frozen = Boolean(props.reducedMotion || props.paused);
  const targetFps = props.targetFps ?? (tier === "gold" ? 60 : tier === "silver" ? 45 : 30);

  return (
    <RenderBoundary onError={props.onError}>
      <Canvas
        aria-hidden="true"
        dpr={getAdaptiveDpr(tier)}
        flat
        frameloop="demand"
        gl={{
          alpha: false,
          antialias: false,
          depth: false,
          failIfMajorPerformanceCaveat: true,
          powerPreference: tier === "gold" ? "high-performance" : "default",
          preserveDrawingBuffer: false,
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x050505, 1);
        }}
        resize={{ debounce: { resize: 0, scroll: 50 }, scroll: false }}
        style={{ display: "block", height: "100%", width: "100%" }}
      >
        <FrameScheduler paused={frozen} targetFps={targetFps} />
        <RibbonVolume {...props} />
      </Canvas>
    </RenderBoundary>
  );
}

export default RibbonSystem;
