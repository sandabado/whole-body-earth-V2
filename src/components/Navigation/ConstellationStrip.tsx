"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { PILLARS } from "@/lib/pillars";
import { Disclosure } from "@/components/ui/Disclosure";
import { CloverPortal } from "@/components/shared/CloverPortal";

const FOOTER_CONSTELLATION = [
  "presence",
  "press",
  "studios",
  "foundation",
  "guardian",
] as const;

export default function ConstellationStrip() {
  return (
    <footer className="relative z-10 mt-auto border-t border-mercury bg-carbon">
      <div className="hidden border-b border-mercury px-6 py-2 text-center md:block">
        <Link
          href="/"
          className="footer-system-status font-mono text-xs tracking-widest text-water"
        >
          SYSTEM STATUS: ALL CHANNELS ACTIVE
        </Link>
      </div>
      <div className="border-b border-mercury md:hidden">
        <Disclosure
          summary="SYSTEM STATUS: ALL CHANNELS ACTIVE"
          className="mx-auto max-w-[1200px]"
          summaryClassName="px-5 py-4 font-mono text-[10px] tracking-[.13em] text-water transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-water"
          contentClassName="border-t border-mercury"
        >
          <nav
            aria-label="Explore the five pillars"
            className="divide-y divide-mercury"
          >
            <FooterPillarLinks compact />
          </nav>
        </Disclosure>
      </div>
      <div className="mx-auto hidden max-w-[1200px] px-6 py-6 md:block">
        <div className="flex flex-wrap items-stretch justify-center gap-x-3 gap-y-3 sm:gap-x-5">
          <FooterPillarLinks />
        </div>
      </div>
      <div className="border-t border-mercury px-6 py-4">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-xs text-ghost">
          <span>wholebody.earth · Copyright © 2026 Whole Body Mastery LLC</span>
          <Link
            href="/reading"
            className="transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-water"
          >
            Reading
          </Link>
          <Link
            href="/mission"
            className="transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-water"
          >
            Mission
          </Link>
          <Link
            href="/legal/privacy"
            className="transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-water"
          >
            Privacy
          </Link>
          <Link
            href="/legal/terms"
            className="transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-water"
          >
            Terms
          </Link>
          <Link
            href="/store"
            className="transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-water"
          >
            Store
          </Link>
          <Link
            href="/careers"
            className="transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-water"
          >
            Careers
          </Link>
          <a
            href="https://wholebody.studio"
            className="transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-water"
          >
            wholebody.studio
          </a>
          <a
            href="https://wholebody.press"
            className="transition-colors hover:text-water focus-visible:outline-2 focus-visible:outline-water"
          >
            wholebody.press
          </a>
        </div>
      </div>
      <p className="border-t border-mercury bg-void px-6 py-4 text-center font-mono text-xs tracking-widest text-ghost">
        <span className="block">
          So It Is Built. So It Holds. So It Is. <CloverPortal />
        </span>
        <span className="mt-2 block text-[10px] tracking-normal">
          This site does not track you. We do not sell your data. We protect it.
        </span>
      </p>
    </footer>
  );
}

function FooterPillarLinks({ compact = false }: { compact?: boolean }) {
  return FOOTER_CONSTELLATION.map((id) => {
    const pillar = PILLARS[id];
    return (
      <Link
        key={id}
        href={pillar.href}
        className={
          compact
            ? "footer-constellation-link group flex items-center gap-3 px-5 py-3"
            : "footer-constellation-link group flex min-w-[6.8rem] flex-col items-center justify-center gap-1 border border-transparent px-4 py-3 text-center"
        }
        style={{ "--constellation-color": pillar.color } as CSSProperties}
      >
        <span
          className="alchemical-glyph text-2xl leading-none"
          aria-hidden="true"
        >
          {pillar.symbol}
        </span>
        <span
          className={
            compact ? "flex min-w-0 flex-1 flex-col gap-0.5" : "contents"
          }
        >
          <span className="font-display text-xs">{pillar.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest">
            {pillar.releaseLabel}
          </span>
        </span>
        {compact ? (
          <span
            aria-hidden="true"
            className="font-mono text-xs text-ghost transition-colors group-hover:text-[var(--constellation-color)]"
          >
            →
          </span>
        ) : null}
        <span className="sr-only">Visit Whole Body {pillar.name}</span>
      </Link>
    );
  });
}
