import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  // SiteFlow is single-admin: the first account created becomes the admin and
  // the database refuses any later sign-up (see supabase/schema.sql), so the
  // "Create admin account" option only appears until that first account exists.
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("app_setup").select("admin_created").maybeSingle();
  const allowSignup = data ? !data.admin_created : false;

  return <LoginForm allowSignup={allowSignup} />;
}
