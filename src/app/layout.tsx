import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/ui/Sidebar";
import { TabletSidebar } from "@/components/ui/TabletSidebar";
import { MobileTopBar } from "@/components/ui/MobileTopBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SiteFlow",
  description: "Manage construction projects: estimates, daily expenses, and profit tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} light h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="flex h-full min-h-screen bg-neutral-100 text-slate-900">
        <Sidebar />
        <TabletSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <MobileTopBar />
          <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
