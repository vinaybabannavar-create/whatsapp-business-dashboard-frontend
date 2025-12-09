"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CommandPalette from "./CommandPalette";
import { Search } from "lucide-react";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/contacts": "Contacts",
  "/chats": "Chats",
  "/campaigns": "Campaigns",
  "/templates": "Templates",
  "/settings": "Settings",
};

export default function Topbar() {
  const router = useRouter();
  const path = usePathname();

  const { isAuthenticated, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();

  const base = "/" + (path?.split("/")[1] || "");
  const title = titles[base] || "Dashboard";

  return (
    <>
      <CommandPalette />

      <header
        className="
          sticky top-0 z-50
          w-full h-14 flex items-center justify-between
          px-4 md:px-6
          bg-[var(--surface)]/40 backdrop-blur-xl
          border-b border-[var(--border)]
          text-[var(--text)]
          shadow-md
        "
      >
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-xs text-[var(--text-muted)] hidden sm:block">
            Migrate WhatsApp Business Dashboard
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
              )
            }
            className="
              hidden sm:flex items-center gap-2 
              px-3 py-1.5 rounded-full border border-[var(--border)]
              bg-[var(--surface)]/20 hover:bg-[var(--surface-alt)]
              transition text-[var(--text-muted)]
            "
          >
            <Search size={14} />
            <span>Search…</span>
          </button>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline-block">Dark mode</span>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          {/* Logout */}
          {isAuthenticated && (
            <Button
              size="sm"
              variant="outline"
              className="border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-alt)]"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </header>
    </>
  );
}
