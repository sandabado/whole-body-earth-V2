"use client";

import { Edges, Float, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function Fire() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * .12;
    ref.current.rotation.x += delta * .04;
  });

  return <>
    <ambientLight intensity={.18} />
    <pointLight color="#E8542A" intensity={2} position={[4, 4, 4]} />
    <Stars radius={20} depth={14} count={500} factor={1.5} fade speed={.5} />
    <Float speed={.8} floatIntensity={.25} rotationIntensity={.15}>
      <mesh ref={ref} scale={2.35}>
        <tetrahedronGeometry args={[1.35, 0]} />
        <meshStandardMaterial color="#1A120B" emissive="#E8542A" emissiveIntensity={.12} transparent opacity={.32} />
        <Edges color="#E8542A" />
      </mesh>
    </Float>
  </>;
}

export function FireCanvas() {
  return <Canvas camera={{ fov: 46, position: [0, 0, 7] }} dpr={[1, 1.4]}><Fire /></Canvas>;
}
