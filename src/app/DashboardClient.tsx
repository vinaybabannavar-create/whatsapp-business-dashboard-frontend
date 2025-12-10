// src/app/DashboardClient.tsx
"use client";

import { useState } from "react";
import StatCardsClient from "@/components/dashboard/StatCardsClient";
import SimpleChart from "@/components/dashboard/SimpleChart";
import AddContactModal from "@/components/dashboard/AddContactModal";

export default function DashboardClient() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      {/* ================= DATE RANGE FILTER ================= */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
      </div>

      {/* ================= STAT CARDS ================= */}
      <StatCardsClient />

      {/* ================= ANALYTICS CHART ================= */}
      <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
        <SimpleChart />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Add Contact
        </button>
      </div>

      {/* ================= MODALS ================= */}
      <AddContactModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
