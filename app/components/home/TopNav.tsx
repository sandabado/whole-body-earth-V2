"use client";

import type { CSSProperties } from "react";
import {
  COMMAND_PILLAR_COLORS,
  type ActivePillar,
} from "../HeroEngine/config";
import styles from "./TopNav.module.css";

export type CommandPillar = Exclude<ActivePillar, "none">;

export interface TopNavProps {
  activePillar: ActivePillar;
  onSelect: (pillar: CommandPillar) => void;
}

const commands: ReadonlyArray<{
  id: CommandPillar;
  label: string;
  navLabel: string;
  symbol: string | null;
  color: string;
}> = [
  { id: "presence", label: "Whole Body Presence", navLabel: "Presence", symbol: "\u{1F702}\u{FE0E}", color: COMMAND_PILLAR_COLORS.presence },
  { id: "press", label: "Whole Body Press", navLabel: "Press", symbol: "\u{1F701}\u{FE0E}", color: COMMAND_PILLAR_COLORS.press },
  { id: "studios", label: "Whole Body Studios", navLabel: "Studios", symbol: "\u{1F704}\u{FE0E}", color: COMMAND_PILLAR_COLORS.studios },
  { id: "foundation", label: "Whole Body Foundation", navLabel: "Foundation", symbol: "\u{1F703}\u{FE0E}", color: COMMAND_PILLAR_COLORS.foundation },
  { id: "guardian", label: "Guardian — The Agreements", navLabel: "Guardian", symbol: "⊙", color: COMMAND_PILLAR_COLORS.guardian },
  { id: "whole", label: "Whole Body Earth — Live Calendar", navLabel: "NØW", symbol: null, color: COMMAND_PILLAR_COLORS.whole },
];

function GlobeIcon() {
  return (
    <svg viewBox="0 0 48 48" width="24" height="24" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="24" cy="24" rx="20" ry="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="24" cy="24" rx="6" ry="20" fill="none" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="24" cy="16" rx="18" ry="4" fill="none" stroke="currentColor" strokeWidth=".75" opacity=".6" />
      <ellipse cx="24" cy="32" rx="18" ry="4" fill="none" stroke="currentColor" strokeWidth=".75" opacity=".6" />
    </svg>
  );
}

/** Launches a pillar-entry ritual from the persistent homepage top rail. */
export function TopNav({ activePillar, onSelect }: TopNavProps) {
  const transitioning = activePillar !== "none";

  return (
    <nav
      className={styles.nav}
      aria-label="Enter a Whole Body pillar"
      aria-hidden={transitioning ? true : undefined}
      inert={transitioning ? true : undefined}
    >
      <ul className={styles.rail}>
        {commands.map((command) => {
          const active = activePillar === command.id;
          const isWholeCommand = command.id === "whole";

          return (
            <li key={command.id} className={styles.item}>
              <button
                id={`command-nav-${command.id}`}
                type="button"
                className={`${styles.command} ${isWholeCommand ? styles.globe : ""}`}
                style={{ "--command-color": command.color } as CSSProperties}
                data-command={command.id}
                data-active={active ? "true" : "false"}
                aria-label={isWholeCommand ? command.label : `Enter ${command.label}`}
                aria-current={active ? "page" : undefined}
                disabled={transitioning}
                onClick={() => onSelect(command.id)}
              >
                <span
                  className={styles.symbol}
                  aria-hidden="true"
                >
                  {isWholeCommand ? <GlobeIcon /> : command.symbol}
                </span>
                <span className={styles.label}>{command.navLabel}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
