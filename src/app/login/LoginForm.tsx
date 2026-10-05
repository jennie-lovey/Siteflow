"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = "signin" | "forgot";

const COPY: Record<Mode, { title: string; subtitle: string; button: string; busy: string }> = {
  signin: { title: "Sign in to SiteFlow", subtitle: "Admin access only", button: "Sign In", busy: "Signing in..." },
  forgot: { title: "Reset your password", subtitle: "We'll email you a reset link", button: "Send Reset Link", busy: "Sending..." },
};

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
              ? "Incorrect email or password."
              : signInError.message
          );
          return;
        }
        router.push("/");
        router.refresh();
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

          {mode === "signin" && (
            <div>
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {info && <p className="text-sm text-emerald-700">{info}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? copy.busy : copy.button}
          </Button>

          {mode === "forgot" && (
            <p className="text-center text-sm text-slate-500">
              <button type="button" onClick={() => switchMode("signin")} className="font-medium text-blue-600 hover:underline">
                Back to sign in
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
