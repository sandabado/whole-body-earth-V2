"use client";

import Link from "next/link";
import { useState } from "react";
import { EpicHomeExperience } from "./home/EpicHomeExperience";
import { ProductSwitcher } from "./ProductSwitcher";
import styles from "./ConstellationPlaceholder.module.css";

type Mode = "whole" | "guardian";

export function ConstellationPlaceholder({ mode }: { mode: Mode }) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const guardian = mode === "guardian";

  return (
    <div
      className={`${styles.page} ${
        guardian ? styles.guardian : styles.epicPage
      }`}
    >
      {guardian ? (
        <>
          <div className={styles.sky} aria-hidden="true" />
          <div className={styles.geometry} aria-hidden="true">
            <i /><i /><i /><i /><i />
            <span>☉</span>
          </div>
        </>
      ) : null}

      <header
        className={`${styles.header} ${guardian ? "" : styles.epicHeader}`}
      >
        <button type="button" className={styles.brand} onClick={() => setSwitcherOpen(true)} aria-haspopup="dialog" aria-expanded={switcherOpen}>
          <span aria-hidden="true">{guardian ? "☉" : "◎"}</span>
          <b>WHOLE BODY <em>/{guardian ? "GUARDIAN" : "EARTH"}</em></b>
          <small aria-hidden="true">••<br />••</small>
        </button>
        <p>{guardian ? "ETHER PILLAR / AGREEMENTS" : "ROOT SYSTEM / ALL ELEMENTS"}</p>
      </header>

      {guardian ? (
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
      ) : (
        <main className={styles.epicMain}>
          <EpicHomeExperience />
        </main>
      )}

      <footer
        className={`${styles.footer} ${guardian ? "" : styles.epicFooter}`}
      >
        <span>FIVE PILLARS. ONE WHOLE BODY.</span>
        <div className={styles.footerActions}>
          {!guardian ? (
            <Link
              href="/observer/reading"
              className={styles.clover}
              aria-label="Decode your Whole Body"
            >
              🍀
            </Link>
          ) : null}
          <button type="button" onClick={() => setSwitcherOpen(true)}>
            OPEN CONSTELLATION ↗
          </button>
        </div>
      </footer>

      <ProductSwitcher current={guardian ? "guardian" : "whole"} open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </div>
  );
}
