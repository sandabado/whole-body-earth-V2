import { createClient } from "@/utils/supabase/client";

export type UpcomingEvent = { id: string; slug: string; title: string; event_date: string; pillar: string; location: string | null };

const fallbackEvents: UpcomingEvent[] = [
  { id: "circle", slug: "weekly-whole-body-circle", title: "Weekly Whole Body Circle", event_date: "2026-07-21T19:00:00-07:00", pillar: "presence", location: "Virtual" },
  { id: "garden", slug: "garden-visit", title: "Garden Visit", event_date: "2026-07-23T10:00:00-07:00", pillar: "foundation", location: "Morongo Valley" },
];

export async function getUpcomingEvents(limit = 4): Promise<UpcomingEvent[]> {
  try {
    const { data, error } = await createClient().from("events").select("id,slug,title,event_date,pillar,location").eq("status", "active").gte("event_date", new Date().toISOString()).order("event_date").limit(limit);
    return !error && data?.length ? data : fallbackEvents.slice(0, limit);
  } catch {
    return fallbackEvents.slice(0, limit);
  }
}
