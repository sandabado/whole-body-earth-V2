"use client";
import { motion } from "framer-motion";

export function ReadingPreview({ excerpt, title }: { excerpt: string; title: string }) {
  return <motion.div className="reading-preview" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
    <span className="hud tl"/><span className="hud tr"/><span className="hud bl"/><span className="hud br"/>
    <div className="watermark">{title}</div><header><p>READER PREVIEW</p><i/></header>
    <div className="reading-text">{excerpt.split("\n").filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>
    <div className="reading-fade"/><div className="preview-cta"><em>Continue reading in the full volume…</em><a href="#formats">UNLOCK FULL VOLUME →</a></div>
  </motion.div>;
}
