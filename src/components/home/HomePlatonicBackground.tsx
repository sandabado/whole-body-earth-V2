"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { mesh } from "topojson-client";
import * as THREE from "three";
import landAtlas from "world-atlas/land-110m.json";
import { PlatonicEdges } from "@/components/backgrounds/PlatonicEdges";

type SolidName =
  "tetrahedron" | "octahedron" | "icosahedron" | "cube" | "dodecahedron";
type SceneName = SolidName | "all" | "logo" | "none";
type Coordinate = [longitude: number, latitude: number];
type Point2D = [x: number, y: number];

const sectionIds = [
  "hero",
  "five-bodies",
  "presence",
  "press",
  "studios",
  "foundation",
  "guardian",
  "apply",
];
const scenes: SceneName[] = [
  "dodecahedron",
  "logo",
  "tetrahedron",
  "octahedron",
  "icosahedron",
  "cube",
  "dodecahedron",
  "none",
];
const HERO_EARTH_RADIUS = 2.05;
const HERO_DODECAHEDRON_SCALE = 1.116;
const HERO_DODECAHEDRON_COLOR = "#ff3da5";
const LOGO_DIAMOND_RADIUS = 0.88;
const LOGO_DIAMOND_OFFSET = LOGO_DIAMOND_RADIUS * 2;
const landTopology = landAtlas as unknown as Parameters<typeof mesh>[0];
const naturalEarthCoastlines = mesh(
  landTopology,
  landTopology.objects.land as Parameters<typeof mesh>[1],
).coordinates as Coordinate[][];

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

const SOLID_COLORS: Record<SolidName, string> = {
  tetrahedron: "#d16b45",
  octahedron: "#d4af37",
  icosahedron: "#2ba8a0",
  cube: "#4a6741",
  dodecahedron: "#8f5bff",
};

function solidGeometry(name: SolidName) {
  // Detail levels must remain zero: higher levels project the faces toward a sphere,
  // which breaks the exact Platonic face and edge counts.
  if (name === "tetrahedron") return new THREE.TetrahedronGeometry(1, 0);
  if (name === "octahedron") return new THREE.OctahedronGeometry(1, 0);
  if (name === "icosahedron") return new THREE.IcosahedronGeometry(1, 0);
  if (name === "cube") return new THREE.BoxGeometry(1.35, 1.35, 1.35, 1, 1, 1);
  return new THREE.DodecahedronGeometry(1);
}

function ContinuousQuincunx() {
  const line = useMemo(() => {
    const radius = LOGO_DIAMOND_RADIUS;
    const points: Point2D[] = [
      [0, radius],
      [radius, radius * 2],
      [0, radius * 3],
      [-radius, radius * 2],
      [0, radius],
      [radius, 0],
      [radius * 2, radius],
      [radius * 3, 0],
      [radius * 2, -radius],
      [radius, 0],
      [0, -radius],
      [radius, -radius * 2],
      [0, -radius * 3],
      [-radius, -radius * 2],
      [0, -radius],
      [-radius, 0],
      [-radius * 2, -radius],
      [-radius * 3, 0],
      [-radius * 2, radius],
      [-radius, 0],
    ];
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
      true,
      "catmullrom",
      0.025,
    );
    const object = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(480)),
      new THREE.LineBasicMaterial({
        color: "#d8c98f",
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    );
    object.renderOrder = 2;
    return object;
  }, []);

  return <primitive object={line} />;
}

function LogoInsetSolid({
  name,
  position,
  color,
}: {
  name: SolidName;
  position: [number, number, number];
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => solidGeometry(name), [name]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.22;
    ref.current.rotation.y += delta * 0.34;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={position}
      scale={0.31}
      renderOrder={2}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        opacity={0.48}
        transparent
        metalness={0.42}
        roughness={0.28}
      />
      <PlatonicEdges
        geometry={geometry}
        color={color}
        opacity={1}
        renderOrder={3}
      />
    </mesh>
  );
}

function LogoMark() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.11;
    ref.current.rotation.x += delta * 0.025;
  });

  return (
    <Float speed={0.8} floatIntensity={0.18}>
      <group ref={ref} rotation={[-0.08, 0.18, 0]}>
        <ContinuousQuincunx />
        <LogoInsetSolid
          name="octahedron"
          position={[0, LOGO_DIAMOND_OFFSET, 0]}
          color="#d4af37"
        />
        <LogoInsetSolid
          name="cube"
          position={[0, -LOGO_DIAMOND_OFFSET, 0]}
          color="#4a6741"
        />
        <LogoInsetSolid
          name="tetrahedron"
          position={[LOGO_DIAMOND_OFFSET, 0, 0]}
          color="#c2542d"
        />
        <LogoInsetSolid
          name="icosahedron"
          position={[-LOGO_DIAMOND_OFFSET, 0, 0]}
          color="#2ba8a0"
        />
        <LogoInsetSolid
          name="dodecahedron"
          position={[0, 0, 0]}
          color="#6d4aff"
        />
      </group>
    </Float>
  );
}

function Solid({
  name,
  position = [0, 0, 0],
  scale = 2.2,
  alwaysVisible = false,
  colorOverride,
}: {
  name: SolidName;
  position?: [number, number, number];
  scale?: number;
  alwaysVisible?: boolean;
  colorOverride?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => solidGeometry(name), [name]);
  const color = colorOverride ?? SOLID_COLORS[name];

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.08;
    ref.current.rotation.y += delta * 0.14;

    if (!alwaysVisible || !glowRef.current) return;
    const pulse = (Math.sin(state.clock.getElapsedTime() * 0.8) + 1) / 2;
    glowRef.current.scale.setScalar(1.16 + pulse * 0.18);
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.06 + pulse * 0.12;
  });

  return (
    <Float speed={1.1} floatIntensity={0.35}>
      <group ref={ref} position={position} scale={scale}>
        <mesh geometry={geometry} renderOrder={alwaysVisible ? 5 : 0}>
          {alwaysVisible ? (
            <>
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.82}
                depthTest={false}
                depthWrite={false}
                toneMapped={false}
              />
              <mesh geometry={geometry} scale={1.48} renderOrder={3}>
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.035}
                  blending={THREE.AdditiveBlending}
                  side={THREE.BackSide}
                  depthTest={false}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
              <mesh ref={glowRef} geometry={geometry} scale={1.16} renderOrder={4}>
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.06}
                  blending={THREE.AdditiveBlending}
                  side={THREE.BackSide}
                  depthTest={false}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            </>
          ) : (
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.55}
              opacity={0.24}
              transparent
              roughness={0.3}
              metalness={0.4}
              depthWrite={false}
            />
          )}
          <PlatonicEdges
            geometry={geometry}
            color={alwaysVisible ? "#ffd0e9" : color}
            opacity={alwaysVisible ? 0.72 : 0.94}
            renderOrder={alwaysVisible ? 6 : 1}
          />
        </mesh>
      </group>
    </Float>
  );
}

function globePoint([longitude, latitude]: Coordinate, radius: number) {
  const lon = THREE.MathUtils.degToRad(longitude);
  const lat = THREE.MathUtils.degToRad(latitude);
  return new THREE.Vector3(
    radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon),
  );
}

function GlobeLine({
  points,
  color,
  opacity,
}: {
  points: THREE.Vector3[];
  color: string;
  opacity: number;
}) {
  const line = useMemo(() => {
    const object = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
      }),
    );
    object.renderOrder = 3;
    return object;
  }, [points, color, opacity]);

  return <primitive object={line} />;
}

function GlobeOccluder({ radius }: { radius: number }) {
  const occluder = useMemo(() => {
    const material = new THREE.MeshBasicMaterial();
    material.colorWrite = false;
    material.depthWrite = true;
    const object = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 32),
      material,
    );
    object.renderOrder = 2;
    return object;
  }, [radius]);

  return <primitive object={occluder} />;
}

function GlobeAtmosphere({ radius }: { radius: number }) {
  const atmosphere = useMemo(() => {
    const object = new THREE.Mesh(
      new THREE.SphereGeometry(radius + 0.025, 64, 32),
      new THREE.MeshBasicMaterial({
        color: "#d8ccff",
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
      }),
    );
    object.renderOrder = 1;
    return object;
  }, [radius]);

  return <primitive object={atmosphere} />;
}

function rainbowGeometry(geometry: THREE.BufferGeometry, phase = 0) {
  const positions = geometry.getAttribute("position");
  const colors = new Float32Array(positions.count * 3);
  const color = new THREE.Color();

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    // Let the spectrum follow the curve rather than a flat screen direction.
    const angle = Math.atan2(z, x) / (Math.PI * 2);
    const elevation = Math.atan2(y, Math.hypot(x, z)) / Math.PI;
    const hue = (angle + elevation * 0.22 + phase + 1) % 1;
    color.setHSL(hue, 0.98, 0.68);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

/**
 * A low-poly additive shell gives the wireframe globe an internal aurora rather
 * than a flat color wash. It is intentionally faint so coastlines remain legible.
 */
function RainbowEarthAura({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(
    () =>
      rainbowGeometry(
        new THREE.SphereGeometry(HERO_EARTH_RADIUS + 0.045, 48, 28),
        0.08,
      ),
    [],
  );

  useFrame((_state, delta) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y += delta * 0.036;
    ref.current.rotation.z -= delta * 0.008;
  });

  return (
    <mesh ref={ref} geometry={geometry} renderOrder={2.5}>
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.14}
        blending={THREE.AdditiveBlending}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** A subtle internal aurora keeps the hero Earth alive without external orbit lines. */
function HeroEarthAurora() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <group rotation={[0.32, 0, -0.38]}>
      <RainbowEarthAura reducedMotion={reducedMotion} />
    </group>
  );
}

function EarthWireframe() {
  const ref = useRef<THREE.Group>(null);
  const { latitudeLines, longitudeLines, coastlineLines } = useMemo(() => {
    const radius = HERO_EARTH_RADIUS;
    return {
      latitudeLines: [-60, -30, 0, 30, 60].map((latitude) =>
        Array.from({ length: 145 }, (_, index) =>
          globePoint([-180 + index * 2.5, latitude], radius),
        ),
      ),
      longitudeLines: Array.from(
        { length: 12 },
        (_, line) => -180 + line * 30,
      ).map((longitude) =>
        Array.from({ length: 91 }, (_, index) =>
          globePoint([longitude, -90 + index * 2], radius),
        ),
      ),
      coastlineLines: naturalEarthCoastlines.map((coastline) =>
        coastline.map((coordinate) => globePoint(coordinate, radius + 0.015)),
      ),
    };
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.032;
  });

  return (
    <group rotation={[0.32, 0, -0.38]}>
      <group ref={ref}>
        <GlobeAtmosphere radius={HERO_EARTH_RADIUS} />
        <GlobeOccluder radius={HERO_EARTH_RADIUS} />
        {latitudeLines.map((points, index) => (
          <GlobeLine
            key={`latitude-${index}`}
            points={points}
            color="#f9b8df"
            opacity={index === 2 ? 0.86 : 0.52}
          />
        ))}
        {longitudeLines.map((points, index) => (
          <GlobeLine
            key={`longitude-${index}`}
            points={points}
            color="#f9b8df"
            opacity={index === 0 ? 0.8 : 0.48}
          />
        ))}
        {coastlineLines.map((points, index) => (
          <GlobeLine
            key={`coastline-${index}`}
            points={points}
            color="#fff3fb"
            opacity={1}
          />
        ))}
      </group>
    </group>
  );
}

function Scene({
  active,
  heroEarth,
}: {
  active: SceneName;
  heroEarth: boolean;
}) {
  if (active === "none") return null;
  if (active === "logo") return <LogoMark />;
  if (active !== "all") {
    const isHeroDodecahedron = heroEarth && active === "dodecahedron";
    return (
      <>
        {isHeroDodecahedron ? (
          <pointLight
            position={[0, 0, 2.5]}
            color="#ff5cb3"
            intensity={10}
            distance={9}
          />
        ) : null}
        <Solid
          name={active}
          scale={isHeroDodecahedron ? HERO_DODECAHEDRON_SCALE : 2.2}
          alwaysVisible={isHeroDodecahedron}
          colorOverride={isHeroDodecahedron ? HERO_DODECAHEDRON_COLOR : undefined}
        />
        {isHeroDodecahedron ? <HeroEarthAurora /> : null}
      </>
    );
  }
  return (
    <>
      <Solid name="tetrahedron" position={[-2.5, 1.45, 0]} scale={0.9} />
      <Solid name="octahedron" position={[2.5, 1.45, 0]} scale={0.9} />
      <Solid name="icosahedron" position={[-2.5, -1.45, 0]} scale={0.9} />
      <Solid name="cube" position={[2.5, -1.45, 0]} scale={0.9} />
      <Solid name="dodecahedron" position={[0, 0, 0]} scale={1.25} />
    </>
  );
}

export default function HomePlatonicBackground() {
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    const updateScene = () => {
      const center = window.scrollY + window.innerHeight / 2;
      const index = sectionIds.findIndex((id) => {
        const section = document.getElementById(id);
        if (!section) return false;
        return (
          center >= section.offsetTop &&
          center < section.offsetTop + section.offsetHeight
        );
      });
      if (index >= 0) setSceneIndex(index);
    };

    updateScene();
    window.addEventListener("scroll", updateScene, { passive: true });
    window.addEventListener("resize", updateScene);
    return () => {
      window.removeEventListener("scroll", updateScene);
      window.removeEventListener("resize", updateScene);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="home-platonic-canvas pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void"
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 48 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.45} />
          <pointLight position={[5, 6, 5]} intensity={1.4} color="#f4e0a6" />
          <pointLight position={[-5, -4, 3]} intensity={0.7} color="#fda4d4" />
          <Scene active={scenes[sceneIndex]} heroEarth={sceneIndex === 0} />
          {sceneIndex === 0 ? <EarthWireframe /> : null}
        </Canvas>
      </div>
    </>
  );
}
