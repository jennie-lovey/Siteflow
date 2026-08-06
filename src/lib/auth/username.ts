// Supabase's auth API requires an email-shaped identifier even though this
// app only ever shows the user a plain "Username" field. We map usernames to
// a synthetic, non-deliverable address so no real email is ever involved.
const USERNAME_EMAIL_DOMAIN = "siteflow.local";

export const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,32}$/;

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${USERNAME_EMAIL_DOMAIN}`;
}

export function emailToUsername(email: string): string {
  return email.endsWith(`@${USERNAME_EMAIL_DOMAIN}`) ? email.slice(0, -`@${USERNAME_EMAIL_DOMAIN}`.length) : email;
}
