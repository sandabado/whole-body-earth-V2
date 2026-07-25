"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { WholeBodyFooter } from "@/app/components/WholeBodyFooter";
import { ProductSwitcher } from "../../components/ProductSwitcher";
import { CubeBackground } from "./CubeBackground";

const links = [["/foundation", "Vision"], ["/foundation/the-build", "The Build"], ["/foundation/the-land", "The Land"], ["/foundation/the-garden", "The Garden"], ["/foundation/homes", "Homes"], ["/foundation/about", "About"]] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [switcher, setSwitcher] = useState(false);
  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", closeMenu);
    return () => window.removeEventListener("keydown", closeMenu);
  }, []);

  return (
    <div className="pillar-spine pillar-spine--foundation">
      <CubeBackground />
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <button className="brand" onClick={() => setSwitcher(true)} aria-label="Open Whole Body constellation">
          <b>🜃</b><span>WHOLE BODY<span>/FOUNDATION</span></span><small>••<br />••</small>
        </button>
        <nav className={menu ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          {links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? "active" : ""} onClick={() => setMenu(false)}>{label}</Link>)}
          <Link href="/foundation/apply" className="nav-apply" onClick={() => setMenu(false)}>Apply to Build</Link>
        </nav>
        <div className="header-tools"><span className="site-status"><i />LAND SEARCH ACTIVE</span><button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu}>MENU</button></div>
      </header>
      <ProductSwitcher current="foundation" open={switcher} onClose={() => setSwitcher(false)} />
      <main>{children}</main>
      <WholeBodyFooter />
    </div>
  );
}
