"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import HeroEngine from "../HeroEngine/HeroEngine";
import type { ActivePillar } from "../HeroEngine/config";
import HermeticCrest from "../hermetic-crest/HermeticCrest";
import { useWholeBodyTransition } from "../WholeBodyTransition";
import { HeroQuincunx } from "./HeroQuincunx";
import { TopNav, type CommandPillar } from "./TopNav";

type NamedPillar = Exclude<ActivePillar, "none" | "whole">;

export function EpicHomeExperience() {
  const {
    activePillar,
    transitioning,
    beginTransition,
  } = useWholeBodyTransition();
  const [dialPreview, setDialPreview] = useState<NamedPillar | null>(null);
  const [dialTurnPillar, setDialTurnPillar] = useState<NamedPillar | null>(null);

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
      root.style.overflow = previousRootOverflow;
      root.style.height = previousRootHeight;
      body.style.overflow = previousBodyOverflow;
      body.style.height = previousBodyHeight;
    };
  }, []);

  const beginNamedTransition = useCallback((pillar: NamedPillar) => {
    setDialPreview(null);
    setDialTurnPillar(pillar);
    beginTransition(pillar);
  }, [beginTransition]);

  const selectNavPillar = useCallback((pillar: CommandPillar) => {
    setDialPreview(null);
    setDialTurnPillar(pillar === "whole" ? null : pillar);
    beginTransition(pillar);
  }, [beginTransition]);

  const previewDialPillar = useCallback((pillar: NamedPillar | null) => {
    if (!transitioning) setDialPreview(pillar);
  }, [transitioning]);

  const visualPillar: ActivePillar = dialPreview ?? activePillar;

  return (
    <div
      className="epic-home command-deck-home"
      data-transitioning={transitioning ? "true" : "false"}
    >
      <main>
        <HeroEngine
          autoRotate
          siteSlug="studios"
          backgroundVariant="cosmic"
          activePillar={visualPillar}
          transitioning={transitioning}
          showWholeEarthGlobe
          onWholeActivate={() => selectNavPillar("whole")}
          ariaLabel="Whole Body Earth — five living pillars held in one constellation"
        >
          <div className="command-deck-vignette" aria-hidden="true" />
          <div className="command-deck-grain" aria-hidden="true" />

          <TopNav activePillar={activePillar} onSelect={selectNavPillar} />

          <div
            className="command-deck-hero-content"
            aria-hidden={transitioning ? true : undefined}
            inert={transitioning ? true : undefined}
          >
            <h1>Whole Body Earth</h1>
            <p>Five pillars. One whole body.</p>
            <Link href="/reading" tabIndex={transitioning ? -1 : undefined}>
              Get Your Whole Body Design Reading <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            className="command-deck-visual"
            aria-hidden={transitioning ? true : undefined}
            inert={transitioning ? true : undefined}
          >
            <div className="command-deck-constellation">
              <HeroQuincunx
                activePillar={visualPillar}
                turnPillar={dialTurnPillar}
              />
            </div>
            <div className="command-deck-dial-shell">
              <HermeticCrest
                size={720}
                activePillar={visualPillar}
                onPillarPreview={previewDialPillar}
                onPillarTurnStart={setDialTurnPillar}
                onPillarActivate={beginNamedTransition}
              />
            </div>
          </div>

        </HeroEngine>
      </main>
    </div>
  );
}
