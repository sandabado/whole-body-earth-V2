"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, type PointerEvent } from "react";
import AssemblyAnimation from "./AssemblyAnimation";
import BlueprintOverlay from "./BlueprintOverlay";
import { PHASES, statusLabel } from "./builder-data";
import { PhaseGeometry } from "./PhaseGeometry";
import PhaseTimeline from "./PhaseTimeline";

export default function PhaseBuilderEntrance({ gateway = false }: { gateway?: boolean }) {
  const [activePhaseId, setActivePhaseId] = useState(0);
  const [hoveredPhaseId, setHoveredPhaseId] = useState<number | null>(null);
  const pointerX = useMotionValue(-300);
  const pointerY = useMotionValue(-300);
  const glowX = useSpring(pointerX, { stiffness: 90, damping: 24 });
  const glowY = useSpring(pointerY, { stiffness: 90, damping: 24 });
  const activePhase = PHASES[activePhaseId];

  useEffect(() => {
    const navigate = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowRight") setActivePhaseId(current => Math.min(PHASES.length - 1, current + 1));
      if (event.key === "ArrowLeft") setActivePhaseId(current => Math.max(0, current - 1));
    };
    window.addEventListener("keydown", navigate);
    return () => window.removeEventListener("keydown", navigate);
  }, []);

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left - 160);
    pointerY.set(event.clientY - rect.top - 160);
  };

  return <section className={`phase-builder ${gateway ? "gateway" : ""}`} onPointerMove={followPointer} aria-labelledby={gateway ? "gateway-builder-title" : "phase-builder-title"}>
    <BlueprintOverlay />
    <AssemblyAnimation />
    <motion.div className="builder-glow" style={{ x: glowX, y: glowY }} aria-hidden="true" />

    <div className="builder-shell">
      <motion.header className="builder-hero" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75 }}>
        <div className="builder-status"><i />SYSTEM STATUS: UNDER CONSTRUCTION <span>23%</span></div>
        <p className="builder-kicker">WHOLE BODY / FOUNDATION · EARTH PILLAR</p>
        <h1 id={gateway ? "gateway-builder-title" : "phase-builder-title"}>THE GROUND<br /><em>THAT BUILDS.</em></h1>
        <p className="builder-intro">The village is not a destination. It is a sequence. Each phase unlocks the next. Phase 0 is active now. We are searching for land.</p>
        <div className="builder-actions">
          <Link href={gateway ? "#builder-application" : "/foundation/apply"} className="button primary">{gateway ? "Begin Your Application" : "Apply to Build"} →</Link>
          <a href="#build-sequence" className="button secondary">View All Phases ↓</a>
        </div>
      </motion.header>

      <motion.div className="active-build" key={activePhase.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
        <div className="active-build-visual">
          <div className="drawing-number">DWG–0{activePhase.id + 1} / {activePhase.geometry.toUpperCase()}</div>
          <PhaseGeometry geometry={activePhase.geometry} large />
          <div className="drawing-scale"><span>SCALE 1:100</span><i /><span>{activePhase.startDate}</span></div>
        </div>
        <div className="active-build-copy">
          <div className="active-build-head">
            <div><span>PHASE 0{activePhase.id}</span><h2>{activePhase.name}</h2><p>{activePhase.codename}</p></div>
            <em className={`phase-badge ${activePhase.status}`}>{statusLabel[activePhase.status]}</em>
          </div>
          <p className="active-description">{activePhase.description}</p>
          <div className="active-meta">
            <div><small>DELIVERABLES</small>{activePhase.deliverables.map(item => <span key={item}><i />{item}</span>)}</div>
            <div><small>TIMELINE</small><span>START / {activePhase.startDate}</span><span>CURRENT / {activePhase.id === 0 ? "DUE DILIGENCE" : "AWAITING UNLOCK"}</span></div>
          </div>
          <div className="build-progress"><div><span>PHASE PROGRESS</span><b>{String(activePhase.progress).padStart(2, "0")}%</b></div><div className="progress-rail"><motion.i initial={{ width: 0 }} animate={{ width: `${activePhase.progress}%` }} transition={{ duration: .8 }} /></div></div>
        </div>
      </motion.div>

      <PhaseTimeline activePhaseId={activePhaseId} hoveredPhaseId={hoveredPhaseId} onSelectPhase={setActivePhaseId} onHoverPhase={setHoveredPhaseId} />
      <div className="builder-mantra"><span>← / → CYCLE PHASES</span><p>SO IT IS BUILT. SO IT HOLDS. SO IT IS. 🍀</p><span><i />LIVE BUILD LOG</span></div>
    </div>
  </section>;
}
