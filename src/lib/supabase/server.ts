import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project's values."
  );
}

// Kept async so every existing `await createServerSupabaseClient()` call
// site keeps working unchanged, even though there's no cookie/session work
// to await anymore now that the app has no login.
export async function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!);
}
