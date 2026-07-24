"use client";

import { motion } from "framer-motion";
import type { Phase } from "./builder-data";
import { statusLabel } from "./builder-data";
import { PhaseGeometry } from "./PhaseGeometry";

interface PhaseCardProps {
  phase: Phase;
  isActive: boolean;
  isHovered: boolean;
  onSelect: (id: number) => void;
}

export default function PhaseCard({ phase, isActive, isHovered, onSelect }: PhaseCardProps) {
  return <motion.button
    type="button"
    className={`phase-card ${isActive ? "active" : ""} ${phase.status === "future" ? "locked" : ""}`}
    aria-pressed={isActive}
    aria-label={`View Phase ${phase.id}: ${phase.name}`}
    onClick={() => onSelect(phase.id)}
    whileHover={{ y: -4 }}
    whileTap={{ scale: .99 }}
  >
    <i className="hud-corner tl" /><i className="hud-corner tr" /><i className="hud-corner bl" /><i className="hud-corner br" />
    <span className="phase-card-top"><b>0{phase.id}</b><em className={`phase-badge ${phase.status}`}>{statusLabel[phase.status]}</em></span>
    <span className="phase-card-geometry"><PhaseGeometry geometry={phase.geometry} /><b>{phase.glyph}</b></span>
    <span className="phase-card-copy">
      <small>{phase.codename}</small>
      <strong>{phase.name}</strong>
      <span>{phase.startDate}</span>
    </span>
    <span className={`phase-card-drawer ${isActive || isHovered ? "shown" : ""}`}>
      {phase.deliverables.slice(0, 3).map(item => <span key={item}><i />{item}</span>)}
    </span>
  </motion.button>;
}
