"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListChecks } from "lucide-react";

export function TabletSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutGrid, active: pathname === "/" },
    { href: "/projects", label: "Projects", icon: ListChecks, active: pathname.startsWith("/projects") },
  ];

  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-5 md:flex lg:hidden">
      <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
        S
      </div>
      <nav className="flex flex-col items-center gap-2">
        {links.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            title={label}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <Icon className="h-5 w-5" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
