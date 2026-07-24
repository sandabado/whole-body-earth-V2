import { createClient } from "@/utils/supabase/client";

export async function getNextEvent() {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select("id,title,event_date,location,type,pillar,price_cents,capacity").eq("status", "active").gte("event_date", new Date().toISOString()).order("event_date").limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: rsvpCount, error: countError } = await supabase.rpc("homepage_rsvp_count", { target_event: data.id });
  if (countError) throw countError;
  return { ...data, spotsRemaining: Math.max(0, (data.capacity ?? 0) - (rsvpCount ?? 0)) };
}
