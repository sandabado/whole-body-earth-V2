import type { ReactNode } from "react";

export function HudCorners() {
  return (
    <>
      <span aria-hidden="true" className="hud-corner hud-corner--tl" />
      <span aria-hidden="true" className="hud-corner hud-corner--tr" />
      <span aria-hidden="true" className="hud-corner hud-corner--bl" />
      <span aria-hidden="true" className="hud-corner hud-corner--br" />
    </>
  );
}

export function HudCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`hud-card ${className}`}>
      <HudCorners />
      <div aria-hidden="true" className="card-geometry">
        ◇
      </div>
      {children}
    </div>
  );
}
