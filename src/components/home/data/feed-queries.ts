import { createClient } from "@/utils/supabase/client";

export type Activity = { pillar: string; icon: string; action: string; occurred_at: string };
export async function getActivityFeed(limit = 10): Promise<Activity[]> {
  const { data, error } = await createClient().rpc("homepage_activity", { limit_count: limit });
  if (error) throw error;
  return (data ?? []) as Activity[];
}
