"use client";

import type { CSSProperties } from "react";
import type { ActivePillar } from "../HeroEngine/config";
import styles from "./TopNav.module.css";

export type CommandPillar = Exclude<ActivePillar, "none">;

type TopNavProps = {
  activePillar: ActivePillar;
  onSelect: (pillar: CommandPillar, trigger: HTMLButtonElement) => void;
};

const commands: ReadonlyArray<{
  id: CommandPillar;
  label: string;
  symbol: string;
  color: string;
}> = [
  { id: "presence", label: "Presence", symbol: "🜂", color: "#FF6B35" },
  { id: "press", label: "Press", symbol: "🜁", color: "#A8D8EA" },
  { id: "studios", label: "Studios", symbol: "🜄", color: "#2E86AB" },
  { id: "foundation", label: "Foundation", symbol: "🜃", color: "#8B6F47" },
  { id: "guardian", label: "Guardian", symbol: "⊙", color: "#6D4AFF" },
  { id: "whole", label: "Whole — live activity and calendar", symbol: "⏺︎", color: "#FF3366" },
];

export function TopNav({ activePillar, onSelect }: TopNavProps) {
  return (
    <nav className={styles.nav} aria-label="Open a Whole Body pillar shelf">
      <ul className={styles.rail}>
        {commands.map((command) => {
          const active = activePillar === command.id;
          return (
            <li key={command.id}>
              <button
                id={`command-nav-${command.id}`}
                type="button"
                className={`${styles.command} ${command.id === "whole" ? styles.record : ""}`}
                style={{ "--command-color": command.color } as CSSProperties}
                data-command={command.id}
                data-active={active ? "true" : "false"}
                aria-label={`${active ? "Close" : "Open"} ${command.label} shelf`}
                aria-expanded={active}
                aria-controls="whole-body-command-shelf"
                onClick={(event) => onSelect(command.id, event.currentTarget)}
              >
                <span aria-hidden="true">{command.symbol}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
