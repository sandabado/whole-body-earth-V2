"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PILLARS, type PillarId } from "@/lib/pillars";
import { DEFAULT_PILLAR_ACTIVITIES, getPillarActivities, type PillarActivity } from "@/lib/pillar-activities";

export function HomepageDock() {
  const [activities, setActivities] = useState<PillarActivity[]>(DEFAULT_PILLAR_ACTIVITIES);
  const [openPillar, setOpenPillar] = useState<PillarId | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const nextActivities = await getPillarActivities();
      if (active) setActivities(nextActivities);
    };
    void load();
    const interval = window.setInterval(load, 60_000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  const activeActivity = activities.find((activity) => activity.pillar === openPillar);

  return (
    <aside className="homepage-dock pointer-events-none fixed inset-x-0 bottom-0 z-40 px-2 sm:px-6" aria-label="Pillar activity shelf">
      <div className="pointer-events-auto mx-auto max-w-6xl">
        {activeActivity ? <ActivityPanel activity={activeActivity} /> : null}
        <p className="dock-shelf-label">Live pillar activity <span aria-hidden="true">↓</span></p>
        <div className="grid grid-cols-5 items-end gap-1 sm:gap-2">
          {activities.map((activity) => {
            const pillar = PILLARS[activity.pillar];
            const isOpen = activity.pillar === openPillar;
            return (
              <button
                key={activity.id}
                type="button"
                className={`dock-tab dock-tab-${activity.pillar}`}
                onClick={() => setOpenPillar((current) => current === activity.pillar ? null : activity.pillar)}
                aria-controls={`dock-${activity.pillar}`}
                aria-expanded={isOpen}
              >
                <span className="dock-tab-signal alchemical-glyph" aria-hidden="true">{pillar.symbol}</span>
                <span className="min-w-0"><span className="dock-tab-kicker">{activity.kicker}</span><span className="dock-tab-title">{pillar.name}</span></span>
                <span className="dock-tab-plus" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function ActivityPanel({ activity }: { activity: PillarActivity }) {
  const pillar = PILLARS[activity.pillar];
  const date = activity.starts_at
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(activity.starts_at))
    : null;

  return (
    <section id={`dock-${activity.pillar}`} className={`dock-panel dock-panel-${activity.pillar}`}>
      <p className="dock-panel-kicker">{activity.kicker}</p>
      <h2 className="mt-2 font-display text-lg font-medium leading-tight text-bone sm:text-xl">{activity.title}</h2>
      <p className="mt-1.5 text-xs leading-5 text-ghost">{date ? `${date} · ${activity.summary}` : activity.summary}</p>
      <Link href={activity.href} className="dock-panel-link">{activity.cta_label} <span aria-hidden="true">→</span></Link>
      <span className="sr-only">Whole Body {pillar.name}</span>
    </section>
  );
}
