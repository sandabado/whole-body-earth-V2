"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ProductSwitcher } from "./ProductSwitcher";
import styles from "./ConstellationPlaceholder.module.css";

type Mode = "whole" | "guardian";

const pillars = [
  { name: "Foundation", element: "Earth", glyph: "🜃", href: "/foundation", color: "#84A66E" },
  { name: "Studios", element: "Water", glyph: "🜄", href: "/studios", color: "#2BA8A0" },
  { name: "Presence", element: "Fire", glyph: "🜂", href: "/presence", color: "#E8542A" },
  { name: "Press", element: "Air", glyph: "🜁", href: "/press", color: "#C9A227" },
  { name: "Guardian", element: "Ether", glyph: "☉", href: "/guardian", color: "#8B6FD6" },
] as const;

export function ConstellationPlaceholder({ mode }: { mode: Mode }) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const guardian = mode === "guardian";

  return (
    <div className={`${styles.page} ${guardian ? styles.guardian : ""}`}>
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.geometry} aria-hidden="true">
        <i /><i /><i /><i /><i />
        <span>{guardian ? "☉" : "◎"}</span>
      </div>

      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={() => setSwitcherOpen(true)} aria-haspopup="dialog" aria-expanded={switcherOpen}>
          <span aria-hidden="true">{guardian ? "☉" : "◎"}</span>
          <b>WHOLE BODY <em>/{guardian ? "GUARDIAN" : "EARTH"}</em></b>
          <small aria-hidden="true">••<br />••</small>
        </button>
        <p>{guardian ? "ETHER PILLAR / AGREEMENTS" : "ROOT SYSTEM / ALL ELEMENTS"}</p>
      </header>

      <main className={styles.main}>
        <p className={styles.eyebrow}>{guardian ? "WHOLE BODY / GUARDIAN" : "WHOLE BODY EARTH"}</p>
        <h1>{guardian ? <>THE BOUNDARY<br /><em>THAT HOLDS.</em></> : <>THE WHOLE BODY<br /><em>CONSTELLATION.</em></>}</h1>
        <p className={styles.declaration}>
          {guardian
            ? "Guardian is the Ether pillar: agreements, stewardship, protection, and the invisible architecture that lets every other body remain sovereign."
            : "You have five bodies. Mental. Physical. Emotional. Spiritual. Ethereal. Each maps to an element. Each element maps to a pillar of work."}
        </p>

        {guardian ? (
          <div className={styles.awaiting}>
            <span>STATUS / PLACEHOLDER</span>
            <strong>AWAITING INSTRUCTION</strong>
            <p>The door is marked. The agreements will be written here.</p>
          </div>
        ) : (
          <nav className={styles.pillars} aria-label="Whole Body pillars">
            {pillars.map((pillar, index) => (
              <Link
                key={pillar.name}
                href={pillar.href}
                style={{ "--pillar-color": pillar.color } as CSSProperties}
              >
                <span>0{index + 1}</span>
                <b aria-hidden="true">{pillar.glyph}</b>
                <strong>{pillar.name}</strong>
                <em>{pillar.element}</em>
                <i aria-hidden="true">↗</i>
              </Link>
            ))}
          </nav>
        )}
      </main>

      <footer className={styles.footer}>
        <span>FIVE PILLARS. ONE WHOLE BODY.</span>
        <button type="button" onClick={() => setSwitcherOpen(true)}>OPEN CONSTELLATION ↗</button>
      </footer>

      <ProductSwitcher current={guardian ? "guardian" : "whole"} open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </div>
  );
}
