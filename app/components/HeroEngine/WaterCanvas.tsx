"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  COMMAND_PILLAR_COLORS,
  type ActivePillar,
  type HeroConfig,
} from "./config";
import type { DeviceTier } from "./hooks/useDeviceCapability";
import { usePointerInfluence } from "./hooks/usePointerInfluence";
import { useScrollSpeed } from "./hooks/useScrollSpeed";
import vertexShader from "./shaders/common.vert";
import fragmentShader from "./shaders/water.frag";

type WaterCanvasProps = {
  config: HeroConfig;
  pixelRatio: number;
  tier: DeviceTier;
  autoRotate: boolean;
  activePillar: ActivePillar;
  onReady: () => void;
};

type WaterPlaneProps = Pick<WaterCanvasProps, "config" | "tier" | "autoRotate" | "activePillar" | "onReady">;

function isNamedPillar(
  pillar: ActivePillar,
): pillar is Exclude<ActivePillar, "none" | "whole"> {
  return pillar !== "none" && pillar !== "whole";
}

function WaterPlane({ config, tier, autoRotate, activePillar, onReady }: WaterPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const motionTimeRef = useRef(0);
  const motionRateRef = useRef(1);
  const framesRef = useRef(0);
  const flareRef = useRef(0);
  const nextFlareRef = useRef(config.ambientFlareIntervalMs / 1000);
  const pointer = usePointerInfluence();
  const scrollSpeed = useScrollSpeed();
  const { size, viewport } = useThree();
  const focusPalette = useMemo(() => {
    if (!isNamedPillar(activePillar)) {
      return {
        primary: new THREE.Color(config.colorPrimary),
        secondary: new THREE.Color(config.colorSecondary ?? config.colorBase),
      };
    }

    const primary = new THREE.Color(COMMAND_PILLAR_COLORS[activePillar]);
    return {
      primary,
      secondary: primary.clone().lerp(new THREE.Color(config.colorBase), 0.62),
    };
  }, [activePillar, config.colorBase, config.colorPrimary, config.colorSecondary]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uPointerActive: { value: 0 },
    uScrollSpeed: { value: 0 },
    uColorBase: { value: new THREE.Color(config.colorBase) },
    uColorPrimary: { value: new THREE.Color(config.colorPrimary) },
    uColorSecondary: { value: new THREE.Color(config.colorSecondary ?? config.colorBase) },
    uColorSurface: { value: new THREE.Color(config.colorSurface) },
    uFluidDissipation: { value: config.fluidDissipation },
    uFlowVelocityScale: { value: config.flowVelocityScale },
    uCurlNoiseAmplitude: { value: config.curlNoiseAmplitude },
    uCameraDriftSpeed: { value: config.cameraDriftSpeed },
    uCameraRotationDegrees: { value: config.cameraRotationDegrees },
    uAutoRotate: { value: autoRotate ? 1 : 0 },
    uPointerInfluenceStrength: { value: config.pointerInfluenceStrength },
    uScrollAccelerationMultiplier: { value: config.scrollAccelerationMultiplier },
    uWhiteHotFlare: { value: 0 },
  }), [autoRotate, config, size.height, size.width]);

  useEffect(() => {
    nextFlareRef.current = elapsedRef.current + config.ambientFlareIntervalMs / 1000;
  }, [config.ambientFlareIntervalMs]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const cappedDelta = Math.min(delta, tier === "low" ? 1 / 24 : 1 / 40);
    elapsedRef.current += cappedDelta;
    const targetMotionRate = isNamedPillar(activePillar) ? 0.45 : 1;
    const motionEase = 1 - Math.exp(-cappedDelta * 1.45);
    motionRateRef.current = THREE.MathUtils.lerp(
      motionRateRef.current,
      targetMotionRate,
      motionEase,
    );
    motionTimeRef.current += cappedDelta * motionRateRef.current;
    material.uniforms.uTime.value = motionTimeRef.current;

    const colorEase = 1 - Math.exp(-cappedDelta * 1.2);
    material.uniforms.uColorPrimary.value.lerp(focusPalette.primary, colorEase);
    material.uniforms.uColorSecondary.value.lerp(focusPalette.secondary, colorEase);
    material.uniforms.uPointer.value.lerp(
      new THREE.Vector2(pointer.current.x, pointer.current.y),
      Math.min(1, delta * (2.2 + config.pointerInfluenceStrength * 20)),
    );
    material.uniforms.uPointerActive.value = THREE.MathUtils.lerp(
      material.uniforms.uPointerActive.value,
      pointer.current.active,
      Math.min(1, delta * 1.8),
    );
    material.uniforms.uScrollSpeed.value = THREE.MathUtils.lerp(
      material.uniforms.uScrollSpeed.value,
      scrollSpeed.current,
      Math.min(1, delta * 1.6),
    );

    if (elapsedRef.current >= nextFlareRef.current) {
      flareRef.current = 1;
      nextFlareRef.current = elapsedRef.current + config.ambientFlareIntervalMs / 1000;
    }
    flareRef.current = Math.max(0, flareRef.current - delta * 0.38);
    material.uniforms.uWhiteHotFlare.value = flareRef.current;

    framesRef.current += 1;
    if (framesRef.current === 3) onReady();
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width * 1.015, viewport.height * 1.015, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function WaterCanvas({ config, pixelRatio, tier, autoRotate, activePillar, onReady }: WaterCanvasProps) {
  return (
    <Canvas
      dpr={pixelRatio}
      frameloop="always"
      camera={{ position: [0, 0, 5], fov: 46 }}
      gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.setClearColor(new THREE.Color(config.colorBase), 0); }}
    >
      <WaterPlane
        config={config}
        tier={tier}
        autoRotate={autoRotate}
        activePillar={activePillar}
        onReady={onReady}
      />
    </Canvas>
  );
}
