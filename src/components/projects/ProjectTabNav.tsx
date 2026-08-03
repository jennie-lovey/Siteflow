"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProjectTabNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;

  const tabs = [
    { href: base, label: "Overview" },
    { href: `${base}/estimate`, label: "Estimate" },
    { href: `${base}/tracker`, label: "Tracker" },
    { href: `${base}/summary`, label: "Summary" },
  ];

  return (
    <nav className="inline-flex gap-1 rounded-lg bg-slate-100 p-1">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white text-slate-900"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
