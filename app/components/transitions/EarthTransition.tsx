import type { CSSProperties } from "react";
import styles from "../home/TransitionOverlay.module.css";

type GravelStyle = CSSProperties & {
  "--gravel-x": string;
  "--gravel-delay": string;
  "--gravel-size": string;
};

const gravel = Array.from({ length: 42 }, (_, index) => ({
  x: 4 + ((index * 29) % 92),
  delay: 260 + (index % 12) * 34,
  size: 3 + (index % 6),
}));

export function EarthTransition() {
  return (
    <div className={`${styles.scene} ${styles.earth}`} aria-hidden="true">
      <div className={styles.blueprintGrid} />
      {gravel.map((stone, index) => (
        <i
          key={index}
          className={styles.gravel}
          style={{
            "--gravel-x": `${stone.x}%`,
            "--gravel-delay": `${stone.delay}ms`,
            "--gravel-size": `${stone.size}px`,
          } as GravelStyle}
        />
      ))}
      <div className={`${styles.solid} ${styles.cube}`}>
        {Array.from({ length: 6 }, (_, index) => (
          <i key={index} className={styles.cubeFace} />
        ))}
      </div>
      <div className={styles.ritualCopy}>
        <p className={styles.ritualKicker}>The Ground · Foundation</p>
        <p className={styles.ritualTitle}>Entering the Earth Pillar</p>
      </div>
    </div>
  );
}

export default EarthTransition;
