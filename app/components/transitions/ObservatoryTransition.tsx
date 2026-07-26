import type { CSSProperties } from "react";
import styles from "../TransitionOverlay.module.css";

type MeridianStyle = CSSProperties & {
  "--meridian-index": number;
};

type ParallelStyle = CSSProperties & {
  "--parallel-top": string;
  "--parallel-height": string;
  "--parallel-scale": number;
};

const meridians = Array.from({ length: 48 }, (_, index) => index);
const parallels = Array.from({ length: 8 }, (_, index) => index);

export function ObservatoryTransition() {
  return (
    <div className={`${styles.scene} ${styles.observatory}`} aria-hidden="true">
      <div className={styles.observatoryColorCycle} />
      <div className={styles.observatoryGlobe}>
        {meridians.map((index) => (
          <i
            key={`meridian-${index}`}
            className={styles.observatoryMeridian}
            style={{ "--meridian-index": index } as MeridianStyle}
          />
        ))}
        {parallels.map((index) => (
          <span
            key={`parallel-${index}`}
            className={styles.observatoryParallel}
            style={{
              "--parallel-top": `${8 + index * 10.5}%`,
              "--parallel-height": `${18 + index * 2}%`,
              "--parallel-scale": 0.72 + index * 0.035,
            } as ParallelStyle}
          />
        ))}
      </div>
      <div className={styles.observatoryStars} />
      <div className={styles.ritualCopy}>
        <p className={styles.ritualKicker}>The Observatory · Whole Body Earth</p>
        <p className={styles.ritualTitle}>Entering the Constellation</p>
      </div>
    </div>
  );
}

export default ObservatoryTransition;
