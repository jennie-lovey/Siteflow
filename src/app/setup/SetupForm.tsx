"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PASSWORD_HINT, validatePassword } from "@/lib/auth/password";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SetupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmed,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/` },
      });
      if (signUpError) {
        setError(
          /already has an admin/i.test(signUpError.message)
            ? "An admin account already exists. Please sign in."
            : signUpError.message
        );
        return;
      }
      if (data.session) {
        router.push("/");
        router.refresh();
        return;
      }
      setInfo(`We sent a confirmation link to ${trimmed}. Click it, then sign in.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-base font-bold text-white">
            S
          </div>
          <h1 className="mt-3 text-lg font-semibold text-slate-900">Create admin account</h1>
          <p className="mt-1 text-sm text-slate-500">You&apos;ll be the only person who can sign in</p>
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
          <div>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-slate-500">{PASSWORD_HINT}</p>
          </div>

          {info && <p className="text-sm text-emerald-700">{info}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
