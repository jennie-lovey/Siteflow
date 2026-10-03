import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const notice = error === "not-admin" ? "This account is not allowed to access SiteFlow." : undefined;

  // First-time setup only: set ALLOW_ADMIN_SIGNUP=true to show "Create admin
  // account", then remove it once the admin account exists.
  return <LoginForm notice={notice} allowSignup={process.env.ALLOW_ADMIN_SIGNUP === "true"} />;
}
