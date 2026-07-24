"use client";

import Link from "next/link";
import AccountMenu from "./AccountMenu";

export default function TopNav() {
  return (
    <div className="border-b border-mercury bg-void/95 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:grid md:h-11 md:grid-cols-[1fr_auto_1fr] md:px-6"
        aria-label="Whole Body Earth navigation"
      >
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center gap-2 justify-self-start font-display text-base font-semibold tracking-wide transition hover:opacity-80 md:text-xl"
        >
          <span className="earth-portal-mark alchemical-glyph text-2xl md:text-3xl">
            ♁
          </span>
          <span className="earth-portal-wordmark md:hidden">Whole Body</span>
          <span className="earth-portal-wordmark hidden md:inline">
            Whole Body Earth
          </span>
        </Link>
        <div className="hidden items-center justify-self-center gap-5 md:flex">
          <Link href="/mission" className={linkClass}>
            Mission
          </Link>
          <Link href="/store" className={linkClass}>
            Store
          </Link>
          <Link href="/events" className={linkClass}>
            Calendar
          </Link>
          <Link href="/reading" className={linkClass}>
            Reading
          </Link>
          <Link href="/careers" className={linkClass}>
            Guild
          </Link>
          <Link href="/observer" className="font-mono text-[10px] uppercase tracking-[0.12em] text-guardian transition-colors hover:text-bone">
            ØDIN
          </Link>
        </div>
        <div className="justify-self-end">
          <AccountMenu />
        </div>
      </nav>
    </div>
  );
}

const linkClass =
  "font-mono text-[10px] uppercase tracking-[0.1em] text-ghost transition-colors hover:text-bone focus-visible:text-bone";
