"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import type { Group } from "three";
import { type BedData, PLANT_COLORS, PLANT_HEIGHTS } from "./garden-data";

export default function FloatingBed({ bed }: { bed: BedData }) {
  const plants = useRef<Group>(null);
  useFrame(({ clock }) => { if (plants.current) { const p = bed.position[0] + bed.position[2]; plants.current.rotation.z = Math.sin(clock.elapsedTime * .8 + p) * .03; plants.current.rotation.x = Math.cos(clock.elapsedTime * .6 + p) * .02; } });
  const height = PLANT_HEIGHTS[bed.plantType], color = PLANT_COLORS[bed.plantType];
  return <group position={bed.position} rotation={bed.rotation}>
    <mesh castShadow receiveShadow><cylinderGeometry args={[.3, .35, .4, 3]} /><meshStandardMaterial color="#3a2a1a" roughness={.92} emissive="#1a0f00" emissiveIntensity={.05} /><Edges color="#84a66e" /></mesh>
    <mesh position={[0,.18,0]}><cylinderGeometry args={[.28,.28,.04,3]} /><meshStandardMaterial color="#1a1005" roughness={1} /></mesh>
    <group ref={plants} position={[0,.2,0]}>{Array.from({length:4},(_,i)=>{const a=i/4*Math.PI*2;return <mesh key={i} position={[Math.cos(a)*.12,height/2,Math.sin(a)*.12]}><coneGeometry args={[.04,height,5]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.08} roughness={.7} /></mesh>})}<mesh position={[0,height*.6,0]}><coneGeometry args={[.05,height*1.3,5]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.1} /></mesh></group>
  </group>;
}
