"use client";

import { useMemo } from "react";
import * as THREE from "three";

type PlatonicEdgesProps = {
  geometry: THREE.BufferGeometry;
  color: THREE.ColorRepresentation;
  opacity?: number;
  renderOrder?: number;
};

/** Keeps all Platonic edges visible through transparent solid faces. */
export function PlatonicEdges({
  geometry,
  color,
  opacity = 1,
  renderOrder = 1,
}: PlatonicEdgesProps) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);

  return (
    <lineSegments geometry={edges} renderOrder={renderOrder}>
      <lineBasicMaterial
        color={color}
        depthTest={false}
        depthWrite={false}
        opacity={opacity}
        toneMapped={false}
        transparent
      />
    </lineSegments>
  );
}
