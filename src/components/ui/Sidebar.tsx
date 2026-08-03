import { SidebarNavContent } from "./SidebarNavContent";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-600 lg:flex">
      <SidebarNavContent />
    </aside>
  );
}
