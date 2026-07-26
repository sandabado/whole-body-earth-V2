import type { CSSProperties } from "react";
import styles from "../home/TransitionOverlay.module.css";

type StarStyle = CSSProperties & {
  "--star-x": string;
  "--star-y": string;
  "--star-delay": string;
  "--star-size": string;
};

const stars = Array.from({ length: 48 }, (_, index) => ({
  x: 5 + ((index * 41) % 90),
  y: 7 + ((index * 67) % 86),
  delay: 80 + (index % 15) * 36,
  size: 2 + (index % 4),
}));

export function EtherTransition() {
  return (
    <div className={`${styles.scene} ${styles.ether}`} aria-hidden="true">
      <div className={styles.constellation} />
      {stars.map((star, index) => (
        <i
          key={index}
          className={styles.star}
          style={{
            "--star-x": `${star.x}%`,
            "--star-y": `${star.y}%`,
            "--star-delay": `${star.delay}ms`,
            "--star-size": `${star.size}px`,
          } as StarStyle}
        />
      ))}
      <div className={styles.violetFlame} />
      <div className={`${styles.solid} ${styles.dodecahedron}`} />
      <div className={styles.ritualCopy}>
        <p className={styles.ritualKicker}>The Void · Guardian</p>
        <p className={styles.ritualTitle}>Entering the Ether Pillar</p>
      </div>
    </div>
  );
}

export default EtherTransition;
