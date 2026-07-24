import { createClient } from "@/utils/supabase/client";

export async function getPulseData() {
  const supabase = createClient();
  const now = new Date().toISOString();
  const [presence, press, studios, foundation, guardian] = await Promise.all([
    supabase.from("events").select("id,title,event_date,type").eq("pillar", "presence").eq("status", "active").gte("event_date", now).order("event_date").limit(1).maybeSingle(),
    supabase.from("books").select("id,title,slug,volume_number,status,created_at").in("status", ["available", "forthcoming"]).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("products").select("id,title,type,image_url").eq("pillar", "studios").eq("featured", true).eq("status", "active").limit(1).maybeSingle(),
    supabase.from("events").select("id,title,event_date,location").eq("pillar", "foundation").eq("type", "garden_visit").eq("status", "active").gte("event_date", now).order("event_date").limit(1).maybeSingle(),
    supabase.rpc("homepage_guardian_audit_count"),
  ]);
  if (presence.error || press.error || studios.error || foundation.error || guardian.error) throw new Error("Unable to load pulse data");
  return { presence: presence.data, press: press.data, studios: studios.data, foundation: foundation.data, guardian: { auditCount: guardian.data ?? 0 } };
}
