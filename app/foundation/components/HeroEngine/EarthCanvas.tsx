"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, MathUtils, ShaderMaterial, Vector2 } from "three";
import type { FoundationHeroConfig } from "./config";

const vertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uScrollSpeed;
uniform vec3 uColorBase;
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform vec3 uColorSurface;
uniform float uFluidDissipation;
uniform float uFlowVelocityScale;
uniform float uCameraDriftSpeed;
uniform float uWhiteHotFlare;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0,i1.z,i2.z,1.0)) + i.y + vec4(0.0,i1.y,i2.y,1.0)) + i.x + vec4(0.0,i1.x,i2.x,1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m *= m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float terrainHeight(vec2 p) {
  float h = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    h += amplitude * snoise(vec3(p * frequency, uTime * uFlowVelocityScale));
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return h;
}
float contourLine(float height, float spacing, float thickness) {
  float line = abs(fract(height / spacing) - 0.5);
  return 1.0 - smoothstep(0.0, thickness, line);
}
float faultLine(vec2 p) {
  float h1 = terrainHeight(p);
  float h2 = terrainHeight(p + vec2(0.015, 0.0));
  float h3 = terrainHeight(p + vec2(0.0, 0.015));
  return smoothstep(0.12, 0.35, length(vec2(h2 - h1, h3 - h1)));
}
float rootVein(vec2 p, float time) {
  float n = snoise(vec3(p * 3.0, time * 0.008));
  float branch = abs(sin(p.x * 8.0 + n * 3.0));
  float root = smoothstep(0.0, 0.02, branch) * (1.0 - smoothstep(0.02, 0.06, branch));
  float n2 = snoise(vec3(p * 6.0, time * 0.012));
  float branch2 = abs(cos(p.y * 6.0 + n2 * 4.0));
  float root2 = smoothstep(0.0, 0.015, branch2) * (1.0 - smoothstep(0.015, 0.04, branch2));
  return max(root, root2 * 0.6);
}

void main() {
  vec2 uv = vUv - 0.5;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y) * 3.0;
  p.x += uTime * uCameraDriftSpeed;
  p.y += sin(uTime * 0.018) * 0.008;
  p += (uPointer - 0.5) * 0.02;
  float height = terrainHeight(p) * 0.5 + 0.5;
  float contours = contourLine(height,0.05,0.015)*0.3 + contourLine(height,0.15,0.02)*0.5 + contourLine(height,0.4,0.03)*0.8;
  float faults = faultLine(p);
  float roots = rootVein(p,uTime);
  float tectonic = smoothstep(0.4,0.6,sin(p.x*2.0+uTime*0.018)*0.5+0.5);
  vec3 color = mix(uColorBase,uColorSecondary,smoothstep(0.0,0.3,height));
  color = mix(color,uColorPrimary,roots*smoothstep(0.2,0.7,height)*0.7);
  color += uColorPrimary * contours * 0.35;
  color += uColorPrimary * faults * 0.4;
  color = mix(color,uColorPrimary*0.4,tectonic*0.05);
  color = mix(color,uColorSurface,smoothstep(0.7,0.9,height)*0.5);
  color += uColorPrimary * uWhiteHotFlare * 0.08;
  float vignette = smoothstep(0.0,0.6,1.0-length(uv)*0.8);
  color += snoise(vec3(uv*150.0,0.0))*0.015;
  float alpha = (0.5+0.5*smoothstep(0.1,0.5,height))*vignette*uFluidDissipation;
  alpha = clamp(alpha*(1.0-uScrollSpeed*0.3),0.3,1.0);
  gl_FragColor = vec4(mix(uColorBase,color,alpha),1.0);
}`;

function Terrain({ config, tier, onReady }: { config: FoundationHeroConfig; tier: "medium" | "high"; onReady: () => void }) {
  const material = useRef<ShaderMaterial>(null);
  const elapsed = useRef(0);
  const frames = useRef(0);
  const flare = useRef(0);
  const nextFlare = useRef(config.ambientFlareIntervalMs / 1000);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const scrollSpeed = useRef(0);
  const { size, viewport } = useThree();

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = event.clientX / Math.max(innerWidth, 1);
      pointer.current.y = 1 - event.clientY / Math.max(innerHeight, 1);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    let previousY = scrollY;
    let previousTime = performance.now();
    let raf = 0;
    const scroll = () => {
      const now = performance.now();
      scrollSpeed.current = 0.5 * Math.min(Math.abs(scrollY - previousY) / Math.max(now - previousTime, 16), 2.4);
      previousY = scrollY;
      previousTime = now;
    };
    const decay = () => {
      scrollSpeed.current *= 0.91;
      raf = requestAnimationFrame(decay);
    };
    addEventListener("scroll", scroll, { passive: true });
    raf = requestAnimationFrame(decay);
    return () => {
      removeEventListener("scroll", scroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new Vector2(size.width, size.height) },
    uPointer: { value: new Vector2(0.5, 0.5) },
    uScrollSpeed: { value: 0 },
    uColorBase: { value: new Color(config.colorBase) },
    uColorPrimary: { value: new Color(config.colorPrimary) },
    uColorSecondary: { value: new Color(config.colorSecondary) },
    uColorSurface: { value: new Color(config.colorSurface) },
    uFluidDissipation: { value: config.fluidDissipation },
    uFlowVelocityScale: { value: config.flowVelocityScale },
    uCameraDriftSpeed: { value: config.cameraDriftSpeed },
    uWhiteHotFlare: { value: 0 },
  }), [config, size]);

  useFrame((_, delta) => {
    if (!material.current) return;
    elapsed.current += Math.min(delta, tier === "medium" ? 1 / 35 : 0.02);
    const shader = material.current.uniforms;
    shader.uTime.value = elapsed.current;
    shader.uPointer.value.lerp(new Vector2(pointer.current.x, pointer.current.y), Math.min(1, 0.8 * delta));
    shader.uScrollSpeed.value = MathUtils.lerp(shader.uScrollSpeed.value, scrollSpeed.current, Math.min(1, 0.8 * delta));
    if (elapsed.current >= nextFlare.current) {
      flare.current = 1;
      nextFlare.current = elapsed.current + config.ambientFlareIntervalMs / 1000;
    }
    flare.current = Math.max(0, flare.current - 0.12 * delta);
    shader.uWhiteHotFlare.value = flare.current;
    frames.current += 1;
    if (frames.current === 3) onReady();
  });

  return <mesh>
    <planeGeometry args={[viewport.width * 1.02, viewport.height * 1.02]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} depthTest={false} depthWrite={false} toneMapped={false} />
  </mesh>;
}

export default function EarthCanvas({ config, pixelRatio, tier, onReady }: {
  config: FoundationHeroConfig;
  pixelRatio: number;
  tier: "medium" | "high";
  onReady: () => void;
}) {
  return <Canvas
    dpr={pixelRatio}
    frameloop="always"
    camera={{ position: [0, 0, 6], fov: 46 }}
    gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => gl.setClearColor(new Color(config.colorBase), 0)}
  ><Terrain config={config} tier={tier} onReady={onReady} /></Canvas>;
}
