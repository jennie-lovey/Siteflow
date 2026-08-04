import { Sidebar } from "@/components/ui/Sidebar";
import { TabletSidebar } from "@/components/ui/TabletSidebar";
import { MobileTopBar } from "@/components/ui/MobileTopBar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <TabletSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
