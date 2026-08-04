import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project's values."
  );
}

// createBrowserClient (rather than the plain supabase-js createClient) stores
// the auth session in cookies instead of localStorage, so the server-side
// client and middleware can read the same session on each request.
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
