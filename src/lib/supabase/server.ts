import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project's values."
  );
}

// No auth/session in this app, so the server-side client is functionally
// identical to the browser client — kept separate only so Server Components
// import from a clearly "server" module.
export function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!);
}
