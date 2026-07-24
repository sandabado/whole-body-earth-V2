import { createClient } from "@/utils/supabase/client";

export async function getFeaturedItems() {
  const supabase = createClient();
  const now = new Date().toISOString();
  const [press, studios, presence, foundation] = await Promise.all([
    supabase.from("books").select("id,title,slug,volume_number,author,description,image_url,digital_price_cents,physical_price_cents").eq("featured", true).eq("status", "available").limit(1).maybeSingle(),
    supabase.from("products").select("id,title,type,image_url,description,price_cents").eq("pillar", "studios").eq("featured", true).eq("status", "active").limit(1).maybeSingle(),
    supabase.from("events").select("id,title,event_date,type,location,price_cents").eq("pillar", "presence").eq("status", "active").gte("event_date", now).order("event_date").limit(1).maybeSingle(),
    supabase.from("events").select("id,title,event_date,type").eq("pillar", "foundation").eq("status", "active").gte("event_date", now).order("event_date").limit(1).maybeSingle(),
  ]);
  if (press.error || studios.error || presence.error || foundation.error) throw new Error("Unable to load featured items");
  return { press: press.data, studios: studios.data, presence: presence.data, foundation: foundation.data };
}
