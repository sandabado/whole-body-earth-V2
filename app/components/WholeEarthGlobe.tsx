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
const TAU = Math.PI * 2;

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

function GlobeLines({
  activePillar,
  transitioning,
  onActivate,
}: WholeEarthGlobeProps) {
  const { size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = size.width <= 760;
  const meridianCount = isMobile ? 8 : 12;
  const parallelCount = isMobile ? 5 : 8;

  const globe = useMemo(() => {
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({
      color: SILVER,
      transparent: true,
      opacity: isMobile ? 0.5 : 0.4,
      depthWrite: false,
      toneMapped: false,
    });
    const radius = 2.35;
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
      group.add(makeLoop(points, material));
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
      group.add(makeLoop(points, material));
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
    group.add(hitTarget);

    return { group, material };
  }, [isMobile, meridianCount, parallelCount]);

  useEffect(() => () => {
    globe.group.traverse((object) => {
      if (object instanceof THREE.Line || object instanceof THREE.Mesh) {
        object.geometry.dispose();
      }
    });
    globe.material.dispose();
  }, [globe]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const firstLine = group.children.find(
      (child): child is THREE.Line => child instanceof THREE.Line,
    );
    const lineMaterial = firstLine?.material instanceof THREE.LineBasicMaterial
      ? firstLine.material
      : null;
    const targetSpeed = activePillar === "whole" && transitioning
      ? TAU / 2
      : TAU / 60;
    const currentSpeed = Number(group.userData.rotationSpeed ?? TAU / 60);
    const speed = THREE.MathUtils.lerp(
      currentSpeed,
      targetSpeed,
      1 - Math.exp(-delta * 4.5),
    );
    group.userData.rotationSpeed = speed;
    group.rotation.y += delta * speed;

    const targetColor = isElementPillar(activePillar)
      ? SILVER.clone().lerp(
          new THREE.Color(COMMAND_PILLAR_COLORS[activePillar]),
          0.15,
        )
      : SILVER;
    if (lineMaterial) {
      lineMaterial.color.lerp(targetColor, 1 - Math.exp(-delta * 3));
      lineMaterial.opacity = THREE.MathUtils.lerp(
        lineMaterial.opacity,
        activePillar === "none" ? (isMobile ? 0.5 : 0.4) : 0.6,
        1 - Math.exp(-delta * 3),
      );
    }
  });

  const activate = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onActivate();
  };

  return (
    <primitive
      ref={groupRef}
      object={globe.group}
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
