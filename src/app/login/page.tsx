"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";

type Mode = "signin" | "otp-request" | "otp-verify";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (!signInError) {
      router.push("/");
      router.refresh();
      return;
    }

    // No account with this email/password yet. There's no separate sign-up
    // page, so the first submission for a new email creates the account
    // with whatever password was entered.
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setSubmitting(false);
      return;
    }

    if (signUpData.session) {
      router.push("/");
      router.refresh();
      return;
    }

    // No session came back — the Supabase project has "Confirm email"
    // turned on, so the account exists but needs confirming before login.
    setError("Account created. Check your email to confirm it, then sign in again.");
    setSubmitting(false);
  }

  async function handleRequestCode(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    setSubmitting(false);

    if (otpError) {
      setError("Couldn't send a code to that email. Check the address and try again.");
      return;
    }

    setCode("");
    setNewPassword("");
    setMode("otp-verify");
  }

  async function handleVerifyAndReset(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (verifyError) {
      setError("That code is incorrect or expired.");
      setSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError("Signed in, but couldn't set the new password. Try again.");
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-base font-bold text-white">
            S
          </div>
          <h1 className="mt-3 text-lg font-semibold text-slate-900">
            {mode === "signin" && "Sign in to SiteFlow"}
            {mode === "otp-request" && "Reset your password"}
            {mode === "otp-verify" && "Enter the code"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "signin" && "Construction project manager"}
            {mode === "otp-request" && "We'll email a one-time code to sign you in."}
            {mode === "otp-verify" && `Sent to ${email}`}
          </p>
        </div>

        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4 rounded-xl bg-white p-6">
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
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full justify-center">
              {submitting ? "Signing in..." : "Sign In"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode("otp-request");
              }}
              className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Forgot password?
            </button>
          </form>
        )}

        {mode === "otp-request" && (
          <form onSubmit={handleRequestCode} className="space-y-4 rounded-xl bg-white p-6">
            <div>
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full justify-center">
              {submitting ? "Sending code..." : "Send Code"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode("signin");
              }}
              className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Back to sign in
            </button>
          </form>
        )}

        {mode === "otp-verify" && (
          <form onSubmit={handleVerifyAndReset} className="space-y-4 rounded-xl bg-white p-6">
            <div>
              <Label htmlFor="code">One-time code</Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full justify-center">
              {submitting ? "Resetting..." : "Reset Password & Sign In"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode("otp-request");
              }}
              className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Didn&apos;t get a code? Try again
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
