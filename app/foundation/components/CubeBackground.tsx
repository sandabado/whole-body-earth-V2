"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Cube() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.1;
    ref.current.rotation.x += delta * 0.03;
  });
  return <>
    <ambientLight intensity={0.18} />
    <pointLight position={[6, 7, 6]} intensity={1.1} color="#84a66e" />
    <pointLight position={[-5, -3, 2]} intensity={0.45} color="#6f5d42" />
    <Stars radius={24} depth={18} count={1100} factor={1.4} saturation={0} fade speed={0.15} />
    <Float speed={0.6} floatIntensity={0.18} rotationIntensity={0.08}>
      <mesh ref={ref} scale={2.5}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial color="#11140e" emissive="#526744" emissiveIntensity={0.13} roughness={0.86} transparent opacity={0.42} />
        <Edges color="#84a66e" />
      </mesh>
    </Float>
  </>;
}

export function CubeBackground() {
  return <div className="cube-bg" aria-hidden="true"><Canvas camera={{ fov: 48, position: [0, 0, 7] }} dpr={[1, 1.5]}><Cube /></Canvas></div>;
}
