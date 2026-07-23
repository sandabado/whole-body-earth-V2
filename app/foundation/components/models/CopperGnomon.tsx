"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { GNOMON_TILT_RAD } from "./garden-data";

export default function CopperGnomon(){const shadow=useRef<Mesh>(null);useFrame(({clock})=>{if(!shadow.current)return;const a=clock.elapsedTime/60*Math.PI*2;shadow.current.rotation.z=a;shadow.current.scale.x=1.5-Math.abs(Math.sin(a))*.8});return <group>
  <mesh position={[0,-.47,0]} receiveShadow><cylinderGeometry args={[.5,.5,.045,32]} /><meshStandardMaterial color="#b87333" emissive="#8b5a2b" emissiveIntensity={.16} metalness={.85} roughness={.25} /></mesh>
  <group rotation={[GNOMON_TILT_RAD,0,0]}><mesh position={[0,.5,0]} castShadow><cylinderGeometry args={[.025,.035,1.2,12]} /><meshStandardMaterial color="#b87333" emissive="#8b5a2b" emissiveIntensity={.25} metalness={.9} roughness={.2} /></mesh><mesh position={[0,1.1,0]}><sphereGeometry args={[.04,12,12]} /><meshStandardMaterial color="#b87333" emissive="#8b5a2b" emissiveIntensity={.3} metalness={.95} roughness={.1} /></mesh></group>
  <mesh ref={shadow} position={[0,-.445,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[1.5,.06]} /><meshBasicMaterial color="#000" transparent opacity={.42} /></mesh>
 </group>}
