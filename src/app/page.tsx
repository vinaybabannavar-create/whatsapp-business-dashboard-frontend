"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import SimpleChart from "@/components/dashboard/SimpleChart";
import AddContactModal from "@/components/contacts/AddContactModal";
import { useContactStore } from "@/store/useContactStore";
import { useChatStore } from "@/store/useChatStore";
import { Users, MessageCircle, BarChart3, Mail } from "lucide-react";
import NewCampaignModal from "@/components/campaigns/NewCampaignModal";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/chats/ChatWindow";
import { apiDashboardStats } from "@/lib/apiClient";

const RANGES = ["Today", "Week", "Month"] as const;
type Range = (typeof RANGES)[number];

export default function DashboardPage() {
  const router = useRouter();

  const [showCampaign, setShowCampaign] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [range, setRange] = useState<Range>("Today");
  const [stats, setStats] = useState<{
    totalContacts: number;
    activeChats: number;
    campaigns: number;
    messagesToday: number;
  } | null>(null);

  const [loadingStats, setLoadingStats] = useState(false);

  // Zustand stores (real-time contact/chat UI)
  const contacts = useContactStore((s) => s.contacts);
  const { chats, setSelectedChat, selectedPhone, markAsRead } = useChatStore();

  // ---- LOAD DASHBOARD STATS FROM BACKEND ----
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingStats(true);
        const data = await apiDashboardStats(); // ❗ no range parameter
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    load();
  }, []);

  // fallback if backend stats not ready yet
  const totalContacts = stats?.totalContacts ?? contacts.length;
  const activeChats = stats?.activeChats ?? chats.length;
  const campaigns = stats?.campaigns ?? 0;
  const messagesToday = stats?.messagesToday ?? 0;

  const handleSelectChat = (phone: string, name: string) => {
    setSelectedChat(phone, name);
    markAsRead(phone);
  };

  return (
    <div className="space-y-6">
      {/* RANGE BUTTONS (local UI only) */}
      <div className="flex gap-3 mb-2">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-1 text-sm rounded-lg transition
              ${
                range === r
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
                  : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
              }`}
          >
            {r}
          </button>
        ))}

        {loadingStats && (
          <span className="text-xs text-[var(--text-muted)] ml-2">
            Updating…
          </span>
        )}
      </div>

      {/* STAT CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Contacts" value={totalContacts} icon={<Users />} />
        <StatCard label="Active Chats" value={activeChats} icon={<MessageCircle />} />
        <StatCard label="Campaigns" value={campaigns} icon={<BarChart3 />} />
        <StatCard label="Messages Today" value={messagesToday} icon={<Mail />} />
      </section>

      {/* AI INSIGHTS */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow">
        <h2 className="text-sm font-semibold mb-2 text-[var(--text)]">AI Insights</h2>
        <p className="text-xs text-[var(--text-muted)]">
          📈 Your chats increased by{" "}
          <span className="text-emerald-400 font-bold">24%</span>.
        </p>
      </div>

      {/* QUICK ACTION BUTTONS */}
      <section className="flex flex-wrap gap-3 mt-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold shadow-md"
        >
          ➕ Add Contact
        </button>

        <button
          onClick={() => setShowCampaign(true)}
          className="px-4 py-2 rounded-lg border border-emerald-400 text-emerald-400 hover:bg-emerald-500 hover:text-white transition text-sm"
        >
          📢 New Campaign
        </button>

        <button
          className="px-4 py-2 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition text-sm"
        >
          📝 New Template
        </button>

        <button
          onClick={() => router.push("/chats")}
          className="px-4 py-2 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition text-sm"
        >
          💬 Open Chats
        </button>
      </section>

      {/* ANALYTICS + ACTIVITY */}
      <section className="grid md:grid-cols-[2fr,1fr] gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3 text-[var(--text)]">Message Analytics</h2>
          <SimpleChart /> {/* simple mock chart */}
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3 text-[var(--text)]">
            Recent Activity
          </h2>

          <ul className="space-y-4 text-xs text-[var(--text-muted)] border-l pl-4 border-[var(--border)]">
            <li className="relative">
              <span className="absolute left-[-8px] top-1 h-3 w-3 bg-emerald-400 rounded-full" />
              New campaign launched.
            </li>

            <li className="relative">
              <span className="absolute left-[-8px] top-1 h-3 w-3 bg-blue-400 rounded-full" />
              Replied to {activeChats} chats.
            </li>

            <li className="relative">
              <span className="absolute left-[-8px] top-1 h-3 w-3 bg-pink-400 rounded-full" />
              Imported {totalContacts} contacts.
            </li>
          </ul>
        </div>
      </section>

      {/* LIVE CHATS PANEL */}
      <section className="mt-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]">Live Chats</h2>
          <p className="text-[11px] text-[var(--text-muted)]">
            Manage conversations without leaving the dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-[260px,1fr] gap-4 h-[420px]">
          {/* CHAT LIST */}
          <div className="flex flex-col bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--border)] flex justify-between text-xs">
              <span className="font-semibold text-[var(--text)]">Conversations</span>
              <span className="text-[var(--text-muted)]">{chats.length} chats</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 && (
                <div className="h-full flex items-center justify-center text-[11px] text-[var(--text-muted)]">
                  No chats yet.
                </div>
              )}

              {chats.map((c) => {
                const isActive = c.phone_number === selectedPhone;
                return (
                  <button
                    key={c.phone_number}
                    onClick={() => handleSelectChat(c.phone_number, c.name)}
                    className={`w-full px-3 py-2.5 text-left flex gap-3 items-center border-b border-[var(--border)] text-xs 
                      ${isActive ? "bg-[var(--surface-alt)]" : "hover:bg-[var(--surface-alt)]"}`}
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
                      {c.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-[var(--text)] truncate">{c.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {c.last_message}
                      </p>
                    </div>

                    {c.unread > 0 && (
                      <span className="min-w-[18px] h-[18px] rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                        {c.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <ChatWindow />
        </div>
      </section>

      {/* MODALS */}
      <AddContactModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <NewCampaignModal isOpen={showCampaign} onClose={() => setShowCampaign(false)} />
    </div>
  );
}
