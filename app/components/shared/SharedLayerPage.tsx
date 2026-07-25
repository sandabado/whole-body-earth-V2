"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductSwitcher } from "../ProductSwitcher";
import styles from "./SharedLayerPage.module.css";

export type SharedLayerId = "calendar" | "store" | "guild" | "library" | "media";

export interface SharedLayerItem {
  glyph: string;
  meta: string;
  title: string;
  description: string;
  status: string;
  href: string;
}

interface SharedLayerPageProps {
  id: SharedLayerId;
  index: string;
  eyebrow: string;
  title: string;
  introduction: string;
  items: readonly SharedLayerItem[];
}

const sharedLayers: ReadonlyArray<{ id: SharedLayerId; label: string; href: string }> = [
  { id: "calendar", label: "Calendar", href: "/calendar" },
  { id: "store", label: "Store", href: "/store" },
  { id: "guild", label: "Guild", href: "/guild" },
  { id: "library", label: "Library", href: "/library" },
  { id: "media", label: "Media", href: "/media" },
];

export function SharedLayerPage({
  id,
  index,
  eyebrow,
  title,
  introduction,
  items,
}: SharedLayerPageProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span aria-hidden="true">⊙</span>
          <b>WHOLE BODY EARTH</b>
        </Link>
        <button
          className={styles.quincunxButton}
          type="button"
          onClick={() => setSwitcherOpen(true)}
          aria-label="Open the Whole Body constellation"
          aria-haspopup="dialog"
          aria-expanded={switcherOpen}
          aria-controls="constellation-dialog"
        >
          <i /><i /><i /><i /><i />
        </button>
        <nav className={styles.headerNav} aria-label="Shared layers">
          {sharedLayers.map((layer) => (
            <Link
              key={layer.id}
              href={layer.href}
              aria-current={layer.id === id ? "page" : undefined}
            >
              {layer.label}
            </Link>
          ))}
        </nav>
      </header>

      <ProductSwitcher
        current="whole"
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />

      <main className={styles.main}>
        <div className={styles.starMap} aria-hidden="true">
          <i /><i /><i /><i /><i />
          <span /><span /><span /><span />
        </div>

        <section className={styles.hero} aria-labelledby={`${id}-title`}>
          <div className={styles.coordinates}>
            <span>WB/SHARED/{index}</span>
            <span>OBSIDIAN SPINE · LIVE PROTOTYPE</span>
          </div>
          <p>{eyebrow}</p>
          <h1 id={`${id}-title`}>{title}</h1>
          <p className={styles.introduction}>{introduction}</p>
        </section>

        <section className={styles.register} aria-label={`${title} index`}>
          <header>
            <span>INDEX / {String(items.length).padStart(2, "0")} SIGNALS</span>
            <span>SELECT A ROW TO CONTINUE</span>
          </header>
          {items.map((item, itemIndex) => (
            <Link className={styles.row} href={item.href} key={`${item.meta}-${item.title}`}>
              <span className={styles.rowIndex}>{String(itemIndex + 1).padStart(2, "0")}</span>
              <i className={styles.glyph} aria-hidden="true">{item.glyph}</i>
              <span className={styles.rowCopy}>
                <small>{item.meta}</small>
                <strong>{item.title}</strong>
                <em>{item.description}</em>
              </span>
              <span className={styles.status}>{item.status}</span>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </section>

        <nav className={styles.layerRail} aria-label="All shared layers">
          {sharedLayers.map((layer, layerIndex) => (
            <Link
              key={layer.id}
              href={layer.href}
              aria-current={layer.id === id ? "page" : undefined}
            >
              <span>{String(layerIndex + 8).padStart(2, "0")}</span>
              <b>{layer.label}</b>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
