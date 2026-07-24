import { getSupabaseAdminClient } from "@/lib/supabaseClient";

export type CalendarEvent = {
  id: string;
  slug: string;
  title: string;
  type: string;
  pillar: string;
  description: string | null;
  eventDate: string;
  endDate: string | null;
  recurring: "weekly" | "monthly" | null;
  location: string | null;
  locationType: "virtual" | "in_person" | "hybrid" | null;
  capacity: number | null;
  priceCents: number;
  requiresApproval: boolean;
  membersOnly: boolean;
  waitlistEnabled: boolean;
  spotsRemaining: number | null;
};

const fields = "id,slug,title,type,pillar,description,event_date,end_date,recurring,location,location_type,capacity,price_cents,requires_approval,members_only,waitlist_enabled";

type EventRow = {
  id: string; slug: string; title: string; type: string; pillar: string; description: string | null;
  event_date: string; end_date: string | null; recurring: "weekly" | "monthly" | null;
  location: string | null; location_type: "virtual" | "in_person" | "hybrid" | null;
  capacity: number | null; price_cents: number | null; requires_approval: boolean;
  members_only: boolean; waitlist_enabled: boolean;
};

function toCalendarEvent(row: EventRow, occupied: number): CalendarEvent {
  return {
    id: row.id, slug: row.slug, title: row.title, type: row.type, pillar: row.pillar,
    description: row.description, eventDate: row.event_date, endDate: row.end_date,
    recurring: row.recurring, location: row.location, locationType: row.location_type,
    capacity: row.capacity, priceCents: row.price_cents ?? 0,
    requiresApproval: row.requires_approval, membersOnly: row.members_only,
    waitlistEnabled: row.waitlist_enabled,
    spotsRemaining: row.capacity === null ? null : Math.max(0, row.capacity - occupied),
  };
}

async function occupiedByEvent(eventIds: string[]) {
  const supabase = getSupabaseAdminClient();
  if (!supabase || !eventIds.length) return new Map<string, number>();
  const { data } = await supabase
    .from("rsvps")
    .select("event_id,status")
    .in("event_id", eventIds)
    .in("status", ["confirmed", "pending", "payment_pending"]);
  return (data ?? []).reduce(
    (counts, row) => counts.set(row.event_id, (counts.get(row.event_id) ?? 0) + 1),
    new Map<string, number>(),
  );
}

export async function getPublicEvents() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [] as CalendarEvent[];
  const { data, error } = await supabase
    .from("events")
    .select(fields)
    .eq("status", "active")
    .gte("event_date", new Date().toISOString())
    .order("event_date");
  if (error || !data) return [] as CalendarEvent[];
  const rows = data as EventRow[];
  const occupied = await occupiedByEvent(rows.map((row) => row.id));
  return rows.map((row) => toCalendarEvent(row, occupied.get(row.id) ?? 0));
}

export async function getPublicEventBySlug(slug: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("events")
    .select(fields)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error || !data) return null;
  const row = data as EventRow;
  const occupied = await occupiedByEvent([row.id]);
  return toCalendarEvent(row, occupied.get(row.id) ?? 0);
}

export function eventHref(event: Pick<CalendarEvent, "slug">) {
  return `/events/${event.slug}`;
}

export function eventPrice(event: Pick<CalendarEvent, "priceCents">) {
  return event.priceCents > 0
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(event.priceCents / 100)
    : "Free";
}

export function eventDateTime(event: Pick<CalendarEvent, "eventDate" | "endDate">) {
  const date = new Date(event.eventDate);
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles", timeZoneName: "short" }).format(date);
  if (!event.endDate) return `${day} · ${time}`;
  const end = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles", timeZoneName: "short" }).format(new Date(event.endDate));
  return `${day} · ${time}–${end.replace(/\s(?:PST|PDT)$/, "")}`;
}
