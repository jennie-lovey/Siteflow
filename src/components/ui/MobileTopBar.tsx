"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SidebarNavContent } from "./SidebarNavContent";

export function MobileTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
            S
          </div>
          <span className="text-sm font-semibold text-slate-900">SiteFlow</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
        <div
          className={`absolute right-0 top-0 flex h-full w-full flex-col bg-white transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end px-3 pt-3">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SidebarNavContent onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}
