"use client";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import GardenScene from "./GardenScene";

export default function FloatingTetrahedronGarden({compact=false,disableAutoRotate=false,height}:{compact?:boolean;disableAutoRotate?:boolean;height?:string}){const[loaded,setLoaded]=useState(false),[hint,setHint]=useState(true);return <div className="garden-viewer" style={{height:height||(compact?"300px":"500px")}}>
  <i className="hud tl"/><i className="hud tr"/><i className="hud bl"/><i className="hud br"/>
  <div className="garden-title"><h3>THE TETRAHEDRON GARDEN</h3><p>{compact?"12 BEDS · FLOWER OF LIFE · COPPER GNOMON":"12 RAISED BEDS · FLOWER OF LIFE PATTERN · SOLAR-CALIBRATED SUNDIAL"}</p></div>
  <div className="garden-status"><i/> PHASE 0 · DESIGNED</div>
  {!loaded&&<motion.div className="garden-loading" initial={{opacity:0}} animate={{opacity:1}}><b>◇</b><span>GROWING GEOMETRY...</span></motion.div>}
  {loaded&&hint&&<motion.p className="garden-hint" initial={{opacity:0}} animate={{opacity:1}}>DRAG TO ROTATE · SCROLL TO ZOOM</motion.p>}
  <Canvas shadows dpr={[1,1.5]} onCreated={()=>setLoaded(true)} onPointerDown={()=>setHint(false)}><PerspectiveCamera makeDefault position={compact?[3.8,3.2,5.2]:[5.5,4.4,6.8]} fov={50}/><Suspense fallback={null}><Float speed={compact?.8:.5} floatIntensity={compact?.3:.15} rotationIntensity={compact?.15:.05}><GardenScene/></Float><ContactShadows position={[0,-1.2,0]} opacity={.45} scale={12} blur={2.5} far={5} color="#000"/><OrbitControls enablePan={false} autoRotate={!disableAutoRotate} autoRotateSpeed={compact?.8:.4} minDistance={compact?4:3} maxDistance={compact?10:15} minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/2.1} enableDamping dampingFactor={.05}/><fog attach="fog" args={["#050604",8,20]}/></Suspense></Canvas>
  {!compact&&<div className="garden-legend"><span><i className="bed"/>BEDS</span><span><i className="copper"/>COPPER</span><span><i className="frame"/>COLD FRAMES</span><span><i className="orchard"/>ORCHARD</span></div>}
 </div>}
