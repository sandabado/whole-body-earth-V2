"use client";

import { useEffect, useState } from "react";

const states = ["waiting", "meta", "marker", "headline", "subhead", "final"] as const;
type State = typeof states[number];

export function FoundationHeadline({ configDelayMs = 4000 }: { configDelayMs?: number }) {
  const [state, setState] = useState<State>("waiting");
  useEffect(() => {
    const timers = [
      setTimeout(() => setState("meta"), configDelayMs),
      setTimeout(() => setState("marker"), configDelayMs + 600),
      setTimeout(() => setState("headline"), configDelayMs + 1200),
      setTimeout(() => setState("subhead"), configDelayMs + 2400),
      setTimeout(() => setState("final"), configDelayMs + 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [configDelayMs]);
  const visible = (target: State) => states.indexOf(state) >= states.indexOf(target);

  return <div className="foundation-headline">
    <div className={`foundation-headline__meta ${visible("meta") ? "visible" : ""}`}>
      <p>Whole Body Foundation</p><p>Earth Ray · Permanent Infrastructure</p><p>Phase I Land Acquisition Active</p>
    </div>
    <div className={`foundation-headline__marker ${visible("marker") ? "visible" : ""}`}>▲</div>
    <h1 className={visible("headline") ? "visible" : ""}>What is built must hold</h1>
    <p className={`foundation-headline__subhead ${visible("subhead") ? "visible" : ""}`}>Whole Body Foundation acquires land, builds infrastructure, and creates permanent homes for the constellation. We do not rent what we can own. We do not lease what we can build.</p>
    <div className={`foundation-headline__survey ${visible("final") ? "visible" : ""}`}><i /><span>▼</span><i /></div>
  </div>;
}
