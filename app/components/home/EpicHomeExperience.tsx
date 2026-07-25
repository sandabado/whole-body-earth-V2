"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import HeroEngine from "../HeroEngine/HeroEngine";
import type { ActivePillar } from "../HeroEngine/config";
import HermeticCrest from "../hermetic-crest/HermeticCrest";
import { HeroQuincunx } from "./HeroQuincunx";
import { PillarShelf } from "./PillarShelf";
import { TopNav, type CommandPillar } from "./TopNav";

const CLOSE_DURATION_MS = 500;

function transitionDuration(): number {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : CLOSE_DURATION_MS;
}

export function EpicHomeExperience() {
  const [shelfPillar, setShelfPillar] = useState<CommandPillar | null>(null);
  const [shelfOpen, setShelfOpen] = useState(false);
  const switchTimerRef = useRef<number | null>(null);
  const focusTimerRef = useRef<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const clearTimers = useCallback(() => {
    if (switchTimerRef.current !== null) {
      window.clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }
    if (focusTimerRef.current !== null) {
      window.clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousRootHeight = root.style.height;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyHeight = body.style.height;

    root.style.overflow = "hidden";
    root.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.height = "100%";

    return () => {
      clearTimers();
      root.style.overflow = previousRootOverflow;
      root.style.height = previousRootHeight;
      body.style.overflow = previousBodyOverflow;
      body.style.height = previousBodyHeight;
    };
  }, [clearTimers]);

  const restoreTriggerFocus = useCallback(() => {
    focusTimerRef.current = window.setTimeout(() => {
      lastTriggerRef.current?.focus();
      focusTimerRef.current = null;
    }, transitionDuration());
  }, []);

  const closeShelf = useCallback(() => {
    clearTimers();
    setShelfOpen(false);
    restoreTriggerFocus();
  }, [clearTimers, restoreTriggerFocus]);

  const selectPillar = useCallback((pillar: CommandPillar, trigger: HTMLButtonElement) => {
    clearTimers();
    lastTriggerRef.current = trigger;

    if (shelfOpen && shelfPillar === pillar) {
      setShelfOpen(false);
      restoreTriggerFocus();
      return;
    }

    if (shelfOpen) {
      setShelfOpen(false);
      switchTimerRef.current = window.setTimeout(() => {
        setShelfPillar(pillar);
        setShelfOpen(true);
        switchTimerRef.current = null;
      }, transitionDuration());
      return;
    }

    setShelfPillar(pillar);
    window.requestAnimationFrame(() => setShelfOpen(true));
  }, [clearTimers, restoreTriggerFocus, shelfOpen, shelfPillar]);

  const activePillar: ActivePillar = shelfOpen && shelfPillar
    ? shelfPillar
    : "none";

  const selectDialPillar = useCallback((
    pillar: Exclude<ActivePillar, "none" | "whole">,
    trigger: HTMLButtonElement,
  ) => {
    selectPillar(pillar, trigger);
  }, [selectPillar]);

  return (
    <div className="epic-home command-deck-home" data-shelf-open={shelfOpen ? "true" : "false"}>
      <main>
        <HeroEngine
          autoRotate
          siteSlug="studios"
          activePillar={activePillar}
          ariaLabel="Whole Body Earth — five living pillars held in one constellation"
        >
          <div className="command-deck-vignette" aria-hidden="true" />
          <div className="command-deck-grain" aria-hidden="true" />

          <TopNav activePillar={activePillar} onSelect={selectPillar} />

          <div className="command-deck-hero-content" aria-hidden={shelfOpen ? true : undefined}>
            <h1>Whole Body Earth</h1>
            <p>Five pillars. One whole body.</p>
            <Link href="/reading" tabIndex={shelfOpen ? -1 : undefined}>
              Get Your Whole Body Design Reading <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="command-deck-visual">
            <div className="command-deck-constellation">
              <HeroQuincunx activePillar={activePillar} />
            </div>
            <div className="command-deck-dial-shell">
              <HermeticCrest
                size={720}
                activePillar={activePillar}
                onPillarSelect={selectDialPillar}
              />
            </div>
          </div>

          <PillarShelf
            activePillar={shelfPillar}
            open={shelfOpen}
            onClose={closeShelf}
          />

          <p className="command-deck-sr-only" aria-live="polite">
            {shelfOpen && shelfPillar
              ? `${shelfPillar} shelf open`
              : "All shelves closed"}
          </p>
        </HeroEngine>
      </main>
    </div>
  );
}
