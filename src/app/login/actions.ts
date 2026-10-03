"use server";

import { isAdminEmail } from "@/lib/auth/admin";

// Lets the browser ask "is this the admin email?" without exposing the
// admin address (or the ADMIN_EMAIL env var) to client code.
export async function isAllowedEmail(email: string): Promise<boolean> {
  return isAdminEmail(email);
}
