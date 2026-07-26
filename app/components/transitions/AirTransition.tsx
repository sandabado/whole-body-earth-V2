import type { CSSProperties } from "react";
import styles from "../TransitionOverlay.module.css";

type StreakStyle = CSSProperties & {
  "--streak-y": string;
  "--streak-delay": string;
};

const streaks = Array.from({ length: 22 }, (_, index) => ({
  y: 5 + ((index * 37) % 89),
  delay: (index % 8) * 52,
}));

export function AirTransition() {
  return (
    <div className={`${styles.scene} ${styles.air}`} aria-hidden="true">
      <div className={styles.fog} />
      <div className={styles.fog} />
      <div className={styles.fog} />
      {streaks.map((streak, index) => (
        <i
          key={index}
          className={styles.windStreak}
          style={{
            "--streak-y": `${streak.y}%`,
            "--streak-delay": `${streak.delay}ms`,
          } as StreakStyle}
        />
      ))}
      <div className={`${styles.solid} ${styles.octahedron}`} />
      <div className={styles.ritualCopy}>
        <p className={styles.ritualKicker}>The Wind Tunnel · Press</p>
        <p className={styles.ritualTitle}>Entering the Air Pillar</p>
      </div>
    </div>
  );
}

export default AirTransition;
