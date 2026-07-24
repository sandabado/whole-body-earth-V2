"use client";
import { motion } from "framer-motion";
const items=[
  "FIRST EDITIONS · SPRING 2027",
  "AUTHOR-OWNED · 100% COPYRIGHT",
  "ACID-FREE PAPER · FOIL-STAMPED SPINES",
  "DIGITAL · TRADE · HARDCOVER · HAND-BOUND",
  "NO DRM · NO PLATFORM DEPENDENCY",
  "THE WRITER EATS FIRST",
];
export function Ticker(){return <div className="ticker"><motion.div animate={{x:["0%","-50%"]}} transition={{duration:30,repeat:Infinity,ease:"linear"}}>{[...items,...items].map((x,i)=><span key={i}><b>●</b>{x}</span>)}</motion.div></div>}
