"use client";
import { Edges } from "@react-three/drei";
import { BEDS, COLD_FRAMES, HOUR_LINES, ORCHARD_TREES } from "./garden-data";
import FloatingBed from "./FloatingBed";
import CopperGnomon from "./CopperGnomon";

const GREEN="#84a66e";
export default function GardenScene(){return <group>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.5,0]} receiveShadow><circleGeometry args={[4.5,64]} /><meshStandardMaterial color="#1a1510" roughness={1} /></mesh>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.49,0]} receiveShadow><circleGeometry args={[3.2,48]} /><meshStandardMaterial color="#2a2015" roughness={1} /></mesh>
  {HOUR_LINES.map(l=><mesh key={l.index} position={[0,-.482,0]} rotation={[-Math.PI/2,0,l.angle]}><planeGeometry args={[.015,1.8]} /><meshBasicMaterial color={GREEN} transparent opacity={.16} /></mesh>)}
  {[0,Math.PI/2,Math.PI,Math.PI*1.5].map((a,i)=><mesh key={i} position={[0,-.48,0]} rotation={[-Math.PI/2,0,a]}><planeGeometry args={[.02,3]} /><meshBasicMaterial color="#b87333" transparent opacity={.25} /></mesh>)}
  <CopperGnomon />{BEDS.map((b,i)=><FloatingBed key={i} bed={b} />)}
  {BEDS.map((b,i)=>{const n=BEDS[(i+1)%BEDS.length],dx=n.position[0]-b.position[0],dz=n.position[2]-b.position[2],len=Math.hypot(dx,dz),a=Math.atan2(dz,dx);return <mesh key={`p${i}`} position={[(b.position[0]+n.position[0])/2,-.481,(b.position[2]+n.position[2])/2]} rotation={[-Math.PI/2,0,-a]}><planeGeometry args={[len,.04]} /><meshBasicMaterial color="#30372b" transparent opacity={.65} /></mesh>})}
  {COLD_FRAMES.map((f,i)=><group key={i} position={f.position} rotation={f.rotation}><mesh><boxGeometry args={[.5,.3,.35]} /><meshStandardMaterial color={GREEN} transparent opacity={.13} emissive={GREEN} emissiveIntensity={.05} roughness={.12} metalness={.2} /><Edges color={GREEN} /></mesh><mesh position={[0,.16,0]} rotation={[.3,0,0]}><boxGeometry args={[.5,.02,.32]} /><meshStandardMaterial color={GREEN} transparent opacity={.25} emissive={GREEN} emissiveIntensity={.06} /></mesh></group>)}
  <group position={[0,-.28,-3]} rotation={[0,Math.PI/6,0]}><mesh><boxGeometry args={[3,1.2,1.5]} /><meshStandardMaterial color="#273324" transparent opacity={.15} emissive={GREEN} emissiveIntensity={.025} roughness={.15} /><Edges color="#4a5542" /></mesh><mesh position={[0,.72,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.75,.75,3,3,1,false,0,Math.PI]} /><meshStandardMaterial color="#273324" transparent opacity={.12} emissive={GREEN} emissiveIntensity={.025} /><Edges color="#4a5542" /></mesh></group>
  {ORCHARD_TREES.map((t,i)=><group key={i} position={t.position} scale={t.scale}><mesh position={[0,.1,0]}><cylinderGeometry args={[.03,.04,.2,6]} /><meshStandardMaterial color="#3a2a1a" roughness={.9} /></mesh><mesh position={[0,.3,0]}><sphereGeometry args={[.18,10,10]} /><meshStandardMaterial color="#2a4a2a" emissive="#1a3a1a" emissiveIntensity={.08} roughness={.8} /></mesh></group>)}
  <group position={[2.5,-.4,1.5]}>{Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*4,r=.05+i/12*.25,h=.15-i/12*.12;return <mesh key={i} position={[Math.cos(a)*r,h/2,Math.sin(a)*r]}><boxGeometry args={[.06,h,.06]} /><meshStandardMaterial color="#3a3a3a" roughness={.9} /></mesh>})}</group>
  <directionalLight position={[5,8,3]} intensity={1.3} color="#ffe5b4" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /><pointLight position={[-5,3,-5]} intensity={.65} color={GREEN} /><ambientLight intensity={.35} />
 </group>}
