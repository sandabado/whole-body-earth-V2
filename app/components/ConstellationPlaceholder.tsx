"use client";

import { useState } from "react";
import { ProductSwitcher } from "./ProductSwitcher";
import { WholeBodyFooter } from "./WholeBodyFooter";
import styles from "./ConstellationPlaceholder.module.css";

/**
 * Guardian's temporary constellation landing surface.
 *
 * Keeping this component Guardian-only prevents the homepage's WebGL command
 * deck from being bundled into a route that never renders it.
 */
export function ConstellationPlaceholder() {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <div className={`${styles.page} ${styles.guardian}`}>
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.geometry} aria-hidden="true">
        <i /><i /><i /><i /><i />
        <span>⊙</span>
      </div>

      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={() => setSwitcherOpen(true)} aria-haspopup="dialog" aria-expanded={switcherOpen}>
          <span aria-hidden="true">⊙</span>
          <b>WHOLE BODY <em>/GUARDIAN</em></b>
          <small aria-hidden="true">••<br />••</small>
        </button>
        <p>ETHER PILLAR / AGREEMENTS</p>
      </header>

      <main className={styles.main}>
        <p className={styles.eyebrow}>WHOLE BODY / GUARDIAN</p>
        <h1>
          THE BOUNDARY
          <br />
          <em>THAT HOLDS.</em>
        </h1>
        <p className={styles.declaration}>
          Guardian is the Ether pillar: agreements, stewardship, protection,
          and the invisible architecture that lets every other body remain
          sovereign.
        </p>
        <div className={styles.awaiting}>
          <span>STATUS / PLACEHOLDER</span>
          <strong>AWAITING INSTRUCTION</strong>
          <p>The door is marked. The agreements will be written here.</p>
        </div>
      </main>

      <WholeBodyFooter />

      <ProductSwitcher current="guardian" open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </div>
  );
}
