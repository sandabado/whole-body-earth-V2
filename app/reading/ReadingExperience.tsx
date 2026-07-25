"use client";

import Link from "next/link";
import styles from "./reading.module.css";

export function ReadingExperience() {
  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/">← Command deck</Link>
      <section className={styles.reading} aria-labelledby="reading-title">
        <span className={styles.mark} aria-hidden="true">⊙</span>
        <p className={styles.eyebrow}>WHOLE BODY DESIGN / READING PORTAL</p>
        <h1 id="reading-title">Your reading<br />belongs here.</h1>
        <p className={styles.body}>
          The complete Whole Body Design Reading is being brought into this
          doorway. This quiet placeholder keeps the path open without
          duplicating the original system.
        </p>
        <Link className={styles.return} href="/">
          Return to the living constellation <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
