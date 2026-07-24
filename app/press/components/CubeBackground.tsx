"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, Stars } from "@react-three/drei";
import { Component, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import type { Mesh } from "three";
import { useDeviceCapability } from "../../components/HeroEngine/hooks/useDeviceCapability";

function Octahedron() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.24;
    ref.current.rotation.x += delta * 0.1;
  });
  return <>
    <ambientLight intensity={0.2} />
    <pointLight position={[5, 6, 5]} intensity={1.3} color="#C9A227" />
    <Stars radius={22} depth={16} count={650} factor={1.1} saturation={0} fade speed={0.3} />
    <Float speed={1.6} floatIntensity={0.55} rotationIntensity={0.3}>
      <mesh ref={ref} scale={2.65}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#0A0A0F" emissive="#C9A227" emissiveIntensity={0.08} roughness={0.72} transparent opacity={0.34} />
        <Edges color="#C9A227" />
      </mesh>
    </Float>
  </>;
}

export function CubeBackground() {
  const capability = useDeviceCapability();
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const canRender = capability.checked && capability.webgl2 && !capability.reducedMotion
    && !capability.reducedData && capability.tier !== "low" && !failed;

  return (
    <div className={`cube-bg ${canRender ? "cube-bg--live" : "cube-bg--still"}`} aria-hidden="true">
      {canRender && (
        <CanvasBoundary onError={() => setFailed(true)}>
          <Canvas
            camera={{ fov: 48, position: [0, 0, 7] }}
            dpr={[1, Math.min(capability.pixelRatio, 1.35)]}
            frameloop={visible ? "always" : "never"}
          >
            <Octahedron />
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}

class CanvasBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Air background renderer failed", error, info.componentStack);
    this.props.onError();
  }
  render() { return this.state.failed ? null : this.props.children; }
}
