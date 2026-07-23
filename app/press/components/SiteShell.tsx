"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
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

  return <>
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
    <footer>
      <div className="status-line"><i/> SYSTEM STATUS: ONLINE · AIR CARRIES THE SIGNAL</div>
      <p>SO IT IS BUILT. SO IT HOLDS. SO IT IS. 🍀</p>
      <blockquote>“The book is the moment the signal locks into permanence.”</blockquote>
      <div className="footer-links">
        <Link href="/press/catalog">CATALOG</Link><Link href="/press/authors">AUTHORS</Link><Link href="/press/events">EVENTS</Link><Link href="/press/craft">CRAFT</Link><Link href="/press/submit">SUBMIT</Link><Link href="/press/contact">CONTACT</Link>
      </div>
      <div className="footer-legal"><Link href="/press/legal/privacy">PRIVACY</Link><Link href="/press/legal/terms">TERMS</Link><a href="https://wholebody.earth">WHOLEBODY.EARTH</a></div>
      <small>WHOLEBODY.PRESS · COPYRIGHT © 2026 WHOLE BODY GUILD LLC · 🜁 AIR</small>
    </footer>
  </>;
}
