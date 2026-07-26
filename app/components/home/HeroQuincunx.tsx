"use client";

import { useEffect, useRef } from "react";
import {
  COMMAND_PILLAR_COLORS,
  type ActivePillar,
} from "../HeroEngine/config";
import styles from "./HeroQuincunx.module.css";
type Vector3 = Readonly<{ x: number; y: number; z: number }>;
type Point2 = Readonly<{ x: number; y: number }>;
type Edge = readonly [from: number, to: number];
type Face = readonly number[];
type RGB = readonly [red: number, green: number, blue: number];
type ElementPillar = Exclude<ActivePillar, "none" | "whole">;

const PILLAR_TURN_SLOT: Record<ElementPillar, number> = {
  presence: 0,
  press: 1,
  studios: 2,
  foundation: 3,
  guardian: 4,
};

interface SolidDefinition {
  name: string;
  element: string;
  pillar: ElementPillar;
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

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const STATIC_TIME = 9;
const MAX_DEVICE_PIXEL_RATIO = 2;
const FOCUS_TRANSITION_SECONDS = 0.4;
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
const WHOLE_COLOR = hexToRgb(COMMAND_PILLAR_COLORS.whole);
const DEFAULT_GOLD_COLOR = hexToRgb("#D4AF37");

// Array order follows the five-field sequence and supplies the geometry used
// by the one-at-a-time center instrument.
const SOLIDS: readonly SolidDefinition[] = [
  makeSolid({
    name: "Octahedron",
    element: "Air",
    pillar: "press",
    color: SOLID_COLORS.press,
    vertices: OCTAHEDRON_VERTICES,
    faces: OCTAHEDRON_FACES,
    revealAt: 0.35,
    rotation: { x: 0.17, y: 0.26, z: 0.06 },
    phase: 0.8,
  }),
  makeSolid({
    name: "Tetrahedron",
    element: "Fire",
    pillar: "presence",
    color: SOLID_COLORS.presence,
    vertices: TETRAHEDRON_VERTICES,
    faces: TETRAHEDRON_FACES,
    revealAt: 0.35,
    rotation: { x: -0.21, y: 0.31, z: 0.08 },
    phase: 2.2,
  }),
  makeSolid({
    name: "Icosahedron",
    element: "Water",
    pillar: "studios",
    color: SOLID_COLORS.studios,
    vertices: ICOSAHEDRON_VERTICES,
    faces: ICOSAHEDRON_FACES,
    revealAt: 0.35,
    rotation: { x: 0.12, y: -0.22, z: 0.05 },
    phase: 3.7,
  }),
  makeSolid({
    name: "Cube",
    element: "Earth",
    pillar: "foundation",
    color: SOLID_COLORS.foundation,
    vertices: CUBE_VERTICES,
    faces: CUBE_FACES,
    revealAt: 0.35,
    rotation: { x: -0.13, y: 0.2, z: -0.045 },
    phase: 5.1,
  }),
  makeSolid({
    name: "Dodecahedron",
    element: "Ether",
    pillar: "guardian",
    color: SOLID_COLORS.guardian,
    vertices: DODECAHEDRON_VERTICES,
    faces: dodecahedronFaces,
    revealAt: 0.35,
    rotation: { x: 0.08, y: 0.14, z: 0.025 },
    phase: 0,
  }),
];

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

function focusTargets(activePillar: ActivePillar): number[] {
  if (isElementPillar(activePillar)) {
    return SOLIDS.map((solid) => solid.pillar === activePillar ? 1 : 0);
  }

  if (activePillar === "whole") {
    return SOLIDS.map((solid) => solid.pillar === "guardian" ? 1 : 0);
  }

  return SOLIDS.map((solid) => solid.pillar === "guardian" ? 1 : 0);
}

function nextFullTurn(current: number, pillar: ElementPillar): number {
  const step = TAU / 5;
  const desired = PILLAR_TURN_SLOT[pillar] * step;
  const normalized = ((current % TAU) + TAU) % TAU;
  const alignment = (desired - normalized + TAU) % TAU;
  return current + TAU + alignment;
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
  renderColor: RGB = solid.color,
  rotationOverrideY: number | null = null,
  displayScale = 1,
  emphasized = false,
): void {
  const pointReveal = smoothstep(solid.revealAt, solid.revealAt + 0.32, revealElapsed);
  const geometryReveal = smoothstep(solid.revealAt + 0.25, solid.revealAt + 1.45, revealElapsed);
  if (pointReveal <= 0) return;

  const pulse = reducedMotion ? 0 : Math.sin(motionElapsed * 1.08 + solid.phase) * 0.5 + 0.5;
  const emergenceScale = 0.045 + easeOutCubic(geometryReveal) * 0.955;
  const breathingScale = reducedMotion ? 1 : 0.985 + pulse * 0.03;
  const renderedRadius = radiusInPixels
    * emergenceScale
    * breathingScale
    * displayScale;

  context.save();
  context.globalCompositeOperation = "screen";
  drawGlow(
    context,
    center,
    Math.max(12, radiusInPixels * (1.55 + pulse * 0.28)),
    renderColor,
    pointReveal * focusIntensity * (0.16 + pulse * 0.07),
  );
  drawGlow(
    context,
    center,
    Math.max(2, 2.2 + geometryReveal * 2.6),
    renderColor,
    pointReveal * focusIntensity * (0.96 - geometryReveal * 0.26),
  );
  context.restore();

  if (geometryReveal <= 0.005) return;

  const animationTime = reducedMotion ? solid.phase * 0.7 + 2.4 : motionElapsed;
  const baseTilt = solidIndex === 4 ? 0.28 : 0.18;
  const animatedY = rotationOverrideY
    ?? 0.42 + animationTime * solid.rotation.y + solid.phase * 0.11;
  const rotatedVertices = solid.vertices.map((vertex) =>
    rotate(
      vertex,
      baseTilt + animationTime * solid.rotation.x + solid.phase * 0.08,
      animatedY,
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
  const solidity = emphasized ? 1.85 : 1;
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
      renderColor,
      geometryReveal * focusIntensity * solidity * (0.055 + light * 0.16),
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
  context.shadowColor = rgba(renderColor, (emphasized ? 0.92 : 0.72) * focusIntensity);
  context.shadowBlur = (emphasized ? 15 : 8) + focusIntensity * 10;
  for (const { edge, depth } of sortedEdges) {
    const from = projectedVertices[edge[0]];
    const to = projectedVertices[edge[1]];
    const light = clamp((depth + 1) / 2);
    context.strokeStyle = rgba(
      renderColor,
      geometryReveal * focusIntensity * (0.4 + light * 0.58),
    );
    context.lineWidth = (emphasized ? 1.35 : 1.05) + light * 1.15;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }
  context.restore();

  context.save();
  context.globalCompositeOperation = "screen";
  for (const point of projectedVertices) {
    const light = clamp((point.depth + 1) / 2);
    context.fillStyle = rgba(
      renderColor,
      geometryReveal * focusIntensity * (0.62 + light * 0.34),
    );
    context.beginPath();
    context.arc(point.x, point.y, 1.35 + light * 1.15, 0, TAU);
    context.fill();
  }
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
  activePillar: ActivePillar,
  dodecaTurn: number | null,
  opaqueBackground: boolean,
): void {
  context.clearRect(0, 0, width, height);

  const center = { x: width / 2, y: height / 2 };
  if (opaqueBackground) {
    const background = context.createRadialGradient(
      center.x,
      center.y,
      0,
      center.x,
      center.y,
      Math.max(width, height) * 0.72,
    );
    background.addColorStop(0, "#090811");
    background.addColorStop(0.45, "#040407");
    background.addColorStop(1, "#000000");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
  }

  const centerDrift = {
    x: center.x + (reducedMotion ? 0 : Math.cos(motionElapsed * 0.22) * 1.6),
    y: center.y + (reducedMotion ? 0 : Math.sin(motionElapsed * 0.34) * 2.4),
  };
  const baseRadius = Math.min(
    116,
    Math.max(46, Math.min(width, height) * 0.16),
  );

  SOLIDS.forEach((solid, index) => {
    const renderColor = activePillar === "whole"
      ? WHOLE_COLOR
      : activePillar === "none" && solid.pillar === "guardian"
        ? DEFAULT_GOLD_COLOR
        : solid.color;
    drawSolid(
      context,
      solid,
      index,
      centerDrift,
      baseRadius,
      revealElapsed,
      motionElapsed,
      reducedMotion,
      focusLevels[index],
      renderColor,
      isElementPillar(activePillar) && solid.pillar === activePillar
        ? dodecaTurn
        : null,
      0.82 + focusLevels[index] * 0.14,
      isElementPillar(activePillar) && solid.pillar === activePillar,
    );
  });
}

type HeroQuincunxProps = {
  activePillar?: ActivePillar;
  turnPillar?: ElementPillar | null;
  opaqueBackground?: boolean;
};

export function HeroQuincunx({
  activePillar = "none",
  turnPillar = null,
  opaqueBackground = false,
}: HeroQuincunxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activePillarRef = useRef<ActivePillar>(activePillar);
  const turnPillarRef = useRef<ElementPillar | null>(turnPillar);
  const redrawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    activePillarRef.current = activePillar;
    redrawRef.current?.();
  }, [activePillar]);

  useEffect(() => {
    turnPillarRef.current = turnPillar;
    redrawRef.current?.();
  }, [turnPillar]);

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
    let dodecaTurn: number | null = null;
    let dodecaTarget = 0;
    let dodecaTurnStart = 0;
    let dodecaTurnElapsed = 0;
    let dodecaIsTurning = false;
    let lastTurnPillar: ElementPillar | null = null;
    let focusLevels = focusTargets(activePillarRef.current);
    let focusStartLevels = [...focusLevels];
    let focusTransitionElapsed = FOCUS_TRANSITION_SECONDS;
    let lastFocusPillar = activePillarRef.current;
    let lastFrameTime = 0;
    let animationFrame: number | null = null;
    let disposed = false;
    let isVisible = true;
    let lastRenderedAt = 0;

    const updateFocus = (delta: number, immediate = false) => {
      const requestedPillar = activePillarRef.current;
      const targets = focusTargets(requestedPillar);

      if (requestedPillar !== lastFocusPillar) {
        focusStartLevels = [...focusLevels];
        focusTransitionElapsed = 0;
        lastFocusPillar = requestedPillar;
      }

      if (immediate) {
        focusLevels = targets;
        focusStartLevels = [...targets];
        focusTransitionElapsed = FOCUS_TRANSITION_SECONDS;
        return;
      }

      focusTransitionElapsed = Math.min(
        FOCUS_TRANSITION_SECONDS,
        focusTransitionElapsed + delta,
      );
      const progress = easeOutCubic(
        focusTransitionElapsed / FOCUS_TRANSITION_SECONDS,
      );
      focusLevels = focusStartLevels.map((level, index) =>
        level + (targets[index] - level) * progress
      );
    };

    const updateDodecaTurn = (delta: number, immediate = false) => {
      const requestedPillar = turnPillarRef.current;
      if (requestedPillar && requestedPillar !== lastTurnPillar) {
        const currentTurn = dodecaTurn
          ?? 0.42 + motionElapsed * SOLIDS[4].rotation.y;
        dodecaTurnStart = currentTurn;
        dodecaTurn = currentTurn;
        dodecaTarget = nextFullTurn(currentTurn, requestedPillar);
        dodecaTurnElapsed = 0;
        dodecaIsTurning = true;
        lastTurnPillar = requestedPillar;
      }

      if (!requestedPillar && dodecaTurn === null) return;

      if (immediate) {
        dodecaTurn = dodecaTarget;
        dodecaIsTurning = false;
        return;
      }

      if (!dodecaIsTurning) return;
      dodecaTurnElapsed = Math.min(0.6, dodecaTurnElapsed + delta);
      const progress = easeOutCubic(dodecaTurnElapsed / 0.6);
      dodecaTurn =
        dodecaTurnStart + (dodecaTarget - dodecaTurnStart) * progress;
      if (dodecaTurnElapsed >= 0.6) {
        dodecaTurn = dodecaTarget;
        dodecaIsTurning = false;
      }
    };

    const render = () => {
      if (reducedMotion) {
        updateFocus(0, true);
        updateDodecaTurn(0, true);
      }
      drawScene(
        context,
        width,
        height,
        reducedMotion ? STATIC_TIME : revealElapsed,
        reducedMotion ? STATIC_TIME : motionElapsed,
        reducedMotion,
        focusLevels,
        activePillarRef.current,
        dodecaTurn,
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
        updateDodecaTurn(delta);
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
      data-opaque-background={opaqueBackground ? "true" : "false"}
      aria-label="The Whole Body Earth quincunx: Air and Press above, Fire and Presence left, Water and Studios right, Earth and Foundation below, and Ether and Guardian at the center."
      className={styles.canvas}
    >
      A luminous quincunx of five Platonic solids representing the five Whole
      Body Earth pillars.
    </canvas>
  );
}
