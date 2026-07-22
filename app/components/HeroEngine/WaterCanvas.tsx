"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { HeroConfig } from "./config";
import type { DeviceTier } from "./hooks/useDeviceCapability";
import { usePointerInfluence } from "./hooks/usePointerInfluence";
import { useScrollSpeed } from "./hooks/useScrollSpeed";
import vertexShader from "./shaders/common.vert";
import fragmentShader from "./shaders/water.frag";

type WaterCanvasProps = {
  config: HeroConfig;
  pixelRatio: number;
  tier: DeviceTier;
  onReady: () => void;
};

type WaterPlaneProps = Pick<WaterCanvasProps, "config" | "tier" | "onReady">;

function WaterPlane({ config, tier, onReady }: WaterPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const framesRef = useRef(0);
  const flareRef = useRef(0);
  const nextFlareRef = useRef(config.ambientFlareIntervalMs / 1000);
  const pointer = usePointerInfluence();
  const scrollSpeed = useScrollSpeed();
  const { size, viewport } = useThree();

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
    uPointerInfluenceStrength: { value: config.pointerInfluenceStrength },
    uScrollAccelerationMultiplier: { value: config.scrollAccelerationMultiplier },
    uWhiteHotFlare: { value: 0 },
  }), [config, size.height, size.width]);

  useEffect(() => {
    nextFlareRef.current = elapsedRef.current + config.ambientFlareIntervalMs / 1000;
  }, [config.ambientFlareIntervalMs]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const cappedDelta = Math.min(delta, tier === "low" ? 1 / 24 : 1 / 40);
    elapsedRef.current += cappedDelta;
    material.uniforms.uTime.value = elapsedRef.current;
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

export default function WaterCanvas({ config, pixelRatio, tier, onReady }: WaterCanvasProps) {
  return (
    <Canvas
      dpr={pixelRatio}
      frameloop="always"
      camera={{ position: [0, 0, 5], fov: 46 }}
      gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.setClearColor(new THREE.Color(config.colorBase), 0); }}
    >
      <WaterPlane config={config} tier={tier} onReady={onReady} />
    </Canvas>
  );
}
