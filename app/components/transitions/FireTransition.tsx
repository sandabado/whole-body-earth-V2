import type { CSSProperties } from "react";
import styles from "../TransitionOverlay.module.css";

type ParticleStyle = CSSProperties & {
  "--angle": string;
  "--distance": string;
  "--delay": string;
  "--particle-size": string;
};

const particles = Array.from({ length: 72 }, (_, index) => {
  const angle = (index * 137.508) % 360;
  const distance = 30 + (index % 9) * 5;
  const delay = (index % 12) * 18;
  const size = 2 + (index % 4);
  return { angle, distance, delay, size };
});

export function FireTransition() {
  return (
    <div className={`${styles.scene} ${styles.fire}`} aria-hidden="true">
      <div className={styles.heat} />
      <div className={styles.particleField}>
        {particles.map((particle, index) => (
          <i
            key={index}
            className={styles.fireParticle}
            style={{
              "--angle": `${particle.angle}deg`,
              "--distance": `${particle.distance}vmax`,
              "--delay": `${particle.delay}ms`,
              "--particle-size": `${particle.size}px`,
            } as ParticleStyle}
          />
        ))}
      </div>
      <div className={`${styles.solid} ${styles.tetrahedron}`} />
      <div className={styles.ritualCopy}>
        <p className={styles.ritualKicker}>The Forge · Presence</p>
        <p className={styles.ritualTitle}>Entering the Fire Pillar</p>
      </div>
    </div>
  );
}

export default FireTransition;
