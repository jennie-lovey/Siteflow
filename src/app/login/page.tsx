import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const notice = error === "not-admin" ? "This account is not allowed to access SiteFlow." : undefined;

  return <LoginForm notice={notice} />;
}
