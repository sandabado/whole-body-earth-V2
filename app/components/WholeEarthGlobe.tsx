"use client";

import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";
import * as THREE from "three";
import {
  COMMAND_PILLAR_COLORS,
  type ActivePillar,
} from "./HeroEngine/config";
import styles from "./WholeEarthGlobe.module.css";

type WholeEarthGlobeProps = {
  activePillar: ActivePillar;
  transitioning: boolean;
  onActivate: () => void;
};

const SILVER = new THREE.Color("#C0C0C0");
const CONTINENT_GOLD = new THREE.Color("#E2C76B");
const TAU = Math.PI * 2;

type GeoPoint = readonly [longitude: number, latitude: number];

const CONTINENT_OUTLINES: readonly (readonly GeoPoint[])[] = [
  [[-168, 66], [-150, 60], [-135, 55], [-126, 49], [-124, 39], [-116, 31], [-105, 24], [-96, 19], [-83, 24], [-80, 31], [-73, 42], [-61, 48], [-56, 54], [-70, 61], [-93, 69], [-122, 72], [-150, 70], [-168, 66]],
  [[-82, 12], [-75, 7], [-70, -5], [-64, -17], [-61, -31], [-69, -51], [-76, -54], [-73, -35], [-79, -18], [-82, 0], [-82, 12]],
  [[-11, 36], [-5, 44], [8, 50], [22, 55], [40, 59], [60, 55], [79, 59], [102, 56], [122, 49], [140, 51], [157, 61], [171, 65], [158, 49], [143, 41], [126, 34], [118, 23], [105, 14], [91, 21], [78, 22], [67, 25], [57, 19], [48, 12], [38, 14], [31, 31], [19, 36], [8, 37], [-11, 36]],
  [[-17, 35], [-5, 36], [12, 33], [25, 23], [34, 10], [43, -12], [34, -28], [20, -35], [8, -34], [-2, -24], [-10, -5], [-17, 14], [-17, 35]],
  [[112, -11], [129, -12], [143, -18], [153, -28], [146, -39], [132, -44], [116, -35], [112, -22], [112, -11]],
  [[-52, 60], [-42, 66], [-28, 73], [-38, 82], [-57, 80], [-66, 69], [-52, 60]],
  [[47, -13], [50, -19], [48, -26], [44, -20], [47, -13]],
  [[-180, -68], [-120, -72], [-60, -70], [0, -74], [60, -71], [120, -73], [180, -68]],
];

function isElementPillar(
  pillar: ActivePillar,
): pillar is Exclude<ActivePillar, "none" | "whole"> {
  return pillar !== "none" && pillar !== "whole";
}

function makeLoop(points: THREE.Vector3[], material: THREE.LineBasicMaterial) {
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    material,
  );
}

function geoPoint([longitude, latitude]: GeoPoint, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 90);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function GlobeLines({
  activePillar,
  transitioning,
  onActivate,
}: WholeEarthGlobeProps) {
  const { size } = useThree();
  const earthRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Group>(null);
  const isMobile = size.width <= 760;
  const meridianCount = isMobile ? 3 : 4;
  const parallelCount = isMobile ? 2 : 3;

  const globe = useMemo(() => {
    const earth = new THREE.Group();
    const torus = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({
      color: SILVER,
      transparent: true,
      opacity: isMobile ? 0.12 : 0.1,
      depthWrite: false,
      toneMapped: false,
    });
    const continentMaterial = new THREE.LineBasicMaterial({
      color: CONTINENT_GOLD,
      transparent: true,
      opacity: isMobile ? 0.88 : 0.82,
      depthWrite: false,
      toneMapped: false,
    });
    const torusMaterial = new THREE.LineBasicMaterial({
      color: SILVER,
      transparent: true,
      opacity: isMobile ? 0.13 : 0.11,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    });
    const radius = 1.72;
    const resolution = isMobile ? 48 : 72;

    for (let longitude = 0; longitude < meridianCount; longitude += 1) {
      const angle = longitude / meridianCount * Math.PI;
      const points = Array.from({ length: resolution }, (_, pointIndex) => {
        const pointAngle = pointIndex / resolution * TAU;
        const sweep = Math.sin(pointAngle) * radius;
        return new THREE.Vector3(
          sweep * Math.cos(angle),
          Math.cos(pointAngle) * radius,
          sweep * Math.sin(angle),
        );
      });
      earth.add(makeLoop(points, gridMaterial));
    }

    for (let latitudeIndex = 1; latitudeIndex <= parallelCount; latitudeIndex += 1) {
      const latitude = -Math.PI / 2
        + latitudeIndex / (parallelCount + 1) * Math.PI;
      const ringRadius = Math.cos(latitude) * radius;
      const y = Math.sin(latitude) * radius;
      const points = Array.from({ length: resolution }, (_, pointIndex) => {
        const angle = pointIndex / resolution * TAU;
        return new THREE.Vector3(
          Math.cos(angle) * ringRadius,
          y,
          Math.sin(angle) * ringRadius,
        );
      });
      earth.add(makeLoop(points, gridMaterial));
    }

    for (const outline of CONTINENT_OUTLINES) {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        outline.map((point) => geoPoint(point, radius * 1.012)),
      );
      earth.add(new THREE.Line(geometry, continentMaterial));
    }

    const torusResolution = isMobile ? 96 : 144;
    for (let strand = 0; strand < 7; strand += 1) {
      const phase = strand / 7 * TAU;
      const points = Array.from({ length: torusResolution }, (_, index) => {
        const angle = index / torusResolution * TAU;
        const majorRadius = 2.62;
        const minorRadius = 0.36;
        const ripple = Math.sin(angle * 3 + phase) * 0.07;
        const tubeAngle = angle * 2 + phase;
        const ringRadius = majorRadius + Math.cos(tubeAngle) * (minorRadius + ripple);
        return new THREE.Vector3(
          Math.cos(angle) * ringRadius,
          Math.sin(tubeAngle) * minorRadius,
          Math.sin(angle) * ringRadius,
        );
      });
      torus.add(makeLoop(points, torusMaterial));
    }

    const hitTarget = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 24, 16),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    hitTarget.name = "whole-body-earth-globe-hit-target";
    earth.add(hitTarget);

    torus.rotation.x = Math.PI * 0.34;
    torus.rotation.z = Math.PI * 0.08;
    return { earth, torus, gridMaterial, continentMaterial, torusMaterial };
  }, [isMobile, meridianCount, parallelCount]);

  useEffect(() => () => {
    for (const group of [globe.earth, globe.torus]) group.traverse((object) => {
      if (object instanceof THREE.Line || object instanceof THREE.Mesh) {
        object.geometry.dispose();
      }
    });
    globe.gridMaterial.dispose();
    globe.continentMaterial.dispose();
    globe.torusMaterial.dispose();
  }, [globe]);

  useFrame((_, delta) => {
    const earth = earthRef.current;
    const torus = torusRef.current;
    if (!earth || !torus) return;
    const targetSpeed = activePillar === "whole" && transitioning
      ? TAU / 2
      : TAU / 60;
    const currentSpeed = Number(earth.userData.rotationSpeed ?? TAU / 60);
    const speed = THREE.MathUtils.lerp(
      currentSpeed,
      targetSpeed,
      1 - Math.exp(-delta * 4.5),
    );
    earth.userData.rotationSpeed = speed;
    earth.rotation.y += delta * speed;
    torus.rotation.y -= delta * speed * 0.34;
    torus.rotation.z += delta * speed * 0.08;

    const targetColor = isElementPillar(activePillar)
      ? SILVER.clone().lerp(
          new THREE.Color(COMMAND_PILLAR_COLORS[activePillar]),
          0.15,
      )
      : SILVER;
    globe.gridMaterial.color.lerp(targetColor, 1 - Math.exp(-delta * 3));
    globe.continentMaterial.color.lerp(
      isElementPillar(activePillar)
        ? targetColor.clone().lerp(new THREE.Color("#FFFFFF"), 0.35)
        : CONTINENT_GOLD,
      1 - Math.exp(-delta * 3),
    );
    globe.torusMaterial.color.lerp(targetColor, 1 - Math.exp(-delta * 2));
  });

  const activate = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onActivate();
  };

  return (
    <>
      <primitive ref={torusRef} object={globe.torus} />
      <primitive
        ref={earthRef}
        object={globe.earth}
        onClick={activate}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      />
    </>
  );
}

export function WholeEarthGlobe(props: WholeEarthGlobeProps) {
  const activateFromKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    props.onActivate();
  };

  return (
    <div
      className={styles.shell}
      role="button"
      tabIndex={props.transitioning ? -1 : 0}
      aria-label="Whole Body Earth — Live Calendar"
      aria-disabled={props.transitioning ? true : undefined}
      onKeyDown={activateFromKeyboard}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 7.6], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <GlobeLines {...props} />
      </Canvas>
    </div>
  );
}

export default WholeEarthGlobe;
