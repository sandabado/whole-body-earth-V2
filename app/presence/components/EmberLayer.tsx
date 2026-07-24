import type { CSSProperties } from "react";
import styles from "./EmberLayer.module.css";

const particleCount = 64;

function seededFraction(seed: number) {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

const particles = Array.from({ length: particleCount }, (_, index) => {
  const direction = index % 2 === 0 ? 1 : -1;
  const duration = 5.2 + seededFraction(index + 11) * 4.3;
  const spread = 12 + seededFraction(index + 29) * 70;
  return {
    id: index,
    style: {
      "--ember-x": `${(1 + seededFraction(index + 3) * 98).toFixed(2)}%`,
      "--ember-size": `${(1 + seededFraction(index + 7) * 2.4).toFixed(2)}px`,
      "--ember-alpha": (0.25 + seededFraction(index + 17) * 0.58).toFixed(3),
      "--ember-alpha-low": (0.12 + seededFraction(index + 17) * 0.25).toFixed(3),
      "--ember-duration": `${duration.toFixed(2)}s`,
      "--ember-delay": `${(-duration * seededFraction(index + 23)).toFixed(2)}s`,
      "--ember-drift-a": `${(spread * direction * -0.22).toFixed(1)}px`,
      "--ember-drift-b": `${(spread * direction).toFixed(1)}px`,
      "--ember-drift-c": `${(spread * direction * -0.5).toFixed(1)}px`,
    } as CSSProperties,
  };
});

export function EmberLayer() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={styles.field}>
        {particles.map((particle) => (
          <i key={particle.id} className={styles.ember} style={particle.style} />
        ))}
      </div>
    </div>
  );
}
