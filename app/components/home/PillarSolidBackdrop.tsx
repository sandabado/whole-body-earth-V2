"use client";

import { useEffect, useRef } from "react";
import styles from "./PillarSolidBackdrop.module.css";

export type PillarSolid = "presence" | "press" | "studios" | "foundation" | "guardian";

type Vector3 = Readonly<{ x: number; y: number; z: number }>;
type Face = readonly number[];
type Edge = readonly [number, number];
type RGB = readonly [number, number, number];

interface SolidDefinition {
  color: RGB;
  vertices: readonly Vector3[];
  faces: readonly Face[];
  edges: readonly Edge[];
  rotation: Vector3;
  phase: number;
  anchor: readonly [number, number];
  scale: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const MAX_DEVICE_PIXEL_RATIO = 1.75;

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

function normalizeVertices(vertices: readonly Vector3[]): readonly Vector3[] {
  const radius = Math.max(...vertices.map(({ x, y, z }) => Math.hypot(x, y, z)));
  return vertices.map(({ x, y, z }) => ({ x: x / radius, y: y / radius, z: z / radius }));
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

function convexPentagons(vertices: readonly Vector3[]): readonly Face[] {
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
        if (
          !distances.every((distance) => distance <= epsilon) &&
          !distances.every((distance) => distance >= -epsilon)
        ) {
          continue;
        }

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
        const axisXLength = Math.hypot(seed.x - center.x, seed.y - center.y, seed.z - center.z);
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
          const leftRelative = {
            x: vertices[left].x - center.x,
            y: vertices[left].y - center.y,
            z: vertices[left].z - center.z,
          };
          const rightRelative = {
            x: vertices[right].x - center.x,
            y: vertices[right].y - center.y,
            z: vertices[right].z - center.z,
          };
          return (
            Math.atan2(
              leftRelative.x * axisY.x + leftRelative.y * axisY.y + leftRelative.z * axisY.z,
              leftRelative.x * axisX.x + leftRelative.y * axisX.y + leftRelative.z * axisX.z,
            ) -
            Math.atan2(
              rightRelative.x * axisY.x + rightRelative.y * axisY.y + rightRelative.z * axisY.z,
              rightRelative.x * axisX.x + rightRelative.y * axisX.y + rightRelative.z * axisX.z,
            )
          );
        });
        faces.set(key, ordered);
      }
    }
  }

  return [...faces.values()];
}

function makeSolid(
  color: RGB,
  vertices: readonly Vector3[],
  faces: readonly Face[],
  rotation: Vector3,
  phase: number,
  anchor: readonly [number, number],
  scale: number,
): SolidDefinition {
  return {
    color,
    vertices: normalizeVertices(vertices),
    faces,
    edges: edgesFromFaces(faces),
    rotation,
    phase,
    anchor,
    scale,
  };
}

const DODECAHEDRON_FACES = convexPentagons(DODECAHEDRON_VERTICES);

const SOLIDS: Record<PillarSolid, SolidDefinition> = {
  presence: makeSolid(
    [232, 84, 42],
    TETRAHEDRON_VERTICES,
    TETRAHEDRON_FACES,
    { x: -0.21, y: 0.31, z: 0.08 },
    2.2,
    [0.78, 0.38],
    0.38,
  ),
  press: makeSolid(
    [201, 162, 39],
    OCTAHEDRON_VERTICES,
    OCTAHEDRON_FACES,
    { x: 0.17, y: 0.26, z: 0.06 },
    0.8,
    [0.78, 0.31],
    0.35,
  ),
  studios: makeSolid(
    [43, 168, 160],
    ICOSAHEDRON_VERTICES,
    ICOSAHEDRON_FACES,
    { x: 0.12, y: -0.22, z: 0.05 },
    3.7,
    [0.77, 0.34],
    0.36,
  ),
  foundation: makeSolid(
    [132, 166, 110],
    CUBE_VERTICES,
    CUBE_FACES,
    { x: -0.13, y: 0.2, z: -0.045 },
    5.1,
    [0.77, 0.36],
    0.37,
  ),
  guardian: makeSolid(
    [139, 111, 214],
    DODECAHEDRON_VERTICES,
    DODECAHEDRON_FACES,
    { x: 0.08, y: 0.14, z: 0.025 },
    0,
    [0.77, 0.34],
    0.34,
  ),
};

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
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

const random = seededRandom(0x51d5cace);
const STARS = Array.from({ length: 54 }, () => ({
  x: random(),
  y: random(),
  radius: 0.3 + random() * 0.65,
  opacity: 0.08 + random() * 0.28,
  phase: random() * TAU,
}));

function draw(
  context: CanvasRenderingContext2D,
  solid: SolidDefinition,
  width: number,
  height: number,
  elapsed: number,
  reducedMotion: boolean,
): void {
  context.clearRect(0, 0, width, height);

  for (const star of STARS) {
    const twinkle = reducedMotion ? 0.68 : 0.62 + Math.sin(elapsed * 0.38 + star.phase) * 0.2;
    context.fillStyle = `rgba(237, 237, 237, ${star.opacity * twinkle})`;
    context.beginPath();
    context.arc(star.x * width, star.y * height, star.radius, 0, TAU);
    context.fill();
  }

  const mobile = width < 700;
  const floatX = reducedMotion ? 0 : Math.cos(elapsed * 0.22 + solid.phase) * 10;
  const floatY = reducedMotion ? 0 : Math.sin(elapsed * 0.34 + solid.phase) * 17;
  const center = {
    x: width * (mobile ? 0.68 : solid.anchor[0]) + floatX,
    y: height * (mobile ? 0.24 : solid.anchor[1]) + floatY,
  };
  const radius = Math.min(width, height) * (mobile ? 0.48 : solid.scale);
  const animationTime = reducedMotion ? 8 + solid.phase : elapsed;
  const rotatedVertices = solid.vertices.map((vertex) =>
    rotate(
      vertex,
      0.2 + animationTime * solid.rotation.x + solid.phase * 0.08,
      0.42 + animationTime * solid.rotation.y + solid.phase * 0.11,
      animationTime * solid.rotation.z,
    ),
  );
  const projectedVertices = rotatedVertices.map((vertex) => {
    const cameraDistance = 4.2;
    const perspective = cameraDistance / (cameraDistance - vertex.z);
    return {
      x: center.x + vertex.x * radius * perspective,
      y: center.y - vertex.y * radius * perspective,
    };
  });

  context.save();
  context.globalCompositeOperation = "screen";

  const glow = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius * 1.75);
  glow.addColorStop(0, rgba(solid.color, 0.15));
  glow.addColorStop(0.32, rgba(solid.color, 0.055));
  glow.addColorStop(1, rgba(solid.color, 0));
  context.fillStyle = glow;
  context.beginPath();
  context.arc(center.x, center.y, radius * 1.75, 0, TAU);
  context.fill();

  context.strokeStyle = rgba(solid.color, 0.11);
  context.lineWidth = 0.7;
  context.beginPath();
  context.ellipse(center.x, center.y, radius * 1.42, radius * 0.34, -0.18, 0, TAU);
  context.stroke();

  const sortedFaces = solid.faces
    .map((face) => ({
      face,
      depth: face.reduce((total, index) => total + rotatedVertices[index].z, 0) / face.length,
    }))
    .sort((left, right) => left.depth - right.depth);

  for (const { face, depth } of sortedFaces) {
    const light = clamp((depth + 1) / 2);
    context.beginPath();
    face.forEach((vertexIndex, index) => {
      const point = projectedVertices[vertexIndex];
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.closePath();
    context.fillStyle = rgba(solid.color, 0.025 + light * 0.085);
    context.fill();
  }

  const sortedEdges = solid.edges
    .map((edge) => ({
      edge,
      depth: (rotatedVertices[edge[0]].z + rotatedVertices[edge[1]].z) / 2,
    }))
    .sort((left, right) => left.depth - right.depth);

  context.lineCap = "round";
  for (const { edge, depth } of sortedEdges) {
    const light = clamp((depth + 1) / 2);
    const from = projectedVertices[edge[0]];
    const to = projectedVertices[edge[1]];
    context.strokeStyle = rgba(solid.color, 0.21 + light * 0.55);
    context.lineWidth = 0.65 + light * 0.9;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }

  for (const [index, point] of projectedVertices.entries()) {
    const light = clamp((rotatedVertices[index].z + 1) / 2);
    context.fillStyle = rgba(solid.color, 0.32 + light * 0.55);
    context.beginPath();
    context.arc(point.x, point.y, 0.9 + light * 1.35, 0, TAU);
    context.fill();
  }

  context.restore();
}

export function PillarSolidBackdrop({ pillar }: { pillar: PillarSolid }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const solid = SOLIDS[pillar];
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionPreference.matches;
    let width = 1;
    let height = 1;
    let elapsed = 8;
    let lastFrameTime = 0;
    let animationFrame: number | null = null;
    let visible = true;
    let disposed = false;

    const render = () => draw(context, solid, width, height, elapsed, reducedMotion);

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(MAX_DEVICE_PIXEL_RATIO, Math.max(1, window.devicePixelRatio || 1));
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.resetTransform();
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      render();
    };

    const stop = () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      lastFrameTime = 0;
    };

    const animate = (time: number) => {
      animationFrame = null;
      if (disposed || reducedMotion || document.hidden || !visible) return;
      if (lastFrameTime > 0) elapsed += Math.min((time - lastFrameTime) / 1_000, 0.1);
      lastFrameTime = time;
      render();
      animationFrame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (disposed || reducedMotion || document.hidden || !visible || animationFrame !== null) return;
      animationFrame = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      stop();
      if (reducedMotion) render();
      else start();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "12% 0px", threshold: 0.01 },
    );

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);
    motionPreference.addEventListener("change", handleMotionPreference);
    resize();
    start();

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      motionPreference.removeEventListener("change", handleMotionPreference);
    };
  }, [pillar]);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
