"use client";

import Link from "next/link";
import { Campaign } from "@/lib/types";

// Safely extract numbers even when stats may not exist
const getStat = (stats: any, key: string, fallback = 0) =>
  typeof stats?.[key] === "number" ? stats[key] : fallback;

export default function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  // Delivery % based on delivered / sent
  const getProgress = (c: Campaign) => {
    const sent = getStat(c.stats, "sent");
    const delivered = getStat(c.stats, "delivered");

    if (sent === 0) return 0;
    return Math.round((delivered / sent) * 100);
  };

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th>Name</th>
            <th>Status</th>
            <th>Schedule</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((c) => {
            const sent = getStat(c.stats, "sent");
            const delivered = getStat(c.stats, "delivered");
            const failed = getStat(c.stats, "failed");
            const read = getStat(c.stats, "read");

            return (
              <tr key={c._id} className="border-b last:border-0">
                <td className="py-3 font-medium">{c.name}</td>

                <td className="py-3">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
                    {c.status}
                  </span>
                </td>

                <td className="py-3 text-sm text-gray-600">
                  {c.schedule ? new Date(c.schedule).toLocaleString() : "—"}
                </td>

                {/* Progress Column */}
                <td className="py-3 w-48">
                  <div className="text-xs text-gray-500">
                    Delivered {delivered} / Sent {sent}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1 overflow-hidden">
                    <div
                      style={{ width: `${getProgress(c)}%` }}
                      className="h-2 bg-green-500"
                    />
                  </div>
                </td>

                <td className="py-3">
                  <Link
                    href={`/campaigns/${c._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}

          {campaigns.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No campaigns
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
