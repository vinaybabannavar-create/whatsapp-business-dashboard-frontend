"use client";

import { Campaign } from "@/lib/types";

export default function CampaignDrawer({
  campaign,
  onClose,
}: {
  campaign: Campaign | null;
  onClose: () => void;
}) {
  if (!campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
      <div className="w-[380px] bg-[var(--surface)] border-l border-[var(--border)] h-full p-5 animate-slideLeft">

        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-lg text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2">{campaign.name}</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          View campaign details & performance
        </p>

        {/* Status */}
        <p className="font-semibold mb-2">
          Status: <span className="text-[var(--primary)]">{campaign.status}</span>
        </p>

        {/* Analytics */}
        <div className="space-y-2 text-sm">
          <p>Contacts: {campaign.total_contacts}</p>
          <p>Delivered: {campaign.delivered}</p>
          <p>Read: {campaign.read}</p>
        </div>

        <hr className="my-4 border-[var(--border)]" />

        {/* Mock Chart */}
        <p className="text-sm text-[var(--text-muted)] mb-1">Analytics</p>
        <div className="p-4 border rounded-xl border-[var(--border)] bg-[var(--bg)] text-xs">
          Chart Placeholder (Mock)
        </div>

      </div>
    </div>
  );
}
