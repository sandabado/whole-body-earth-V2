"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import HeroEngine from "../HeroEngine/HeroEngine";
import type { ActivePillar } from "../HeroEngine/config";
import HermeticCrest from "../hermetic-crest/HermeticCrest";
import { HeroQuincunx } from "./HeroQuincunx";
import {
  PillarTransition,
  type PortalPillar,
} from "./PillarTransition";
import { TopNav, type CommandPillar } from "./TopNav";

type NamedPillar = PortalPillar;

export function EpicHomeExperience() {
  const router = useRouter();
  const [activePillar, setActivePillar] = useState<NamedPillar | "none">("none");
  const [dialPreview, setDialPreview] = useState<NamedPillar | null>(null);
  const [dialTurnPillar, setDialTurnPillar] = useState<NamedPillar | null>(null);
  const transitioning = activePillar !== "none";

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

  const beginTransition = useCallback((pillar: NamedPillar) => {
    setActivePillar((current) => {
      if (current !== "none") return current;
      return pillar;
    });
    setDialPreview(null);
    setDialTurnPillar(pillar);
  }, []);

  const beginNamedTransition = useCallback((pillar: NamedPillar) => {
    beginTransition(pillar);
  }, [beginTransition]);

  const selectNavPillar = useCallback((pillar: CommandPillar) => {
    if (pillar === "whole") {
      router.push("/calendar");
      return;
    }
    beginTransition(pillar);
  }, [beginTransition, router]);

  const previewDialPillar = useCallback((pillar: NamedPillar | null) => {
    if (!transitioning) setDialPreview(pillar);
  }, [transitioning]);

  const cancelTransition = useCallback(() => {
    setActivePillar("none");
    setDialPreview(null);
    setDialTurnPillar(null);
  }, []);

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
          activePillar={visualPillar}
          transitioning={transitioning}
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

          <PillarTransition
            activePillar={activePillar}
            onCancel={cancelTransition}
            onComplete={cancelTransition}
          />
        </HeroEngine>
      </main>
    </div>
  );
}
