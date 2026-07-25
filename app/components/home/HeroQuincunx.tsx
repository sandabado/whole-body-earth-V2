"use client";

import { useEffect, useRef } from "react";
import {
  COMMAND_PILLAR_COLORS,
  type ActivePillar,
} from "../HeroEngine/config";
type Vector3 = Readonly<{ x: number; y: number; z: number }>;
type Point2 = Readonly<{ x: number; y: number }>;
type Edge = readonly [from: number, to: number];
type Face = readonly number[];
type RGB = readonly [red: number, green: number, blue: number];
type QuincunxPosition = "top" | "left" | "right" | "bottom" | "center";
type ElementPillar = Exclude<ActivePillar, "none" | "whole">;

interface SolidDefinition {
  name: string;
  element: string;
  pillar: ElementPillar;
  position: QuincunxPosition;
  color: RGB;
  vertices: readonly Vector3[];
  faces: readonly Face[];
  edges: readonly Edge[];
  revealAt: number;
  rotation: Vector3;
  phase: number;
}

interface ProjectedVertex extends Point2 {
  depth: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  phase: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const STATIC_TIME = 9;
const MAX_DEVICE_PIXEL_RATIO = 2;
const CONNECTIONS: readonly Edge[] = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
];

const TETRAHEDRON_VERTICES: readonly Vector3[] = [
  { x: 1, y: 1, z: 1 },
  { x: -1, y: -1, z: 1 },
  { x: -1, y: 1, z: -1 },
  { x: 1, y: -1, z: -1 },
];

const TETRAHEDRON_FACES: readonly Face[] = [
  [0, 2, 1],
  [0, 1, 3],
  [0, 3, 2],
  [1, 2, 3],
];

const OCTAHEDRON_VERTICES: readonly Vector3[] = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 },
];

const OCTAHEDRON_FACES: readonly Face[] = [
  [0, 2, 4],
  [0, 5, 2],
  [0, 4, 3],
  [0, 3, 5],
  [1, 4, 2],
  [1, 2, 5],
  [1, 3, 4],
  [1, 5, 3],
];

const CUBE_VERTICES: readonly Vector3[] = [
  { x: -1, y: -1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
];

const CUBE_FACES: readonly Face[] = [
  [0, 3, 2, 1],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [1, 2, 6, 5],
  [2, 3, 7, 6],
  [3, 0, 4, 7],
];

const ICOSAHEDRON_VERTICES: readonly Vector3[] = [
  { x: -1, y: PHI, z: 0 },
  { x: 1, y: PHI, z: 0 },
  { x: -1, y: -PHI, z: 0 },
  { x: 1, y: -PHI, z: 0 },
  { x: 0, y: -1, z: PHI },
  { x: 0, y: 1, z: PHI },
  { x: 0, y: -1, z: -PHI },
  { x: 0, y: 1, z: -PHI },
  { x: PHI, y: 0, z: -1 },
  { x: PHI, y: 0, z: 1 },
  { x: -PHI, y: 0, z: -1 },
  { x: -PHI, y: 0, z: 1 },
];

// Twenty outward-wound triangular faces. The winding is intentional: it keeps
// face lighting and edge depth stable as the water body rotates.
const ICOSAHEDRON_FACES: readonly Face[] = [
  [0, 11, 5],
  [0, 5, 1],
  [0, 1, 7],
  [0, 7, 10],
  [0, 10, 11],
  [1, 5, 9],
  [5, 11, 4],
  [11, 10, 2],
  [10, 7, 6],
  [7, 1, 8],
  [3, 9, 4],
  [3, 4, 2],
  [3, 2, 6],
  [3, 6, 8],
  [3, 8, 9],
  [4, 9, 5],
  [2, 4, 11],
  [6, 2, 10],
  [8, 6, 7],
  [9, 8, 1],
];

const DODECAHEDRON_VERTICES: readonly Vector3[] = [
  { x: 1, y: 1, z: 1 },
  { x: 1, y: 1, z: -1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: -1, z: -1 },
  { x: -1, y: 1, z: 1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: -1, y: -1, z: -1 },
  { x: 0, y: 1 / PHI, z: PHI },
  { x: 0, y: 1 / PHI, z: -PHI },
  { x: 0, y: -1 / PHI, z: PHI },
  { x: 0, y: -1 / PHI, z: -PHI },
  { x: 1 / PHI, y: PHI, z: 0 },
  { x: -1 / PHI, y: PHI, z: 0 },
  { x: 1 / PHI, y: -PHI, z: 0 },
  { x: -1 / PHI, y: -PHI, z: 0 },
  { x: PHI, y: 0, z: 1 / PHI },
  { x: PHI, y: 0, z: -1 / PHI },
  { x: -PHI, y: 0, z: 1 / PHI },
  { x: -PHI, y: 0, z: -1 / PHI },
];

function normalizedVertices(vertices: readonly Vector3[]): readonly Vector3[] {
  const radius = Math.max(...vertices.map(({ x, y, z }) => Math.hypot(x, y, z)));
  return vertices.map(({ x, y, z }) => ({
    x: x / radius,
    y: y / radius,
    z: z / radius,
  }));
}

function edgesFromFaces(faces: readonly Face[]): readonly Edge[] {
  const edges = new Map<string, Edge>();

  for (const face of faces) {
    for (let index = 0; index < face.length; index += 1) {
      const from = face[index];
      const to = face[(index + 1) % face.length];
      const low = Math.min(from, to);
      const high = Math.max(from, to);
      edges.set(`${low}:${high}`, [low, high]);
    }
  }

  return [...edges.values()];
}

function convexFaces(vertices: readonly Vector3[]): readonly Face[] {
  const faces = new Map<string, number[]>();
  const epsilon = 1e-6;

  for (let first = 0; first < vertices.length - 2; first += 1) {
    for (let second = first + 1; second < vertices.length - 1; second += 1) {
      for (let third = second + 1; third < vertices.length; third += 1) {
        const a = vertices[first];
        const b = vertices[second];
        const c = vertices[third];
        const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
        const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
        let normal = {
          x: ab.y * ac.z - ab.z * ac.y,
          y: ab.z * ac.x - ab.x * ac.z,
          z: ab.x * ac.y - ab.y * ac.x,
        };
        const normalLength = Math.hypot(normal.x, normal.y, normal.z);
        if (normalLength < epsilon) continue;
        normal = {
          x: normal.x / normalLength,
          y: normal.y / normalLength,
          z: normal.z / normalLength,
        };

        const distances = vertices.map(
          (vertex) =>
            (vertex.x - a.x) * normal.x +
            (vertex.y - a.y) * normal.y +
            (vertex.z - a.z) * normal.z,
        );
        const supportsHull =
          distances.every((distance) => distance <= epsilon) ||
          distances.every((distance) => distance >= -epsilon);
        if (!supportsHull) continue;

        const coplanar = distances.flatMap((distance, index) =>
          Math.abs(distance) <= epsilon ? [index] : [],
        );
        if (coplanar.length !== 5) continue;

        const key = [...coplanar].sort((left, right) => left - right).join(":");
        if (faces.has(key)) continue;

        const center = coplanar.reduce(
          (point, index) => ({
            x: point.x + vertices[index].x / coplanar.length,
            y: point.y + vertices[index].y / coplanar.length,
            z: point.z + vertices[index].z / coplanar.length,
          }),
          { x: 0, y: 0, z: 0 },
        );
        if (center.x * normal.x + center.y * normal.y + center.z * normal.z < 0) {
          normal = { x: -normal.x, y: -normal.y, z: -normal.z };
        }

        const seed = vertices[coplanar[0]];
        const axisXLength = Math.hypot(
          seed.x - center.x,
          seed.y - center.y,
          seed.z - center.z,
        );
        const axisX = {
          x: (seed.x - center.x) / axisXLength,
          y: (seed.y - center.y) / axisXLength,
          z: (seed.z - center.z) / axisXLength,
        };
        const axisY = {
          x: normal.y * axisX.z - normal.z * axisX.y,
          y: normal.z * axisX.x - normal.x * axisX.z,
          z: normal.x * axisX.y - normal.y * axisX.x,
        };
        const ordered = [...coplanar].sort((left, right) => {
          const leftVertex = vertices[left];
          const rightVertex = vertices[right];
          const leftRelative = {
            x: leftVertex.x - center.x,
            y: leftVertex.y - center.y,
            z: leftVertex.z - center.z,
          };
          const rightRelative = {
            x: rightVertex.x - center.x,
            y: rightVertex.y - center.y,
            z: rightVertex.z - center.z,
          };
          const leftAngle = Math.atan2(
            leftRelative.x * axisY.x +
              leftRelative.y * axisY.y +
              leftRelative.z * axisY.z,
            leftRelative.x * axisX.x +
              leftRelative.y * axisX.y +
              leftRelative.z * axisX.z,
          );
          const rightAngle = Math.atan2(
            rightRelative.x * axisY.x +
              rightRelative.y * axisY.y +
              rightRelative.z * axisY.z,
            rightRelative.x * axisX.x +
              rightRelative.y * axisX.y +
              rightRelative.z * axisX.z,
          );
          return leftAngle - rightAngle;
        });
        faces.set(key, ordered);
      }
    }
  }

  return [...faces.values()];
}

function makeSolid(
  definition: Omit<SolidDefinition, "vertices" | "edges"> & {
    vertices: readonly Vector3[];
    edges?: readonly Edge[];
  },
): SolidDefinition {
  return {
    ...definition,
    vertices: normalizedVertices(definition.vertices),
    edges: definition.edges ?? edgesFromFaces(definition.faces),
  };
}

const dodecahedronFaces = convexFaces(DODECAHEDRON_VERTICES);

if (dodecahedronFaces.length !== 12 || edgesFromFaces(dodecahedronFaces).length !== 30) {
  throw new Error("Dodecahedron topology invariant failed");
}

function hexToRgb(hex: string): RGB {
  const value = Number.parseInt(hex.slice(1), 16);
  return [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
  ];
}

const SOLID_COLORS = {
  presence: hexToRgb(COMMAND_PILLAR_COLORS.presence),
  press: hexToRgb(COMMAND_PILLAR_COLORS.press),
  studios: hexToRgb(COMMAND_PILLAR_COLORS.studios),
  foundation: hexToRgb(COMMAND_PILLAR_COLORS.foundation),
  guardian: hexToRgb(COMMAND_PILLAR_COLORS.guardian),
} satisfies Record<ElementPillar, RGB>;

// Array order also defines the semantic quincunx layout used by CONNECTIONS:
// top, left, right, bottom, and the witnessing center.
const SOLIDS: readonly SolidDefinition[] = [
  makeSolid({
    name: "Octahedron",
    element: "Air",
    pillar: "press",
    position: "top",
    color: SOLID_COLORS.press,
    vertices: OCTAHEDRON_VERTICES,
    faces: OCTAHEDRON_FACES,
    revealAt: 3.05,
    rotation: { x: 0.17, y: 0.26, z: 0.06 },
    phase: 0.8,
  }),
  makeSolid({
    name: "Tetrahedron",
    element: "Fire",
    pillar: "presence",
    position: "left",
    color: SOLID_COLORS.presence,
    vertices: TETRAHEDRON_VERTICES,
    faces: TETRAHEDRON_FACES,
    revealAt: 3.7,
    rotation: { x: -0.21, y: 0.31, z: 0.08 },
    phase: 2.2,
  }),
  makeSolid({
    name: "Icosahedron",
    element: "Water",
    pillar: "studios",
    position: "right",
    color: SOLID_COLORS.studios,
    vertices: ICOSAHEDRON_VERTICES,
    faces: ICOSAHEDRON_FACES,
    revealAt: 4.35,
    rotation: { x: 0.12, y: -0.22, z: 0.05 },
    phase: 3.7,
  }),
  makeSolid({
    name: "Cube",
    element: "Earth",
    pillar: "foundation",
    position: "bottom",
    color: SOLID_COLORS.foundation,
    vertices: CUBE_VERTICES,
    faces: CUBE_FACES,
    revealAt: 5,
    rotation: { x: -0.13, y: 0.2, z: -0.045 },
    phase: 5.1,
  }),
  makeSolid({
    name: "Dodecahedron",
    element: "Ether",
    pillar: "guardian",
    position: "center",
    color: SOLID_COLORS.guardian,
    vertices: DODECAHEDRON_VERTICES,
    faces: dodecahedronFaces,
    revealAt: 0.35,
    rotation: { x: 0.08, y: 0.14, z: 0.025 },
    phase: 0,
  }),
];

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

function makeStarfield(count: number): readonly Star[] {
  const random = seededRandom(0x5eedc0de);
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random(),
    radius: 0.35 + random() * 0.8,
    opacity: 0.15 + random() * 0.5,
    phase: random() * TAU,
  }));
}

const STARFIELD = makeStarfield(112);

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothstep(start: number, end: number, value: number): number {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

function easeOutCubic(value: number): number {
  return 1 - (1 - value) ** 3;
}

function isElementPillar(pillar: ActivePillar): pillar is ElementPillar {
  return pillar !== "none" && pillar !== "whole";
}

function focusTargets(
  activePillar: ActivePillar,
  motionTime: number,
  reducedMotion: boolean,
): number[] {
  if (isElementPillar(activePillar)) {
    return SOLIDS.map((solid) => solid.pillar === activePillar ? 1 : 0.15);
  }

  if (activePillar === "whole") {
    if (reducedMotion) return SOLIDS.map(() => 0.58);
    return SOLIDS.map((_, index) => {
      const wave = Math.sin(motionTime * 0.72 - index * (TAU / SOLIDS.length)) * 0.5 + 0.5;
      return 0.3 + wave * wave * 0.7;
    });
  }

  return SOLIDS.map(() => 0.3);
}

function rgba([red, green, blue]: RGB, alpha: number): string {
  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha)})`;
}

function rotate(vertex: Vector3, xAngle: number, yAngle: number, zAngle: number): Vector3 {
  const cosX = Math.cos(xAngle);
  const sinX = Math.sin(xAngle);
  const yAfterX = vertex.y * cosX - vertex.z * sinX;
  const zAfterX = vertex.y * sinX + vertex.z * cosX;

  const cosY = Math.cos(yAngle);
  const sinY = Math.sin(yAngle);
  const xAfterY = vertex.x * cosY - zAfterX * sinY;
  const zAfterY = vertex.x * sinY + zAfterX * cosY;

  const cosZ = Math.cos(zAngle);
  const sinZ = Math.sin(zAngle);
  return {
    x: xAfterY * cosZ - yAfterX * sinZ,
    y: xAfterY * sinZ + yAfterX * cosZ,
    z: zAfterY,
  };
}

function project(vertex: Vector3, center: Point2, radiusInPixels: number): ProjectedVertex {
  const cameraDistance = 4.2;
  const perspective = cameraDistance / (cameraDistance - vertex.z);
  return {
    x: center.x + vertex.x * radiusInPixels * perspective,
    y: center.y - vertex.y * radiusInPixels * perspective,
    depth: vertex.z,
  };
}

function nodePosition(
  position: QuincunxPosition,
  center: Point2,
  orbitRadius: number,
  elapsed: number,
  phase: number,
  reducedMotion: boolean,
): Point2 {
  const offsets: Record<QuincunxPosition, Point2> = {
    top: { x: 0, y: -orbitRadius },
    left: { x: -orbitRadius, y: 0 },
    right: { x: orbitRadius, y: 0 },
    bottom: { x: 0, y: orbitRadius },
    center: { x: 0, y: 0 },
  };
  const offset = offsets[position];
  const commonX = reducedMotion ? 0 : Math.cos(elapsed * 0.22) * 2.2;
  const commonY = reducedMotion ? 0 : Math.sin(elapsed * 0.34) * 5;
  const independentY = reducedMotion ? 0 : Math.sin(elapsed * 0.62 + phase) * 2.8;

  return {
    x: center.x + offset.x + commonX,
    y: center.y + offset.y + commonY + independentY,
  };
}

function drawGlow(
  context: CanvasRenderingContext2D,
  center: Point2,
  radius: number,
  color: RGB,
  alpha: number,
): void {
  const glow = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
  glow.addColorStop(0, rgba(color, alpha));
  glow.addColorStop(0.25, rgba(color, alpha * 0.36));
  glow.addColorStop(1, rgba(color, 0));
  context.fillStyle = glow;
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, TAU);
  context.fill();
}

function drawSolid(
  context: CanvasRenderingContext2D,
  solid: SolidDefinition,
  solidIndex: number,
  center: Point2,
  radiusInPixels: number,
  revealElapsed: number,
  motionElapsed: number,
  reducedMotion: boolean,
  focusIntensity: number,
): void {
  const pointReveal = smoothstep(solid.revealAt, solid.revealAt + 0.32, revealElapsed);
  const geometryReveal = smoothstep(solid.revealAt + 0.25, solid.revealAt + 1.45, revealElapsed);
  if (pointReveal <= 0) return;

  const pulse = reducedMotion ? 0 : Math.sin(motionElapsed * 1.08 + solid.phase) * 0.5 + 0.5;
  const emergenceScale = 0.045 + easeOutCubic(geometryReveal) * 0.955;
  const breathingScale = reducedMotion ? 1 : 0.985 + pulse * 0.03;
  const renderedRadius = radiusInPixels * emergenceScale * breathingScale;

  context.save();
  context.globalCompositeOperation = "screen";
  drawGlow(
    context,
    center,
    Math.max(12, radiusInPixels * (1.55 + pulse * 0.28)),
    solid.color,
    pointReveal * focusIntensity * (0.08 + pulse * 0.035),
  );
  drawGlow(
    context,
    center,
    Math.max(2, 2.2 + geometryReveal * 2.6),
    solid.color,
    pointReveal * focusIntensity * (0.82 - geometryReveal * 0.34),
  );
  context.restore();

  if (geometryReveal <= 0.005) return;

  const animationTime = reducedMotion ? solid.phase * 0.7 + 2.4 : motionElapsed;
  const baseTilt = solidIndex === 4 ? 0.28 : 0.18;
  const rotatedVertices = solid.vertices.map((vertex) =>
    rotate(
      vertex,
      baseTilt + animationTime * solid.rotation.x + solid.phase * 0.08,
      0.42 + animationTime * solid.rotation.y + solid.phase * 0.11,
      animationTime * solid.rotation.z,
    ),
  );
  const projectedVertices = rotatedVertices.map((vertex) =>
    project(vertex, center, renderedRadius),
  );

  const sortedFaces = solid.faces
    .map((face) => ({
      face,
      depth: face.reduce((total, index) => total + rotatedVertices[index].z, 0) / face.length,
    }))
    .sort((left, right) => left.depth - right.depth);

  context.save();
  for (const { face, depth } of sortedFaces) {
    const light = clamp((depth + 1) / 2);
    context.beginPath();
    face.forEach((vertexIndex, index) => {
      const point = projectedVertices[vertexIndex];
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.closePath();
    context.fillStyle = rgba(
      solid.color,
      geometryReveal * focusIntensity * (0.025 + light * 0.105),
    );
    context.fill();
  }
  context.restore();

  const sortedEdges = solid.edges
    .map((edge) => ({
      edge,
      depth: (rotatedVertices[edge[0]].z + rotatedVertices[edge[1]].z) / 2,
    }))
    .sort((left, right) => left.depth - right.depth);

  context.save();
  context.globalCompositeOperation = "screen";
  context.lineCap = "round";
  for (const { edge, depth } of sortedEdges) {
    const from = projectedVertices[edge[0]];
    const to = projectedVertices[edge[1]];
    const light = clamp((depth + 1) / 2);
    context.strokeStyle = rgba(
      solid.color,
      geometryReveal * focusIntensity * (0.2 + light * 0.62),
    );
    context.lineWidth = 0.55 + light * 0.75;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }
  context.restore();
}

function drawConnections(
  context: CanvasRenderingContext2D,
  positions: readonly Point2[],
  revealElapsed: number,
  motionElapsed: number,
  reducedMotion: boolean,
  focusLevels: readonly number[],
): void {
  context.save();
  context.globalCompositeOperation = "screen";
  context.lineCap = "round";

  CONNECTIONS.forEach(([fromIndex, toIndex], connectionIndex) => {
    const from = positions[fromIndex];
    const to = positions[toIndex];
    const lineReveal = smoothstep(
      4.65 + connectionIndex * 0.25,
      5.8 + connectionIndex * 0.25,
      revealElapsed,
    );
    const nodeReveal = Math.min(
      smoothstep(SOLIDS[fromIndex].revealAt, SOLIDS[fromIndex].revealAt + 0.8, revealElapsed),
      smoothstep(SOLIDS[toIndex].revealAt, SOLIDS[toIndex].revealAt + 0.8, revealElapsed),
    );
    const connectionFocus = (focusLevels[fromIndex] + focusLevels[toIndex]) * 0.5;
    const alpha = lineReveal * nodeReveal * connectionFocus;
    if (alpha <= 0.002) return;

    const lineGradient = context.createLinearGradient(from.x, from.y, to.x, to.y);
    lineGradient.addColorStop(0, rgba(SOLIDS[fromIndex].color, alpha * 0.08));
    lineGradient.addColorStop(0.5, rgba([151, 118, 255], alpha * 0.24));
    lineGradient.addColorStop(1, rgba(SOLIDS[toIndex].color, alpha * 0.08));
    context.strokeStyle = lineGradient;
    context.lineWidth = 0.8;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();

    const travel = reducedMotion
      ? (connectionIndex * 0.137 + 0.34) % 1
      : (motionElapsed * 0.14 + connectionIndex * 0.137) % 1;
    const pulseX = from.x + (to.x - from.x) * travel;
    const pulseY = from.y + (to.y - from.y) * travel;
    const endpointFade = Math.sin(travel * Math.PI);
    const pulseAlpha = alpha * endpointFade;
    drawGlow(
      context,
      { x: pulseX, y: pulseY },
      7,
      [151, 118, 255],
      pulseAlpha * 0.72,
    );
  });

  context.restore();
}

function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  revealElapsed: number,
  motionElapsed: number,
  reducedMotion: boolean,
  focusLevels: readonly number[],
  opaqueBackground: boolean,
): void {
  context.clearRect(0, 0, width, height);

  const center = { x: width / 2, y: height / 2 };
  const background = context.createRadialGradient(
    center.x,
    center.y,
    0,
    center.x,
    center.y,
    Math.max(width, height) * 0.72,
  );
  if (opaqueBackground) {
    background.addColorStop(0, "#090811");
    background.addColorStop(0.45, "#040407");
    background.addColorStop(1, "#000000");
  } else {
    background.addColorStop(0, "rgba(9, 8, 17, 0.16)");
    background.addColorStop(0.48, "rgba(4, 4, 7, 0.06)");
    background.addColorStop(1, "rgba(0, 0, 0, 0)");
  }
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const skyReveal = smoothstep(0.5, 4.2, revealElapsed);
  for (const star of STARFIELD) {
    const twinkle = reducedMotion ? 0.78 : 0.68 + Math.sin(motionElapsed * 0.46 + star.phase) * 0.22;
    const alpha = skyReveal * star.opacity * twinkle;
    context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    context.beginPath();
    context.arc(star.x * width, star.y * height, star.radius, 0, TAU);
    context.fill();
  }

  const orbitRadius = Math.min(270, Math.max(36, Math.min(width * 0.31, height * 0.255)));
  const positions = SOLIDS.map((solid) =>
    nodePosition(
      solid.position,
      center,
      orbitRadius,
      motionElapsed,
      solid.phase,
      reducedMotion,
    ),
  );

  drawConnections(
    context,
    positions,
    revealElapsed,
    motionElapsed,
    reducedMotion,
    focusLevels,
  );

  SOLIDS.forEach((solid, index) => {
    const baseRadius = solid.position === "center"
      ? Math.min(82, Math.max(24, orbitRadius * 0.34))
      : Math.min(58, Math.max(17, orbitRadius * 0.235));
    drawSolid(
      context,
      solid,
      index,
      positions[index],
      baseRadius,
      revealElapsed,
      motionElapsed,
      reducedMotion,
      focusLevels[index],
    );
  });
}

type HeroQuincunxProps = {
  activePillar?: ActivePillar;
  opaqueBackground?: boolean;
};

export function HeroQuincunx({
  activePillar = "none",
  opaqueBackground = false,
}: HeroQuincunxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activePillarRef = useRef<ActivePillar>(activePillar);
  const redrawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    activePillarRef.current = activePillar;
    redrawRef.current?.();
  }, [activePillar]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: !opaqueBackground });
    if (!context) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionPreference.matches;
    let width = 1;
    let height = 1;
    let revealElapsed = reducedMotion ? STATIC_TIME : 0;
    let motionElapsed = reducedMotion ? STATIC_TIME : 0;
    let motionRate = isElementPillar(activePillarRef.current) ? 0.45 : 1;
    let focusLevels = focusTargets(
      activePillarRef.current,
      motionElapsed,
      reducedMotion,
    );
    let lastFrameTime = 0;
    let animationFrame: number | null = null;
    let disposed = false;
    let isVisible = true;
    let lastRenderedAt = 0;

    const updateFocus = (delta: number, immediate = false) => {
      const targets = focusTargets(
        activePillarRef.current,
        motionElapsed,
        reducedMotion,
      );
      const blend = immediate ? 1 : 1 - Math.exp(-delta * 2.1);
      focusLevels = focusLevels.map((level, index) =>
        level + (targets[index] - level) * blend
      );
    };

    const render = () => {
      if (reducedMotion) updateFocus(0, true);
      drawScene(
        context,
        width,
        height,
        reducedMotion ? STATIC_TIME : revealElapsed,
        reducedMotion ? STATIC_TIME : motionElapsed,
        reducedMotion,
        focusLevels,
        opaqueBackground,
      );
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const nextWidth = Math.max(1, bounds.width);
      const nextHeight = Math.max(1, bounds.height);
      const pixelRatio = Math.min(
        MAX_DEVICE_PIXEL_RATIO,
        Math.max(1, window.devicePixelRatio || 1),
      );
      const backingWidth = Math.max(1, Math.round(nextWidth * pixelRatio));
      const backingHeight = Math.max(1, Math.round(nextHeight * pixelRatio));

      if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
        canvas.width = backingWidth;
        canvas.height = backingHeight;
      }

      context.resetTransform();
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      width = nextWidth;
      height = nextHeight;
      render();
    };

    const stopAnimation = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      lastFrameTime = 0;
    };

    const animate = (time: number) => {
      animationFrame = null;
      if (disposed || reducedMotion || document.hidden || !isVisible) return;

      if (time - lastRenderedAt < 1_000 / 60) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      if (lastFrameTime > 0) {
        const delta = Math.min((time - lastFrameTime) / 1_000, 0.1);
        revealElapsed += delta;
        const targetMotionRate = isElementPillar(activePillarRef.current) ? 0.45 : 1;
        const motionBlend = 1 - Math.exp(-delta * 1.45);
        motionRate += (targetMotionRate - motionRate) * motionBlend;
        motionElapsed += delta * motionRate;
        updateFocus(delta);
      }
      lastFrameTime = time;
      lastRenderedAt = time;
      render();
      animationFrame = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (
        disposed ||
        reducedMotion ||
        document.hidden ||
        !isVisible ||
        animationFrame !== null
      ) {
        return;
      }
      lastFrameTime = 0;
      animationFrame = requestAnimationFrame(animate);
    };

    const requestRedraw = () => {
      if (disposed) return;
      if (reducedMotion) {
        render();
        return;
      }
      startAnimation();
    };
    redrawRef.current = requestRedraw;

    const handleVisibilityChange = () => {
      if (document.hidden) stopAnimation();
      else if (reducedMotion) render();
      else startAnimation();
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      stopAnimation();
      if (reducedMotion) {
        revealElapsed = STATIC_TIME;
        motionElapsed = STATIC_TIME;
        motionRate = isElementPillar(activePillarRef.current) ? 0.45 : 1;
        render();
      } else {
        // Resume in the fully awakened state instead of replaying an unexpected
        // eight-second entrance when a preference changes at runtime.
        revealElapsed = Math.max(revealElapsed, STATIC_TIME);
        motionElapsed = Math.max(motionElapsed, STATIC_TIME);
        startAnimation();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (reducedMotion) render();
          else startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.01 },
    );
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionPreference.addEventListener("change", handleMotionPreference);

    resize();
    startAnimation();

    return () => {
      disposed = true;
      if (redrawRef.current === requestRedraw) redrawRef.current = null;
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionPreference.removeEventListener("change", handleMotionPreference);
    };
  }, [opaqueBackground]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      data-active-pillar={activePillar}
      aria-label="The Whole Body Earth quincunx: Air and Press above, Fire and Presence left, Water and Studios right, Earth and Foundation below, and Ether and Guardian at the center."
      className="h-full w-full"
      style={{
        background: opaqueBackground
          ? "radial-gradient(circle at center, #090811 0%, #020204 52%, #000 100%)"
          : "transparent",
        display: "block",
        height: "100%",
        pointerEvents: "none",
        width: "100%",
      }}
    >
      A luminous quincunx of five Platonic solids representing the five Whole
      Body Earth pillars.
    </canvas>
  );
}
