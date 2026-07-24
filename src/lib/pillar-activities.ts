import { createClient } from "@/utils/supabase/client";
import { PILLAR_IDS, type PillarId } from "@/lib/pillars";

export type PillarActivity = {
  id: string;
  pillar: PillarId;
  title: string;
  kicker: string;
  summary: string;
  href: string;
  cta_label: string;
  starts_at: string | null;
};

export const DEFAULT_PILLAR_ACTIVITIES: PillarActivity[] = [
  { id: "presence-next-circle", pillar: "presence", title: "Next gathering", kicker: "Circle activity", summary: "Circles, retreats, and shared practice for the body that gathers.", href: "/events", cta_label: "View calendar", starts_at: null },
  { id: "press-whole-body-series", pillar: "press", title: "The Whole Body Series", kicker: "Reader activity", summary: "Five volumes, field manuals, and permanent reading paths for the work.", href: "/library", cta_label: "Open library", starts_at: null },
  { id: "studios-infinity-love", pillar: "studios", title: "∞ Love", kicker: "Release activity", summary: "Sandābādo’s debut is moving through the archive: music, film, and signal.", href: "/media", cta_label: "Enter media", starts_at: null },
  { id: "foundation-garden-field", pillar: "foundation", title: "Garden field", kicker: "Field activity", summary: "The Tetrahedron Garden is growing toward its next phase in Morongo Valley.", href: "/pillars/foundation/garden", cta_label: "Explore garden", starts_at: null },
  { id: "guardian-eligibility", pillar: "guardian", title: "Eligibility", kicker: "Gate activity", summary: "A referral-led stewardship path for those holding real responsibility.", href: "/pillars/guardian", cta_label: "Read eligibility", starts_at: null },
];

function isPillarActivity(value: unknown): value is PillarActivity {
  if (!value || typeof value !== "object") return false;
  const activity = value as Partial<PillarActivity>;
  return typeof activity.id === "string"
    && typeof activity.pillar === "string"
    && (PILLAR_IDS as readonly string[]).includes(activity.pillar)
    && typeof activity.title === "string"
    && typeof activity.kicker === "string"
    && typeof activity.summary === "string"
    && typeof activity.href === "string"
    && typeof activity.cta_label === "string";
}

/**
 * Homepage shelf read-model. One published record per pillar is chosen by
 * priority, then date. Local defaults keep the shell useful before content is
 * published in Supabase.
 */
export async function getPillarActivities(): Promise<PillarActivity[]> {
  try {
    const { data, error } = await createClient()
      .from("pillar_activities")
      .select("id,pillar,title,kicker,summary,href,cta_label,starts_at")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("priority", { ascending: false })
      .order("starts_at", { ascending: true, nullsFirst: false });

    if (error || !data) return DEFAULT_PILLAR_ACTIVITIES;

    const selected = new Map<PillarId, PillarActivity>();
    for (const activity of data.filter(isPillarActivity)) {
      if (!selected.has(activity.pillar)) selected.set(activity.pillar, activity);
    }

    return PILLAR_IDS.map((pillar) => selected.get(pillar) ?? DEFAULT_PILLAR_ACTIVITIES.find((activity) => activity.pillar === pillar)!);
  } catch {
    return DEFAULT_PILLAR_ACTIVITIES;
  }
}
