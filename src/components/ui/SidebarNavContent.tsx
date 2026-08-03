"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListChecks, LogOut } from "lucide-react";

export function SidebarNavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
          S
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">SiteFlow</p>
          <p className="text-xs text-slate-500">Construction Manager</p>
        </div>
      </div>

      <nav className="mt-2 space-y-3 px-3">
        <SidebarLink href="/" active={pathname === "/"} onNavigate={onNavigate}>
          <LayoutGrid className="h-4 w-4" />
          Dashboard
        </SidebarLink>
        <SidebarLink href="/projects" active={pathname.startsWith("/projects")} onNavigate={onNavigate}>
          <ListChecks className="h-4 w-4" />
          Projects
        </SidebarLink>
      </nav>

      <div className="mt-auto border-t border-slate-200 px-5 py-4">
        <p className="text-xs text-slate-500">Single-user workspace</p>
        <button
          title="Login isn't set up yet"
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );
}

function SidebarLink({
  href,
  active,
  onNavigate,
  children,
}: {
  href: string;
  active: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
}
