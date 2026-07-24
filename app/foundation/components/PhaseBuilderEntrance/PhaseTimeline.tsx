"use client";

import { PHASES } from "./builder-data";
import PhaseCard from "./PhaseCard";

interface PhaseTimelineProps {
  activePhaseId: number;
  hoveredPhaseId: number | null;
  onSelectPhase: (id: number) => void;
  onHoverPhase: (id: number | null) => void;
}

export default function PhaseTimeline({ activePhaseId, hoveredPhaseId, onSelectPhase, onHoverPhase }: PhaseTimelineProps) {
  return <div className="phase-timeline" id="build-sequence">
    <div className="phase-timeline-heading">
      <div><p>ASSEMBLY ORDER / 00–04</p><h2>THE BUILD SEQUENCE</h2></div>
      <p>Nothing here is finished. Everything is intentional. Each structure depends on the last.</p>
    </div>
    <div className="phase-track" aria-hidden="true"><i /></div>
    <div className="phase-card-grid">
      {PHASES.map(phase => <div key={phase.id} onMouseEnter={() => onHoverPhase(phase.id)} onMouseLeave={() => onHoverPhase(null)}>
        <PhaseCard phase={phase} isActive={activePhaseId === phase.id} isHovered={hoveredPhaseId === phase.id} onSelect={onSelectPhase} />
      </div>)}
    </div>
  </div>;
}
