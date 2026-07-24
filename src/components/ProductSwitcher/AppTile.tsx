import { type CSSProperties, type ElementType } from "react";
import { type AppData } from "./consts";

interface AppTileProps {
  app: AppData;
  index: number;
}

const interactiveStates = new Set<AppData["status"]>(["ACTIVE", "INVESTOR"]);

export default function AppTile({ app, index }: AppTileProps) {
  const isInteractive = interactiveStates.has(app.status);
  const isLocked = app.status === "LOCKED";
  const isHere = app.status === "HERE";
  const stateClasses = isLocked
    ? "border-mercury text-ghost opacity-40"
    : isHere
      ? "border-2 text-bone"
      : "border-mercury text-bone hover:bg-bone/5";
  const Tag: ElementType = isInteractive ? "a" : "div";
  const isExternalUrl = app.url.startsWith("http");
  const linkProps = isExternalUrl
    ? { href: app.url, target: "_blank", rel: "noopener noreferrer" }
    : isInteractive
      ? { href: app.url }
      : { "aria-disabled": true, tabIndex: -1 };

  return (
    <li
      className="w-full opacity-0 animate-[modal-rise_200ms_ease-out_forwards]"
      style={{ animationDelay: `${100 + index * 50}ms` } as CSSProperties}
    >
      <Tag
        {...linkProps}
        className={`group relative flex w-full items-center gap-4 border bg-carbon/80 px-4 py-4 text-left transition-all duration-200 ease-out sm:px-5 ${stateClasses}`}
        style={isHere ? { borderColor: app.brandColor, backgroundColor: `${app.brandColor}1a`, boxShadow: `0 0 18px ${app.brandColor}33` } : undefined}
      >
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center border font-display text-2xl ${isLocked ? "border-mercury" : ""}`} style={isLocked ? undefined : { borderColor: `${app.brandColor}99`, color: app.brandColor }} aria-hidden="true">{app.icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-semibold uppercase tracking-wide text-bone sm:text-base">{app.name}</span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-ghost">{app.element}</span>
        </span>
        <span className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.13em] ${isHere ? "" : "text-ghost"}`} style={isLocked ? undefined : { color: isHere ? app.brandColor : undefined }}>
          {isHere ? "● Current" : app.subtitle}
        </span>
      </Tag>
    </li>
  );
}
