import type { CSSProperties } from "react";
import { COMMAND_PILLAR_COLORS } from "../HeroEngine/config";
import styles from "../home/TransitionOverlay.module.css";

type EdgeStyle = CSSProperties & {
  "--edge-color": string;
  "--edge-delay": string;
  "--edge-index": string;
};

const edgeColors = [
  COMMAND_PILLAR_COLORS.presence,
  COMMAND_PILLAR_COLORS.press,
  COMMAND_PILLAR_COLORS.studios,
  COMMAND_PILLAR_COLORS.foundation,
  COMMAND_PILLAR_COLORS.guardian,
] as const;

export function ObservatoryTransition() {
  return (
    <div className={`${styles.scene} ${styles.observatory}`} aria-hidden="true">
      {edgeColors.map((color, index) => (
        <i
          key={color}
          className={styles.edgePulse}
          style={{
            "--edge-color": color,
            "--edge-delay": `${index * 82}ms`,
            "--edge-index": String(index),
          } as EdgeStyle}
        />
      ))}
      <div className={`${styles.solid} ${styles.dodecahedron}`} />
      <div className={styles.ritualCopy}>
        <p className={styles.ritualKicker}>The Observatory · NØW</p>
        <p className={styles.ritualTitle}>Entering the Constellation</p>
      </div>
    </div>
  );
}

export default ObservatoryTransition;
