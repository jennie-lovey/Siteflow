"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { isAllowedEmail } from "./actions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type Mode = "signin" | "signup" | "forgot";

const COPY: Record<Mode, { title: string; subtitle: string; button: string; busy: string }> = {
  signin: { title: "Sign in to SiteFlow", subtitle: "Admin access only", button: "Sign In", busy: "Signing in..." },
  signup: { title: "Create admin account", subtitle: "First-time setup", button: "Create Account", busy: "Creating account..." },
  forgot: { title: "Reset your password", subtitle: "We'll email you a reset link", button: "Send Reset Link", busy: "Sending..." },
};

export function LoginForm({ notice }: { notice?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(notice ?? null);
  const [info, setInfo] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: trimmed, password });
        if (signInError) {
          setError(
            signInError.message === "Invalid login credentials"
              ? "Incorrect email or password. First time here? Create your admin account below."
              : signInError.message
          );
          return;
        }
        router.push("/");
        router.refresh();
        return;
      }

      // Sign-up and password reset are admin-only: other addresses are refused
      // before anything is sent to Supabase.
      if (!(await isAllowedEmail(trimmed))) {
        setError("This email is not allowed to access SiteFlow.");
        return;
      }

      if (mode === "signup") {
        if (password.length < MIN_PASSWORD_LENGTH) {
          setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
          return;
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmed,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/` },
        });
        // With email confirmation on, Supabase hides duplicates by returning a
        // user with no identities instead of an error.
        const alreadyRegistered =
          /already registered/i.test(signUpError?.message ?? "") || data.user?.identities?.length === 0;
        if (alreadyRegistered) {
          setMode("signin");
          setInfo("You already have an account. Sign in with your password, or use Forgot password.");
          return;
        }
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        if (data.session) {
          router.push("/");
          router.refresh();
          return;
        }
        setInfo(`We sent a confirmation link to ${trimmed}. Click it, then come back and sign in.`);
        setMode("signin");
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setInfo(`If ${trimmed} has an account, a password reset link is on its way.`);
    } finally {
      setSubmitting(false);
    }
  }

  const copy = COPY[mode];

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-base font-bold text-white">
            S
          </div>
          <h1 className="mt-3 text-lg font-semibold text-slate-900">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <PasswordInput
                id="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}

          {info && <p className="text-sm text-emerald-700">{info}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? copy.busy : copy.button}
          </Button>

          <p className="text-center text-sm text-slate-500">
            {mode === "signin" ? (
              <>
                First time here?{" "}
                <button type="button" onClick={() => switchMode("signup")} className="font-medium text-blue-600 hover:underline">
                  Create admin account
                </button>
              </>
            ) : (
              <button type="button" onClick={() => switchMode("signin")} className="font-medium text-blue-600 hover:underline">
                Back to sign in
              </button>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
