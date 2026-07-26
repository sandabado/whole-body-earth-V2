"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import styles from "./ProductSwitcher.module.css";

export type WholeBodySite =
  | "whole"
  | "foundation"
  | "studios"
  | "presence"
  | "press"
  | "guardian";

type ProductSwitcherProps = {
  current: WholeBodySite;
  open: boolean;
  onClose: () => void;
};

type Product = {
  id: WholeBodySite;
  index: string;
  name: string;
  element: string;
  description: string;
  glyph: string;
  href: string;
  accent: string;
};

const products: Product[] = [
  {
    id: "whole",
    index: "00",
    name: "WHOLE",
    element: "ALL ELEMENTS",
    description: "Root",
    glyph: "✦",
    href: "/",
    accent: "#EDEDED",
  },
  {
    id: "presence",
    index: "01",
    name: "PRESENCE",
    element: "FIRE",
    description: "The gathering",
    glyph: "🜂︎",
    href: "/presence",
    accent: "#E8542A",
  },
  {
    id: "press",
    index: "02",
    name: "PRESS",
    element: "AIR",
    description: "The word",
    glyph: "🜁︎",
    href: "/press",
    accent: "#C9A227",
  },
  {
    id: "studios",
    index: "03",
    name: "STUDIOS",
    element: "WATER",
    description: "The signal",
    glyph: "🜄︎",
    href: "/studios",
    accent: "#2BA8A0",
  },
  {
    id: "foundation",
    index: "04",
    name: "FOUNDATION",
    element: "EARTH",
    description: "The ground",
    glyph: "🜃︎",
    href: "/foundation",
    accent: "#84A66E",
  },
  {
    id: "guardian",
    index: "05",
    name: "GUARDIAN",
    element: "ETHER",
    description: "The agreements",
    glyph: "⊙",
    href: "/guardian",
    accent: "#8B6FD6",
  },
];

const focusableSelector =
  "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function ProductSwitcher({
  current,
  open,
  onClose,
}: ProductSwitcherProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const currentProduct =
    products.find((product) => product.id === current) ?? products[0];

  const requestClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [open, requestClose]);

  if (!open) return null;

  const switcherStyle = {
    "--switcher-accent": currentProduct.accent,
  } as CSSProperties;

  return (
    <div
      className={styles.backdrop}
      style={switcherStyle}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={dialogRef}
        id="constellation-dialog"
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="constellation-title"
        aria-describedby="constellation-description"
      >
        <button
          ref={closeRef}
          className={styles.close}
          type="button"
          onClick={requestClose}
        >
          CLOSE <span aria-hidden="true">×</span>
        </button>

        <div className={styles.inner}>
          <p className={styles.eyebrow}>THE CONSTELLATION / SIX DOORS</p>
          <h2 id="constellation-title">
            FIVE PILLARS.
            <br />
            ONE WHOLE BODY.
          </h2>
          <p id="constellation-description" className={styles.description}>
            Move between the Whole Body systems without losing the thread.
          </p>

          <div className={styles.list}>
            {products.map((product) => {
              const rowStyle = {
                "--ray-accent": product.accent,
              } as CSSProperties;
              const content = (
                <>
                  <span className={styles.index}>{product.index}</span>
                  <span className={styles.glyph} aria-hidden="true">
                    {product.glyph}
                  </span>
                  <strong>{product.name}</strong>
                  <em>
                    {product.element} /{" "}
                    {product.id === current
                      ? "YOU ARE HERE"
                      : product.description}
                  </em>
                  <b aria-hidden="true">
                    {product.id === current ? "●" : "↗"}
                  </b>
                </>
              );

              if (product.id === current) {
                return (
                  <div
                    key={product.id}
                    className={`${styles.row} ${styles.current}`}
                    style={rowStyle}
                    aria-current="page"
                  >
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={product.id}
                  className={styles.row}
                  style={rowStyle}
                  href={product.href}
                  aria-label={`${product.name}, ${product.element}`}
                >
                  {content}
                </a>
              );
            })}
          </div>

          <p className={styles.mantra}>
            SO IT IS BUILT. SO IT HOLDS. SO IT IS.{" "}
            <span aria-hidden="true">✦</span>
          </p>
        </div>
      </div>
    </div>
  );
}
