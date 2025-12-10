// src/app/AppShell.tsx
"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-[var(--background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
