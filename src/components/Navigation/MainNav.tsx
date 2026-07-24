"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductSwitcher from "@/components/ProductSwitcher/ProductSwitcher";

export type PillarNavigation = {
  links: Array<{ href: string; label: string }>;
  cta: {
    href: string;
    label: string;
    accent: "water" | "press" | "fire" | "earth" | "guardian" | "constellation";
  };
};

const EARTH_NAVIGATION: PillarNavigation = {
  links: [
    { href: "/pillars/presence", label: "Presence" },
    { href: "/pillars/press", label: "Press" },
    { href: "/pillars/studios", label: "Studios" },
    { href: "/pillars/foundation", label: "Foundation" },
    { href: "/pillars/guardian", label: "Guardian" },
  ],
  cta: { href: "/reading", label: "Get Reading →", accent: "constellation" },
};

const STUDIOS_NAVIGATION: PillarNavigation = {
  links: [
    { href: "/pillars/studios/about", label: "About" },
    { href: "/pillars/studios/catalog", label: "Catalog" },
    { href: "/pillars/studios/services", label: "Services" },
    { href: "/events", label: "Calendar" },
  ],
  cta: { href: "/apply", label: "Apply →", accent: "water" },
};

const PRESS_NAVIGATION: PillarNavigation = {
  links: [
    { href: "/pillars/press/about", label: "About" },
    { href: "/pillars/press/library", label: "Library" },
    { href: "/pillars/press/collections", label: "Collections" },
  ],
  cta: {
    href: "/pillars/press/submissions",
    label: "Submit →",
    accent: "press",
  },
};

const PRESENCE_NAVIGATION: PillarNavigation = {
  links: [
    { href: "/pillars/presence/gatherings", label: "Gatherings" },
    { href: "/pillars/presence/men", label: "Men" },
    { href: "/pillars/presence/women", label: "Women" },
    { href: "/pillars/presence/retreats", label: "Retreats" },
    { href: "/pillars/presence/about", label: "About" },
  ],
  cta: {
    href: "/pillars/presence/gatherings",
    label: "Join a circle →",
    accent: "fire",
  },
};
const FOUNDATION_NAVIGATION: PillarNavigation = {
  links: [
    { href: "/pillars/foundation/garden", label: "Garden" },
    { href: "/pillars/foundation/dome", label: "Dome" },
    { href: "/pillars/foundation/visit", label: "Visit" },
    { href: "/pillars/foundation/about", label: "About" },
  ],
  cta: {
    href: "/pillars/foundation/waitlist",
    label: "Join the waitlist →",
    accent: "earth",
  },
};
const GUARDIAN_NAVIGATION: PillarNavigation = {
  links: [
    { href: "/pillars/guardian/quincunx", label: "Observer Seat" },
    { href: "/pillars/guardian/manifesto", label: "Manifesto" },
    { href: "/pillars/guardian/partners", label: "Partners" },
    { href: "/pillars/guardian/about", label: "About" },
  ],
  cta: {
    href: "/pillars/guardian/manifesto",
    label: "Read the code →",
    accent: "guardian",
  },
};
const OBSERVER_NAVIGATION: PillarNavigation = {
  links: [
    { href: "/observer", label: "Overview" },
    { href: "/observer/quincunx", label: "Living Quincunx" },
  ],
  cta: {
    href: "/observer/quincunx",
    label: "Enter ØDIN →",
    accent: "guardian",
  },
};

export function getPillarNavigation(pathname: string): PillarNavigation {
  const isObserver = pathname.startsWith("/observer");
  const isPress = pathname.startsWith("/pillars/press");
  const isPresence = pathname.startsWith("/pillars/presence");
  const isFoundation = pathname.startsWith("/pillars/foundation");
  const isGuardian = pathname.startsWith("/pillars/guardian");
  const isStudios = pathname.startsWith("/pillars/studios") || pathname === "/services";
  return isObserver ? OBSERVER_NAVIGATION : isGuardian ? GUARDIAN_NAVIGATION : isFoundation ? FOUNDATION_NAVIGATION : isPresence ? PRESENCE_NAVIGATION : isPress ? PRESS_NAVIGATION : isStudios ? STUDIOS_NAVIGATION : EARTH_NAVIGATION;
}

export function secondaryLinkColor(accent: PillarNavigation["cta"]["accent"]) {
  return accent === "guardian" ? "text-guardian" : accent === "press" ? "text-press" : accent === "fire" ? "text-fire" : accent === "earth" ? "text-earth" : accent === "water" ? "text-water" : "text-bone";
}

type MainNavProps = { onMenuOpen: () => void };

export default function MainNav({ onMenuOpen }: MainNavProps) {
  const pathname = usePathname();
  const isPress = pathname.startsWith("/pillars/press");
  const isPresence = pathname.startsWith("/pillars/presence");
  const isFoundation = pathname.startsWith("/pillars/foundation");
  const isGuardian = pathname.startsWith("/pillars/guardian") || pathname.startsWith("/observer");
  const isStudios =
    pathname.startsWith("/pillars/studios") || pathname === "/services";
  const navigation = getPillarNavigation(pathname);
  const accentClasses =
    navigation.cta.accent === "constellation"
      ? "border-bone text-bone hover:bg-bone hover:text-void"
      : navigation.cta.accent === "guardian"
        ? "border-guardian text-guardian hover:bg-guardian hover:text-void"
        : navigation.cta.accent === "press"
          ? "border-press text-press hover:bg-press hover:text-void"
          : navigation.cta.accent === "fire"
            ? "border-fire bg-fire text-void hover:bg-transparent hover:text-fire"
            : navigation.cta.accent === "earth"
              ? "border-earth bg-earth text-bone hover:bg-transparent hover:text-earth"
              : "border-water bg-water text-void hover:bg-transparent hover:text-water";

  return (
    <div className="border-b border-mercury bg-carbon">
      <nav
        className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6"
        aria-label="Pillar navigation"
      >
        <ProductSwitcher />
        <div className="hidden items-center gap-4 md:flex xl:gap-6">
          {navigation.links.map((link) => (
            <Link key={link.href} href={link.href} className={`${linkClass} ${secondaryLinkColor(navigation.cta.accent)}`}>
              {link.label}
            </Link>
          ))}
          <Link
            href={navigation.cta.href}
            className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${accentClasses}`}
          >
            {navigation.cta.label}
          </Link>
        </div>
        <button
          type="button"
          onClick={onMenuOpen}
          className={`flex min-h-11 min-w-11 items-center justify-center text-bone transition-colors md:hidden ${isGuardian ? "hover:text-guardian" : isFoundation ? "hover:text-earth" : isPresence ? "hover:text-fire" : isPress ? "hover:text-press" : isStudios ? "hover:text-water" : "hover:text-bone"}`}
          aria-label="Open navigation"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}

const linkClass =
  "font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:text-bone focus-visible:text-bone";
