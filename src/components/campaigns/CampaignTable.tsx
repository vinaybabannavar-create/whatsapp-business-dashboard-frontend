"use client";

import { Campaign } from "@/lib/types";
import { useEffect, useState } from "react";
import { apiCampaigns } from "@/lib/apiClient";
import { toast } from "sonner";
import CampaignDrawer from "./CampaignDrawer";

export default function CampaignTable() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const loadCampaigns = async () => {
    try {
      const data = await apiCampaigns();
      setCampaigns(data);
    } catch (err) {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const statusStyles: Record<string, string> = {
    running: "bg-yellow-600/20 text-yellow-300 border border-yellow-700",
    completed: "bg-emerald-600/20 text-emerald-300 border border-emerald-700",
    draft: "bg-slate-600/20 text-slate-300 border border-slate-700",
  };

  // Delivery % for progress bar
  const getProgress = (c: Campaign) =>
    Math.round((c.delivered / c.total_contacts) * 100);

  return (
    <>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-[var(--text)] relative">

        <h3 className="text-sm font-semibold mb-4">Campaigns</h3>

        {loading && (
          <p className="text-xs text-[var(--text-muted)]">Loading campaigns…</p>
        )}

        {!loading && campaigns.length === 0 && (
          <p className="text-xs text-[var(--text-muted)]">No campaigns found.</p>
        )}

        <div className="space-y-4">

          {campaigns.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCampaign(c)}
              className="p-4 rounded-xl bg-[var(--bg)] hover:bg-[var(--bg)]/80 transition cursor-pointer border border-[var(--border)]"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">

                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <div className="
                    h-10 w-10 rounded-xl
                    bg-gradient-to-br from-amber-500 to-yellow-600
                    flex items-center justify-center font-bold text-white
                  ">
                    {getInitials(c.name)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>

                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] ${statusStyles[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Action Menu */}
                <div className="text-[var(--text-muted)] text-xl hover:text-[var(--text)]">
                  ⋮
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="text-xs text-[var(--text-muted)] mb-1">
                  Delivered: {c.delivered} / {c.total_contacts}
                </div>

                <div className="w-full h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] transition-all duration-500"
                    style={{ width: `${getProgress(c)}%` }}
                  ></div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ADD NEW CAMPAIGN BUTTON */}
        <button
          className="
            fixed bottom-6 right-6 
            h-14 w-14 rounded-full 
            bg-[var(--primary)] text-white 
            flex items-center justify-center 
            text-3xl shadow-xl hover:opacity-90
          "
        >
          +
        </button>
      </div>

      {/* CAMPAIGN DRAWER */}
      {selectedCampaign && (
        <CampaignDrawer
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </>
  );
}
