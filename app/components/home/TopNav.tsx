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
  symbol: string;
  color: string;
}> = [
  { id: "presence", label: "Presence", navLabel: "Presence", symbol: "\u{1F702}\u{FE0E}", color: COMMAND_PILLAR_COLORS.presence },
  { id: "press", label: "Press", navLabel: "Press", symbol: "\u{1F701}\u{FE0E}", color: COMMAND_PILLAR_COLORS.press },
  { id: "studios", label: "Studios", navLabel: "Studios", symbol: "\u{1F704}\u{FE0E}", color: COMMAND_PILLAR_COLORS.studios },
  { id: "foundation", label: "Foundation", navLabel: "Foundation", symbol: "\u{1F703}\u{FE0E}", color: COMMAND_PILLAR_COLORS.foundation },
  { id: "guardian", label: "Guardian", navLabel: "Guardian", symbol: "⊙", color: COMMAND_PILLAR_COLORS.guardian },
  { id: "whole", label: "NØW", navLabel: "NØW", symbol: "⏺︎", color: COMMAND_PILLAR_COLORS.whole },
];

/** Launches a pillar-entry ritual from the persistent homepage bottom rail. */
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
          const isLiveCommand = command.id === "whole";

          return (
            <li key={command.id} className={styles.item}>
              <button
                id={`command-nav-${command.id}`}
                type="button"
                className={`${styles.command} ${isLiveCommand ? styles.record : ""}`}
                style={{ "--command-color": command.color } as CSSProperties}
                data-command={command.id}
                data-active={active ? "true" : "false"}
                aria-label={`Enter ${command.label}`}
                aria-current={active ? "page" : undefined}
                disabled={transitioning}
                onClick={() => onSelect(command.id)}
              >
                <span
                  className={styles.symbol}
                  role={isLiveCommand ? "img" : undefined}
                  aria-label={isLiveCommand ? "System live indicator" : undefined}
                  aria-hidden={isLiveCommand ? undefined : true}
                >
                  {command.symbol}
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
