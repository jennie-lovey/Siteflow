"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function Greeting() {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    // The visitor's local hour is only knowable client-side; syncing it here
    // (rather than computing at render time) avoids a server/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-900">{greeting ?? "Welcome back"}</h1>
      <p className="mt-0.5 text-sm text-slate-500">Here&apos;s what&apos;s happening across your projects.</p>
    </div>
  );
}
