<<<<<<< HEAD
"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Providers } from "./providers";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen w-full flex bg-[var(--bg)] text-[var(--text)] overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* Topbar */}
          <Topbar />

          {/* IMPORTANT FIX → Page scrolls here */}
          <main className="
            flex-1 
            overflow-y-auto 
            p-3 md:p-6 
            bg-[var(--surface)]/40 
            backdrop-blur-xl
          ">
            {children}
          </main>

        </div>
      </div>
    </Providers>
  );
}
=======
"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Providers } from "./providers";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen w-full flex bg-[var(--bg)] text-[var(--text)] overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* Topbar */}
          <Topbar />

          {/* IMPORTANT FIX → Page scrolls here */}
          <main className="
            flex-1 
            overflow-y-auto 
            p-3 md:p-6 
            bg-[var(--surface)]/40 
            backdrop-blur-xl
          ">
            {children}
          </main>

        </div>
      </div>
    </Providers>
  );
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
