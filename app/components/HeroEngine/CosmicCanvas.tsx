"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { DeviceTier } from "./hooks/useDeviceCapability";
import cosmicVertexShader from "./shaders/cosmic.vert";
import cosmicFragmentShader from "./shaders/cosmic.frag";

type CosmicCanvasProps = {
  pixelRatio: number;
  tier: DeviceTier;
  onReady: () => void;
};

type StarLayerProps = {
  count: number;
  seed: number;
  opacityMinimum: number;
  opacityMaximum: number;
  sizeMinimum: number;
  sizeMaximum: number;
  drifting?: boolean;
  pixelRatio: number;
};

const STAR_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  attribute float aSize;
  attribute float aOpacity;

  uniform float uPixelRatio;
  uniform float uBrightness;

  varying float vOpacity;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * uPixelRatio;
    vOpacity = aOpacity * uBrightness;
  }
`;

const STAR_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying float vOpacity;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.08, distanceToCenter) * vOpacity;
    if (alpha < 0.012) discard;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function buildStarGeometry({
  count,
  seed,
  width,
  height,
  opacityMinimum,
  opacityMaximum,
  sizeMinimum,
  sizeMaximum,
}: Omit<StarLayerProps, "drifting" | "pixelRatio"> & {
  width: number;
  height: number;
}): THREE.BufferGeometry {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() - 0.5) * width * 1.42;
    positions[index * 3 + 1] = (random() - 0.5) * height * 1.42;
    positions[index * 3 + 2] = -2.5 + random() * 5.25;
    sizes[index] = sizeMinimum + random() * (sizeMaximum - sizeMinimum);
    opacities[index] =
      opacityMinimum + random() * (opacityMaximum - opacityMinimum);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
  return geometry;
}

function StarLayer({
  count,
  seed,
  opacityMinimum,
  opacityMaximum,
  sizeMinimum,
  sizeMaximum,
  drifting = false,
  pixelRatio,
}: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const geometry = useMemo(
    () =>
      buildStarGeometry({
        count,
        seed,
        width: viewport.width,
        height: viewport.height,
        opacityMinimum,
        opacityMaximum,
        sizeMinimum,
        sizeMaximum,
      }),
    [
      count,
      opacityMaximum,
      opacityMinimum,
      seed,
      sizeMaximum,
      sizeMinimum,
      viewport.height,
      viewport.width,
    ],
  );
  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: pixelRatio },
      uBrightness: { value: drifting ? 1 : 0.82 },
    }),
    [drifting, pixelRatio],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!drifting || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * (Math.PI * 2 / 300);
    pointsRef.current.rotation.x += delta * (Math.PI * 2 / 500);
  });

  return (
    <points ref={pointsRef} geometry={geometry} renderOrder={drifting ? 3 : 2}>
      <shaderMaterial
        vertexShader={STAR_VERTEX_SHADER}
        fragmentShader={STAR_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CosmicField({ tier, onReady }: Pick<CosmicCanvasProps, "tier" | "onReady">) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const framesRef = useRef(0);
  const announcedReadyRef = useRef(false);
  const { size, viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uOctaves: { value: tier === "high" ? 5 : 3 },
    }),
    [size.height, size.width, tier],
  );

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    elapsedRef.current += Math.min(delta, 1 / 30);
    material.uniforms.uTime.value = elapsedRef.current;
    framesRef.current += 1;
    if (!announcedReadyRef.current && framesRef.current >= 3) {
      announcedReadyRef.current = true;
      onReady();
    }
  });

  return (
    <mesh renderOrder={1}>
      <planeGeometry args={[viewport.width * 1.02, viewport.height * 1.02]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cosmicVertexShader}
        fragmentShader={cosmicFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function CosmicScene({
  pixelRatio,
  tier,
  onReady,
}: CosmicCanvasProps) {
  const staticStarCount = tier === "high" ? 4_400 : 2_000;
  const driftingStarCount = tier === "high" ? 520 : 260;

  return (
    <>
      <CosmicField tier={tier} onReady={onReady} />
      <StarLayer
        count={staticStarCount}
        seed={0xc05c1c}
        opacityMinimum={0.1}
        opacityMaximum={0.72}
        sizeMinimum={0.55}
        sizeMaximum={2.1}
        pixelRatio={pixelRatio}
      />
      <StarLayer
        count={driftingStarCount}
        seed={0x5eedf13d}
        opacityMinimum={0.42}
        opacityMaximum={0.96}
        sizeMinimum={0.85}
        sizeMaximum={2.8}
        drifting
        pixelRatio={pixelRatio}
      />
    </>
  );
}

export default function CosmicCanvas(props: CosmicCanvasProps) {
  return (
    <Canvas
      dpr={props.pixelRatio}
      frameloop="always"
      camera={{ position: [0, 0, 5], fov: 46, near: 0.1, far: 40 }}
      gl={{
        antialias: props.tier === "high",
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#020308"), 1);
      }}
    >
      <CosmicScene {...props} />
    </Canvas>
  );
}
