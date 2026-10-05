import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SetupForm } from "./SetupForm";

// One-time registration of the admin account. Not linked from anywhere; once
// the admin exists (and the database refuses any other account) this page just
// sends people to the login screen.
export default async function SetupPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("app_setup").select("admin_created").maybeSingle();
  if (!data || data.admin_created) redirect("/login");

  return <SetupForm />;
}
