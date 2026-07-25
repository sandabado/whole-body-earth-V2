"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { WholeBodyFooter } from "@/app/components/WholeBodyFooter";
import { CubeBackground } from "./CubeBackground";
import { ProductSwitcher } from "./ProductSwitcher";

const links = [
  ["/press/", "Home"],
  ["/press/catalog", "Catalog"],
  ["/press/authors", "Authors"],
  ["/press/events", "Events"],
  ["/press/craft", "Craft"],
  ["/press/about", "About"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSwitcherOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <div className="pillar-spine pillar-spine--press">
      {pathname !== "/press" && pathname !== "/press/" && <CubeBackground />}
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <button
          className="brand"
          type="button"
          onClick={() => setSwitcherOpen(true)}
          aria-label="Open Whole Body product switcher"
          aria-haspopup="dialog"
          aria-expanded={switcherOpen}
          aria-controls="constellation-dialog"
        >
          <span className="brand-mark">🜁</span>
          <span>WHOLE BODY<span>/PRESS</span></span>
          <span className="brand-grid" aria-hidden="true">••<br />••</span>
        </button>
        <nav className={menuOpen ? "nav-links nav-links--open open" : "nav-links"} aria-label="Primary navigation">
          {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "active" : ""} onClick={() => setMenuOpen(false)}>{label}</Link>)}
          <Link className="nav-apply" href="/press/submit" onClick={() => setMenuOpen(false)}>Submit</Link>
        </nav>
        <div className="header-tools">
          <span className="press-status"><i />FIRST EDITIONS — 2027</span>
          <button className="menu-toggle" onClick={() => setMenuOpen(value => !value)} aria-expanded={menuOpen}>MENU</button>
        </div>
      </header>
      <ProductSwitcher
        current="press"
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />
      <main>{children}</main>
      <WholeBodyFooter />
    </div>
  );
}
