"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppLauncherModal from "./AppLauncherModal";

export default function ProductSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isPressPillar = pathname.startsWith("/pillars/press");
  const isPresencePillar = pathname.startsWith("/pillars/presence");
  const isFoundationPillar = pathname.startsWith("/pillars/foundation");
  const isGuardianPillar = pathname.startsWith("/pillars/guardian");
  const isEarthPortal = !pathname.startsWith("/pillars/");
  const currentPillar = isEarthPortal
    ? { href: "/", glyph: "♁", name: "Whole Body Earth", shortName: "Earth", accent: "earth-portal-mark" }
    : isGuardianPillar
    ? { href: "/pillars/guardian", glyph: "☉", name: "Whole Body Guardian", shortName: "Guardian", accent: "text-guardian" }
    : isFoundationPillar
    ? { href: "/pillars/foundation", glyph: "🜃", name: "Whole Body Foundation", shortName: "Foundation", accent: "text-earth" }
    : isPresencePillar
    ? { href: "/pillars/presence", glyph: "🜂", name: "Whole Body Presence", shortName: "Presence", accent: "text-fire" }
    : isPressPillar
    ? { href: "/pillars/press", glyph: "🜁", name: "Whole Body Press", shortName: "Press", accent: "text-press" }
    : { href: "/pillars/studios", glyph: "🜄", name: "Whole Body Studios", shortName: "Studios", accent: "text-water" };

  return (
    <div className="relative" onPointerDown={(event) => event.stopPropagation()}>
      <div className="flex items-center gap-2">
        <Link href={currentPillar.href} className={`alchemical-glyph text-2xl transition-opacity hover:opacity-80 ${currentPillar.accent}`} aria-label={`Go to ${currentPillar.name} homepage`}>{currentPillar.glyph}</Link>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex items-center gap-1 font-display text-sm font-semibold uppercase tracking-wider text-bone transition-colors hover:text-bone focus:outline-none sm:text-base"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <span className="hidden sm:inline">{currentPillar.name}</span><span className="sm:hidden">{currentPillar.shortName}</span>
          <span className={`font-mono text-ghost transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
        </button>
      </div>
      <AppLauncherModal isOpen={isOpen} onClose={() => setIsOpen(false)} activePillar={isEarthPortal ? "Whole Body Earth" : isGuardianPillar ? "Guardian" : isFoundationPillar ? "Foundation" : isPresencePillar ? "Presence" : isPressPillar ? "Press" : "Studios"} />
    </div>
  );
}
