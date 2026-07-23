"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import styles from "./Navbar.module.css";

type NavbarProps = {
  onOpenSwitcher: () => void;
  switcherOpen: boolean;
};

const navItems = [
  { href: "/presence/about", label: "About" },
  { href: "/presence/practitioners", label: "Practitioners" },
  { href: "/presence/events", label: "Events" },
  { href: "/presence/sessions", label: "Sessions" },
  { href: "/presence/gallery", label: "Gallery" },
] as const;

const drawerItems = [{ href: "/presence/", label: "Home" }, ...navItems] as const;

const menuFocusableSelector = "a[href], button:not([disabled])";

export function Navbar({ onOpenSwitcher, switcherOpen }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerId = useId();
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setScrolled(window.scrollY > 14));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(menuFocusableSelector),
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
      menuButton?.focus();
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/presence/" ? pathname === "/presence/" : pathname.startsWith(href);

  const openSwitcher = () => {
    setMenuOpen(false);
    onOpenSwitcher();
  };

  const closeFromBackdrop = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setMenuOpen(false);
  };

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
        data-scrolled={scrolled ? "true" : "false"}
      >
        <div className={styles.brandLockup}>
          <Link
            className={styles.homeMark}
            href="/presence/"
            aria-label="Whole Body Presence home"
            title="Return home"
          >
            <span aria-hidden="true">🜂</span>
          </Link>
          <button
            className={styles.brandButton}
            type="button"
            onClick={openSwitcher}
            aria-haspopup="dialog"
            aria-expanded={switcherOpen}
            aria-controls="constellation-dialog"
          >
            <span className={styles.brandWords}>
              <span>Whole Body</span>
              <strong>Presence</strong>
            </span>
            <span className={styles.chevron} aria-hidden="true" />
            <span className={styles.srOnly}>Open constellation</span>
          </button>
        </div>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? styles.active : undefined}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <span className={styles.status} title="System status: Awaiting kindling">
            <i aria-hidden="true" />
            <span>Awaiting kindling</span>
          </span>
          <Link className={styles.join} href="/presence/waitlist">
            Join the fire
          </Link>
          <button
            ref={menuButtonRef}
            className={styles.menuButton}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-controls={drawerId}
            aria-expanded={menuOpen}
            aria-label="Open navigation menu"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span className={styles.srOnly}>Menu</span>
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className={styles.drawerBackdrop} onPointerDown={closeFromBackdrop}>
          <aside
            ref={drawerRef}
            id={drawerId}
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className={styles.drawerTop}>
              <div>
                <span className={styles.drawerGlyph} aria-hidden="true">
                  🜂
                </span>
                <p>Presence / Fire</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <nav className={styles.drawerNav} aria-label="Mobile primary navigation">
              {drawerItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? styles.drawerActive : undefined}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{String(index).padStart(2, "0")}</span>
                  {item.label}
                  <i aria-hidden="true">↗</i>
                </Link>
              ))}
            </nav>

            <div className={styles.drawerBottom}>
              <button type="button" onClick={openSwitcher}>
                Explore the constellation <span aria-hidden="true">→</span>
              </button>
              <Link href="/presence/waitlist" onClick={() => setMenuOpen(false)}>
                Join the fire
              </Link>
              <p>
                <i aria-hidden="true" /> System status: Awaiting kindling
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
