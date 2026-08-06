"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "./Button";
import { Input, Label } from "./Field";

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Account</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <ProfileForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

// Mounted only while the sheet is open (parent returns null when closed), so
// the data fetch below runs fresh on every open instead of syncing to a prop.
function ProfileForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const updates: { email?: string; password?: string } = { email: email.trim() };
    if (newPassword) updates.password = newPassword;

    const { error: updateError } = await supabase.auth.updateUser(updates);

    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    onClose();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="profile-email">Email</Label>
        <Input
          id="profile-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="profile-password">New Password</Label>
        <Input
          id="profile-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full justify-center">
        {submitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
