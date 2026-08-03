"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

export interface ReminderItem {
  projectId: string;
  projectName: string;
  message: string;
}

export function NotificationBell({ reminders }: { reminders: ReminderItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {reminders.length > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl bg-white p-2">
            <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Needs attention
            </p>
            {reminders.length === 0 ? (
              <p className="px-3 py-4 text-sm text-slate-400">You&apos;re all caught up.</p>
            ) : (
              <ul className="space-y-0.5">
                {reminders.map((item, index) => (
                  <li key={`${item.projectId}-${index}`}>
                    <Link
                      href={`/projects/${item.projectId}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 hover:bg-slate-50"
                    >
                      <p className="text-sm font-medium text-slate-900">{item.projectName}</p>
                      <p className="text-xs text-slate-500">{item.message}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
