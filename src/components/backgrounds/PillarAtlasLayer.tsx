"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PILLARS, pillarForPath } from "@/lib/pillars";
import { PlatonicEdges } from "./PlatonicEdges";

type SolidName = "tetrahedron" | "octahedron" | "icosahedron" | "cube" | "dodecahedron";

type AtlasTheme = {
  color: string;
  solid: SolidName;
};

const CONSTELLATION_THEME: AtlasTheme = { color: "#b7b7c4", solid: "dodecahedron" };

function themeFor(pathname: string): AtlasTheme {
  const pillar = pillarForPath(pathname);
  if (pillar) return { color: PILLARS[pillar].color, solid: PILLARS[pillar].solid.toLowerCase() as SolidName };
  if (pathname === "/calendar") return { color: PILLARS.press.color, solid: "octahedron" };
  return CONSTELLATION_THEME;
}

function geometryFor(solid: SolidName) {
  // All detail levels remain zero so each object retains its exact Platonic geometry.
  if (solid === "tetrahedron") return new THREE.TetrahedronGeometry(1, 0);
  if (solid === "octahedron") return new THREE.OctahedronGeometry(1, 0);
  if (solid === "icosahedron") return new THREE.IcosahedronGeometry(1, 0);
  if (solid === "cube") return new THREE.BoxGeometry(1.35, 1.35, 1.35, 1, 1, 1);
  return new THREE.DodecahedronGeometry(1);
}

type BinduField = { count: number; directions: Float32Array; geometry: THREE.BufferGeometry; positions: Float32Array; radii: Float32Array; speeds: Float32Array };

function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function createBinduField(count: number, seed: number): BinduField {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const directions = new Float32Array(count * 3);
  const radii = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const radius = 1.4 + Math.pow(random(), 0.74) * 32;
    const theta = random() * Math.PI * 2;
    const z = -0.16 - random() * 0.84;
    const horizontal = Math.sqrt(1 - z * z);
    const x = Math.cos(theta) * horizontal;
    const y = Math.sin(theta) * horizontal;
    directions[index * 3] = x;
    directions[index * 3 + 1] = y;
    directions[index * 3 + 2] = z;
    radii[index] = radius;
    // A 90–300 second outward journey: deliberate rather than hyperspace.
    speeds[index] = 0.11 + random() * 0.25;
    positions[index * 3] = x * radius;
    positions[index * 3 + 1] = y * radius;
    positions[index * 3 + 2] = z * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return { count, directions, geometry, positions, radii, speeds };
}

const STAR_VERTEX_SHADER = `
  attribute float aPhase;
  attribute vec3 aDirection;
  attribute float aRadius;
  attribute float aSize;
  attribute float aSpeed;
  attribute vec3 color;
  uniform float uTime;
  uniform float uTwinkle;
  varying vec3 vColor;
  varying float vLight;

  void main() {
    vColor = color;
    vLight = 0.78 + sin(uTime * 0.34 + aPhase) * uTwinkle;
    float radius = 1.2 + mod(aRadius - 1.2 + uTime * aSpeed, 32.8);
    vec3 starPosition = aDirection * radius;
    vec4 modelViewPosition = modelViewMatrix * vec4(starPosition, 1.0);
    gl_PointSize = max(1.35, aSize * (690.0 / -modelViewPosition.z) * vLight);
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

const STAR_FRAGMENT_SHADER = `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vLight;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5)) * 2.0;
    float halo = smoothstep(1.0, 0.0, distanceFromCenter);
    float core = smoothstep(0.42, 0.0, distanceFromCenter);
    float alpha = (halo * 0.62 + core * 0.92) * uOpacity * vLight;
    if (alpha < 0.012) discard;
    gl_FragColor = vec4(vColor * (0.58 + core * 0.84), alpha);
  }
`;

function BinduPoints({ count, opacity, seed, size, twinkle }: { count: number; opacity: number; seed: number; size: number; twinkle: number }) {
  const initialField = useMemo(() => {
    const field = createBinduField(count, seed);
    const random = seededRandom(seed + 9029);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const starColors = [new THREE.Color("#ffffff"), new THREE.Color("#eff7ff"), new THREE.Color("#fff9ec")];

    for (let index = 0; index < count; index += 1) {
      const color = starColors[Math.min(starColors.length - 1, Math.floor(random() * starColors.length))];
      phases[index] = random() * Math.PI * 2;
      sizes[index] = size * (0.72 + random() * 0.86);
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    field.geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    field.geometry.setAttribute("aDirection", new THREE.BufferAttribute(field.directions, 3));
    field.geometry.setAttribute("aRadius", new THREE.BufferAttribute(field.radii, 1));
    field.geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    field.geometry.setAttribute("aSpeed", new THREE.BufferAttribute(field.speeds, 1));
    field.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return field;
  }, [count, seed, size]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: opacity }, uTwinkle: { value: twinkle } },
    vertexShader: STAR_VERTEX_SHADER,
    fragmentShader: STAR_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [opacity, twinkle]);
  const materialRef = useRef(material);

  useFrame((state) => {
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return <points geometry={initialField.geometry} frustumCulled={false}>
    <primitive object={material} attach="material" />
  </points>;
}

/** Neutral white stars stream slowly from the bindu behind every Platonic solid. */
export function StarDust({ origin = [0, 0, 0] }: { origin?: [number, number, number] }) {
  return <group position={origin}><BinduPoints count={2800} opacity={0.5} seed={71923} size={0.032} twinkle={0.07} /><BinduPoints count={980} opacity={0.8} seed={18263} size={0.066} twinkle={0.15} /><BinduPoints count={280} opacity={1} seed={49361} size={0.13} twinkle={0.28} /></group>;
}

export function AtlasConstruction({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.012;
    ref.current.rotation.y -= delta * 0.018;
  });

  return <group ref={ref} position={[2.55, 0.2, -0.35]} rotation={[0.48, -0.32, 0.2]}>
    <mesh rotation={[0.75, 0.22, 0]}>
      <torusGeometry args={[2.7, 0.008, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
    </mesh>
    <mesh rotation={[-0.52, 1.04, 0.35]}>
      <torusGeometry args={[2.2, 0.006, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
    </mesh>
    <mesh rotation={[1.42, 0.12, -0.68]}>
      <torusGeometry args={[1.64, 0.005, 8, 120]} />
      <meshBasicMaterial color="#f5f3f0" transparent opacity={0.12} depthWrite={false} />
    </mesh>
  </group>;
}

function AtlasSolid({ color, solid }: AtlasTheme) {
  const ref = useRef<THREE.Group>(null);
  const geometry = useMemo(() => geometryFor(solid), [solid]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.045;
    ref.current.rotation.y += delta * 0.085;
  });

  return <Float speed={0.75} floatIntensity={0.2} rotationIntensity={0.1}>
    <group ref={ref} position={[2.55, 0.2, 0]} scale={3.05} rotation={[0.16, -0.42, 0.1]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.38} transparent opacity={0.14} metalness={0.56} roughness={0.24} />
        <PlatonicEdges geometry={geometry} color={color} opacity={0.9} renderOrder={2} />
      </mesh>
    </group>
  </Float>;
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.slice(1);
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function PillarAtlasLayer() {
  const pathname = usePathname();
  const theme = themeFor(pathname);

  if (pathname === "/") return null;

  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void">
    <Canvas camera={{ position: [0, 0, 8], fov: 48 }} dpr={[1, 1.25]}>
      <StarDust origin={[2.55, 0.2, -0.35]} />
      <ambientLight intensity={0.34} />
      <pointLight position={[4.5, 5, 4]} intensity={1.1} color="#f5f3f0" />
      <pointLight position={[-4, -2, 3]} intensity={0.45} color={theme.color} />
      <AtlasConstruction color={theme.color} />
      <AtlasSolid {...theme} />
    </Canvas>
    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 76% 43%, ${hexToRgba(theme.color, 0.2)} 0%, transparent 34%), linear-gradient(90deg, rgba(5,5,5,.96) 0%, rgba(5,5,5,.82) 48%, rgba(5,5,5,.48) 100%)` }} />
  </div>;
}
