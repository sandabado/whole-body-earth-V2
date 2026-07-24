"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TopNav from "./TopNav";
import MainNav, { getPillarNavigation, secondaryLinkColor, type PillarNavigation } from "./MainNav";
import { PILLAR_LIST } from "@/lib/pillars";
import { Disclosure } from "@/components/ui/Disclosure";

export default function NavStack() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && setMenuOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  if (pathname === "/") return <EarthNavigation />;

  return (
    <header className="sticky top-0 z-[90]">
      <TopNav />
      <MainNav onMenuOpen={() => setMenuOpen(true)} />
      {menuOpen && (
        <MobileDrawer
          onClose={() => setMenuOpen(false)}
          navigation={getPillarNavigation(pathname)}
        />
      )}
    </header>
  );
}

function EarthNavigation() {
  return (
    <header className="earth-home-navigation pointer-events-none fixed inset-x-0 top-0 z-[90]">
      <div className="pointer-events-auto">
        <TopNav transparent />
      </div>
      <nav
        aria-label="The five pillars"
        className="pointer-events-auto border-b border-white/10 bg-black/10 backdrop-blur-sm"
      >
        <Disclosure
          summary={<span className="flex items-center gap-2"><span className="alchemical-glyph text-base">♁</span> Explore the five pillars</span>}
          className="md:hidden"
          summaryClassName="min-h-12 px-4 font-mono text-[10px] uppercase tracking-[.13em] text-bone transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-water"
          contentClassName="border-t border-mercury bg-carbon"
        >
          <div className="divide-y divide-mercury">
            <Link
              href="/observer"
              className="flex min-h-12 items-center justify-center gap-3 border-b border-guardian/50 bg-guardian/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[.16em] text-guardian transition-colors hover:bg-guardian/20"
            >
              <span className="text-lg leading-none">Ø</span>
              <span>ØDIN Observer</span>
            </Link>
            {PILLAR_LIST.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="flex min-h-11 items-center gap-3 px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] transition-colors hover:bg-void/40"
                style={{ color: pillar.color }}
              >
                <span className="alchemical-glyph text-lg leading-none">{pillar.symbol}</span>
                <span>{pillar.name}</span>
              </Link>
            ))}
          </div>
        </Disclosure>
        <div className="mx-auto hidden min-h-14 max-w-[1200px] md:flex">
          <Link
            href="/observer"
            className="group relative flex min-w-[9.5rem] items-center justify-center gap-2 border-y border-l border-guardian/60 bg-guardian/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-guardian transition-colors hover:bg-guardian/25"
          >
            <span className="text-base leading-none">Ø</span>
            <span>ØDIN</span>
          </Link>
          {PILLAR_LIST.map((pillar) => (
            <Link
              key={pillar.id}
              href={pillar.href}
              className="group relative flex min-w-[8.5rem] flex-1 items-center justify-center gap-2 border-r px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors first:border-l"
              style={{
                color: pillar.color,
                borderColor: `${pillar.color}75`,
                backgroundColor: `${pillar.color}0d`,
              }}
            >
              <span className="alchemical-glyph text-base leading-none">
                {pillar.symbol}
              </span>
              <span>{pillar.name}</span>
              <span className="absolute right-4 bottom-0 left-4 h-px origin-center scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function MobileDrawer({
  onClose,
  navigation,
}: {
  onClose: () => void;
  navigation: PillarNavigation;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-void/80 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="ml-auto flex h-full w-[min(22rem,88vw)] flex-col border-l border-mercury bg-carbon p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-mercury pb-4">
          <span className="font-display text-lg text-bone">🜄</span>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center text-bone transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
            aria-label="Close navigation"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="square"
                strokeWidth="2"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>
        <nav className="divide-y divide-mercury" aria-label="Mobile navigation">
          <div className="py-3">
            <DrawerLink href="/store" onClose={onClose}>
              Store
            </DrawerLink>
            <DrawerLink href="/reading" onClose={onClose}>
              Reading
            </DrawerLink>
            <DrawerLink href="/careers" onClose={onClose}>
              Careers
            </DrawerLink>
            <DrawerLink href="/login" onClose={onClose}>
              Login
            </DrawerLink>
          </div>
          <div className="py-3">
            {navigation.links.map((link) => (
              <DrawerLink key={link.label} href={link.href} onClose={onClose} colorClass={secondaryLinkColor(navigation.cta.accent)}>
                {link.label}
              </DrawerLink>
            ))}
            <Link
              href={navigation.cta.href}
              onClick={onClose}
              className={`mt-3 block border px-3 py-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] ${navigation.cta.accent === "guardian" ? "border-guardian bg-guardian text-void" : navigation.cta.accent === "press" ? "border-press bg-press text-void" : navigation.cta.accent === "fire" ? "border-fire bg-fire text-void" : navigation.cta.accent === "earth" ? "border-earth bg-earth text-void" : navigation.cta.accent === "water" ? "border-water bg-water text-void" : "border-bone bg-bone text-void"}`}
            >
              {navigation.cta.label}
            </Link>
          </div>
          <Disclosure
            summary="Switch pillar"
            summaryClassName="min-h-14 px-3 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-water transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-water"
            contentClassName="border-t border-mercury pb-3"
          >
            {PILLAR_LIST.map((pillar) => (
              <DrawerLink key={pillar.id} href={pillar.href} onClose={onClose} colorClass="text-ghost">
                <span className="mr-2 alchemical-glyph" style={{ color: pillar.color }}>{pillar.symbol}</span>
                {pillar.name}
              </DrawerLink>
            ))}
          </Disclosure>
        </nav>
      </div>
    </div>
  );
}

function DrawerLink({
  href,
  children,
  onClose,
  colorClass = "text-ghost",
}: {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
  colorClass?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`block px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:text-bone ${colorClass}`}
    >
      {children}
    </Link>
  );
}
