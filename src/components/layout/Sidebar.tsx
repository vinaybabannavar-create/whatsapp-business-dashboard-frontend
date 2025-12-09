"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";

import {
  Home,
  Users,
  MessageCircle,
  Megaphone,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/chats", label: "Chats", icon: MessageCircle },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/campaigns/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { name } = useAuthStore();
  const { status } = useUIStore();

  const [collapsed, setCollapsed] = useState(false);

  const activePath = useMemo(() => {
    if (pathname === "/") return "/";
    return "/" + pathname.split("/")[1];
  }, [pathname]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    const p = name.split(" ");
    return p.length === 1
      ? p[0][0].toUpperCase()
      : (p[0][0] + p[1][0]).toUpperCase();
  };

  const statusColor: Record<string, string> = {
    online: "#22c55e",
    active: "#3b82f6",
    idle: "#d1d5db",
    busy: "#ef4444",
  };

  return (
    <aside
      className={`hidden md:flex flex-col 
        ${collapsed ? "w-20" : "w-64"}
        bg-[var(--surface)]/40 backdrop-blur-xl
        border-r border-[var(--border)]
        shadow-xl p-4 transition-all duration-300`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-[-12px] p-1 rounded-full 
        bg-[var(--surface)] border border-[var(--border)]
        hover:bg-[var(--surface-alt)] shadow"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="h-14 w-14 flex items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg
          bg-gradient-to-br from-emerald-400 to-blue-600">
            {getInitials(name)}
          </div>

          <div
            className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[var(--surface)]"
            style={{ backgroundColor: statusColor[status] }}
          />
        </div>

        {!collapsed && (
          <>
            <p className="mt-3 text-sm font-semibold text-[var(--text)]">
              {name || "User"}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              Business Dashboard
            </p>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)]"
                }`}
            >
              <Icon size={20} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
          Logged in as{" "}
          <span className="font-medium text-[var(--text)]">{name}</span>
        </div>
      )}
    </aside>
  );
}
