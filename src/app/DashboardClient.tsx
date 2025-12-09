"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Users, MessageCircle, BarChart3, Mail } from "lucide-react";
import { useContactStore } from "@/store/useContactStore";
import dynamic from "next/dynamic";
import { DashboardStats } from "@/lib/types";   // ⭐ added type

const SimpleChart = dynamic(
  () => import("@/components/dashboard/SimpleChart"),
  { ssr: false }
);

export default function DashboardClient({ stats }: { stats: DashboardStats }) {   // ⭐ typed
  const totalContacts = useContactStore((s) => s.contacts.length);

  return (
    <div className="space-y-6">

      {/* ================= DATE RANGE FILTER ================= */}
      <div className="flex gap-3 mb-2">
        {["Today", "Week", "Month"].map((r) => (
          <button
            key={r}
            className="
              px-4 py-1 text-sm rounded-lg 
              border border-[var(--border)]
              hover:bg-[var(--surface)]
              transition
            "
          >
            {r}
          </button>
        ))}
      </div>

      {/* ================= STAT CARDS ================= */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Contacts" value={totalContacts} icon={<Users />} />
        <StatCard label="Active Chats" value={stats.activeChats} icon={<MessageCircle />} />
        <StatCard label="Campaigns" value={stats.campaigns} icon={<BarChart3 />} />
        <StatCard label="Messages Today" value={stats.messagesToday} icon={<Mail />} />
      </section>

      {/* ================= AI Insights ================= */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow">
        <h2 className="text-sm font-semibold mb-2">AI Insights</h2>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          📈 Your chats increased by{" "}
          <span className="text-emerald-400 font-bold">24%</span> this week compared to last week.
          Customers are most active between{" "}
          <span className="text-emerald-300 font-semibold">2 PM - 6 PM</span>.
        </p>
      </div>

      {/* ================= QUICK ACTION BUTTONS ================= */}
      <section className="flex flex-wrap gap-3 mt-2">
        <button className="
          px-4 py-2 rounded-lg bg-[var(--primary)]
          text-white text-sm font-medium shadow
          hover:bg-opacity-80 transition flex items-center gap-2
        ">
          ➕ Add Contact
        </button>

        <button className="
          px-4 py-2 rounded-lg bg-emerald-700/30
          border border-emerald-500 text-emerald-300
          hover:bg-emerald-700/40 transition text-sm flex items-center gap-2
        ">
          📢 New Campaign
        </button>

        <button className="
          px-4 py-2 rounded-lg bg-blue-700/30
          border border-blue-500 text-blue-300
          hover:bg-blue-700/40 transition text-sm flex items-center gap-2
        ">
          📝 New Template
        </button>

        <button className="
          px-4 py-2 rounded-lg bg-purple-700/30
          border border-purple-500 text-purple-300
          hover:bg-purple-700/40 transition text-sm flex items-center gap-2
        ">
          💬 Open Chats
        </button>
      </section>

      {/* ================= ANALYTICS + TIMELINE ================= */}
      <section className="grid md:grid-cols-[2fr,1fr] gap-6">

        {/* CHART SECTION */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Message Analytics</h2>
          <SimpleChart />
        </div>

        {/* TIMELINE */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Recent Activity</h2>

          <ul className="space-y-4 text-xs text-[var(--text-muted)] border-l border-[var(--border)] pl-4">
            <li className="relative">
              <span className="absolute left-[-8px] top-1 h-3 w-3 bg-emerald-400 rounded-full"></span>
              New campaign “Welcome Offer” started.
            </li>
            <li className="relative">
              <span className="absolute left-[-8px] top-1 h-3 w-3 bg-blue-400 rounded-full"></span>
              Replied to {stats.activeChats} customer chats.
            </li>
            <li className="relative">
              <span className="absolute left-[-8px] top-1 h-3 w-3 bg-pink-400 rounded-full"></span>
              Imported {totalContacts} contacts.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
