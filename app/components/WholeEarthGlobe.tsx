"use client";

import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";
import * as THREE from "three";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-110m.json";
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
const EARTH_WHITE = new THREE.Color("#F4F7FF");
const TAU = Math.PI * 2;
const EARTH_RADIUS = 1.72;
const ROTATION_AXIS = new THREE.Vector3(0.28, 1, 0.16).normalize();

type GeoPoint = readonly [longitude: number, latitude: number];

type LandFeatureCollection = {
  features: ReadonlyArray<{
    geometry: {
      type: "MultiPolygon";
      coordinates: number[][][][];
    };
  }>;
};

const naturalEarthLand = feature(
  landTopology as never,
  landTopology.objects.land as never,
) as unknown as LandFeatureCollection;

const CONTINENT_OUTLINES: readonly (readonly GeoPoint[])[] =
  naturalEarthLand.features.flatMap((land) =>
    land.geometry.coordinates.flatMap((polygon) =>
      polygon
        .filter((ring) => ring.length >= 4)
        .map((ring) =>
          ring.map(([longitude, latitude]) => [longitude, latitude] as GeoPoint),
        ),
    ),
  );

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
  const isMobile = size.width <= 760;
  const meridianCount = isMobile ? 6 : 8;
  const parallelCount = isMobile ? 4 : 5;

  const globe = useMemo(() => {
    const earth = new THREE.Group();
    earth.rotation.set(-0.12, -0.38, 0.16);
    const gridMaterial = new THREE.LineBasicMaterial({
      color: SILVER,
      transparent: true,
      opacity: isMobile ? 0.48 : 0.42,
      depthWrite: false,
      toneMapped: false,
    });
    const continentMaterial = new THREE.MeshBasicMaterial({
      color: EARTH_WHITE,
      transparent: true,
      opacity: isMobile ? 0.64 : 0.58,
      depthWrite: false,
      toneMapped: false,
    });
    const occlusionMaterial = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true,
      side: THREE.FrontSide,
    });
    const hitTargetMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const radius = EARTH_RADIUS;
    const resolution = isMobile ? 48 : 72;

    earth.add(new THREE.Mesh(
      new THREE.SphereGeometry(radius, isMobile ? 48 : 72, isMobile ? 32 : 48),
      occlusionMaterial,
    ));
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
      const sampledOutline = isMobile
        ? outline.filter((_, index) => index % 2 === 0 || index === outline.length - 1)
        : outline;
      const points = sampledOutline.map((point) => geoPoint(point, radius * 1.018));
      const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
      const geometry = new THREE.TubeGeometry(
        curve,
        Math.max(8, points.length * 2),
        isMobile ? 0.0038 : 0.0045,
        4,
        false,
      );
      earth.add(new THREE.Mesh(geometry, continentMaterial));
    }

    const hitTarget = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 24, 16),
      hitTargetMaterial,
    );
    hitTarget.name = "whole-body-earth-globe-hit-target";
    earth.add(hitTarget);

    return {
      earth,
      gridMaterial,
      continentMaterial,
      occlusionMaterial,
      hitTargetMaterial,
    };
  }, [isMobile, meridianCount, parallelCount]);

  useEffect(() => () => {
    globe.earth.traverse((object) => {
      if (object instanceof THREE.Line || object instanceof THREE.Mesh) {
        object.geometry.dispose();
      }
    });
    globe.gridMaterial.dispose();
    globe.continentMaterial.dispose();
    globe.occlusionMaterial.dispose();
    globe.hitTargetMaterial.dispose();
  }, [globe]);

  useFrame((_, delta) => {
    const earth = earthRef.current;
    if (!earth) return;
    const targetSpeed = activePillar === "whole" && transitioning
      ? TAU / 10
      : TAU / 120;
    const currentSpeed = Number(earth.userData.rotationSpeed ?? TAU / 120);
    const speed = THREE.MathUtils.lerp(
      currentSpeed,
      targetSpeed,
      1 - Math.exp(-delta * 2),
    );
    earth.userData.rotationSpeed = speed;
    earth.rotateOnWorldAxis(ROTATION_AXIS, delta * speed);

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
        : EARTH_WHITE,
      1 - Math.exp(-delta * 3),
    );
  });

  const activate = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onActivate();
  };

  return (
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
  );
}

export function WholeEarthGlobe(props: WholeEarthGlobeProps) {
  const activateFromKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " " && event.defaultPrevented) return;
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
