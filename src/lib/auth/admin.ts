// The only account allowed into SiteFlow. Anyone else who somehow gets a
// Supabase account is signed straight back out by the route guard.
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "titofrancis01@gmail.com").trim().toLowerCase();

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && email.trim().toLowerCase() === ADMIN_EMAIL;
}
