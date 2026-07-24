import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type PublicSupabaseClient = SupabaseClient<Database>;

let publicClient: PublicSupabaseClient | null | undefined;

/**
 * Returns the shared public-read Supabase client when browser-safe credentials
 * are configured. The client is created lazily so static builds can still run
 * in environments where public database access is intentionally unavailable.
 */
export function getPublicSupabaseClient(): PublicSupabaseClient | null {
  if (publicClient !== undefined) {
    return publicClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !publishableKey) {
    publicClient = null;
    return publicClient;
  }

  publicClient = createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return publicClient;
}
