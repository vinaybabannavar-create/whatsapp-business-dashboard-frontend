"use client";

import { useEffect, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/* =======================================================
   TYPES
======================================================= */

interface Contact {
  _id: string;
  name: string;
  phone: string;
  status: string;
  lastUpdate?: string;
}

interface Campaign {
  _id: string;
  name: string;
  template: string;
  audience: string;
  schedule?: string;
  status: string;
  createdAt?: string;
  stats?: {
    sent?: number;
    delivered?: number;
    failed?: number;
    read?: number;
  };
}

interface PieSlice {
  value: number;
  color: string;
}

interface PieProps {
  slices: PieSlice[];
}

/* =======================================================
   STATUS COLOR HELPER
======================================================= */

const statusClass = (status: string = ""): string => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "read":
      return "bg-violet-100 text-violet-700";
    case "sent":
      return "bg-blue-100 text-blue-700";
    case "failed":
      return "bg-red-100 text-red-700";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "scheduled":
      return "bg-blue-50 text-blue-700";
    case "completed":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/* =======================================================
   MOCK DATA (fallback)
======================================================= */

const MOCK_CAMPAIGN: Campaign = {
  _id: "mock-campaign-1",
  name: "Diwali offer",
  template: "welcome",
  audience: "new",
  schedule: "2025-12-08T20:45:00Z",
  status: "scheduled",
  stats: { sent: 120, delivered: 98, failed: 3, read: 50 },
};

const MOCK_CONTACTS: Contact[] = Array.from({ length: 20 }).map((_, i) => ({
  _id: `c-${i}`,
  name: `Contact ${i + 1}`,
  phone: `91${900000000 + i}`,
  status: i % 7 === 0 ? "failed" : i % 3 === 0 ? "delivered" : "sent",
  lastUpdate: new Date(Date.now() - i * 1800000).toISOString(),
}));

/* =======================================================
   PIE CHART (FIXED TYPE ERRORS)
======================================================= */

function Pie({ slices = [] }: PieProps) {
  const total = slices.reduce((s, x) => s + (x.value || 0), 0) || 1;
  let angle = 0;

  return (
    <svg width="96" height="96" viewBox="0 0 32 32">
      {slices.map((slice: PieSlice, i: number) => {
        const portion = (slice.value / total) * 360;
        const large = portion > 180 ? 1 : 0;
        const r = 16;

        const start = polarToCartesian(r, r, r, angle);
        const end = polarToCartesian(r, r, r, angle + portion);
        const d = `M ${r} ${r} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;

        angle += portion;

        return (
          <path
            key={i}
            d={d}
            fill={slice.color}
            stroke="white"
            strokeWidth="0.2"
          />
        );
      })}
    </svg>
  );
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/* =======================================================
   MAIN PAGE
======================================================= */

export default function CampaignDetailsPage({
  params,
}: {
  params: { id?: string };
}) {
  const campaignId =
    params?.id ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : "");

  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /* -------------------------------------------------------
     LOAD DATA
  ------------------------------------------------------- */
  const loadData = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      setCampaign(res.ok ? await res.json() : MOCK_CAMPAIGN);
    } catch {
      setCampaign(MOCK_CAMPAIGN);
    }

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/contacts`);
      setContacts(res.ok ? await res.json() : MOCK_CONTACTS);
    } catch {
      setContacts(MOCK_CONTACTS);
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     SOCKET CONNECTION (FIXED CLEANUP ERROR)
  ------------------------------------------------------- */
 useEffect(() => {
  loadData();

  const socket: Socket = io(
    typeof window !== "undefined" ? window.location.origin : "",
    { transports: ["websocket"] }
  );

  socket.on("campaign_update", (payload: any) => {
    if (!payload) return;
    if (payload.campaignId !== (campaignId || MOCK_CAMPAIGN._id)) return;

    if (payload.stats) {
      setCampaign((prev) =>
        prev ? { ...prev, stats: { ...prev.stats, ...payload.stats } } : prev
      );
    }

    if (payload.contactId) {
      setContacts((prev) =>
        prev.map((c) =>
          c._id === payload.contactId
            ? { ...c, status: payload.status, lastUpdate: new Date().toISOString() }
            : c
        )
      );
    }

    if (payload.status) {
      setCampaign((prev) =>
        prev ? { ...prev, status: payload.status } : prev
      );
    }
  });

  // ✅ CORRECT CLEANUP
  return () => {
    socket.disconnect(); // cleanup does not return socket
  };
}, [campaignId]);


  /* -------------------------------------------------------
     ANALYTICS
  ------------------------------------------------------- */
  const analytics = useMemo(() => {
    const stats = campaign?.stats || {};

    const sent =
      stats.sent ?? contacts.filter((c) => c.status !== "pending").length;

    const delivered =
      stats.delivered ??
      contacts.filter((c) => c.status === "delivered").length;

    const failed =
      stats.failed ??
      contacts.filter((c) => c.status === "failed").length;

    const read =
      stats.read ?? contacts.filter((c) => c.status === "read").length;

    const pending = contacts.length - sent;

    return { totalSent: sent, delivered, failed, read, pending };
  }, [campaign, contacts]);

  /* -------------------------------------------------------
     SEND NOW
  ------------------------------------------------------- */
  const handleSendNow = async () => {
    if (!confirm("Send this campaign now?")) return;

    setSending(true);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: "POST",
      });

      if (!res.ok) throw new Error();

      toast.success("Send triggered");
      setCampaign((await res.json()).campaign);
    } catch {
      toast.success("Send simulated");

      setCampaign((prev) =>
        prev ? { ...prev, status: "processing" } : prev
      );

      setContacts((prev) =>
        prev.map((c, i) => ({
          ...c,
          status: i % 5 === 0 ? "failed" : "sent",
          lastUpdate: new Date().toISOString(),
        }))
      );
    }

    setSending(false);
  };

  /* -------------------------------------------------------
     EXPORT CSV
  ------------------------------------------------------- */
  const downloadCSV = () => {
    const csv = [
      "name,phone,status,lastUpdate",
      ...contacts.map(
        (c) =>
          `"${c.name}","${c.phone}","${c.status}","${c.lastUpdate || ""}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${campaign?.name || "campaign"}_contacts.csv`;
    a.click();
  };

  /* =======================================================
     LOADING UI
  ======================================================= */

  if (loading)
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse h-6 bg-gray-200 w-48 rounded" />
        <div className="grid grid-cols-3 gap-4">
          <div className="animate-pulse h-28 bg-gray-100 rounded" />
          <div className="animate-pulse h-28 bg-gray-100 rounded" />
          <div className="animate-pulse h-28 bg-gray-100 rounded" />
        </div>
      </div>
    );

  /* =======================================================
     MAIN UI (UNCHANGED)
  ======================================================= */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{campaign?.name}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Template: <b>{campaign?.template}</b> • Audience:{" "}
            <b>{campaign?.audience}</b>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass(
              campaign?.status
            )}`}
          >
            {campaign?.status}
          </div>

          <button
            onClick={downloadCSV}
            className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
          >
            Export CSV
          </button>

          <button
            onClick={handleSendNow}
            disabled={sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Now"}
          </button>
        </div>
      </div>

      {/* ANALYTICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Sent</div>
              <div className="text-2xl font-semibold">
                {analytics.totalSent}
              </div>
            </div>

            <Pie
              slices={[
                { value: analytics.delivered, color: "#10B981" },
                { value: analytics.failed, color: "#EF4444" },
                {
                  value:
                    analytics.totalSent -
                    analytics.delivered -
                    analytics.failed,
                  color: "#3B82F6",
                },
              ]}
            />
          </div>

          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <div>Delivered: <b>{analytics.delivered}</b></div>
            <div>Failed: <b>{analytics.failed}</b></div>
            <div>Read: <b>{analytics.read}</b></div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Progress</div>
          <div className="mt-2">
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                style={{
                  width: `${
                    Math.round(
                      (analytics.delivered /
                        Math.max(1, analytics.totalSent)) *
                        100
                    )
                  }%`,
                }}
                className="h-3 bg-green-500"
              />
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Delivered {analytics.delivered} • Pending{" "}
              {analytics.pending}
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Schedule</div>
          <div className="mt-2">
            <div className="text-lg font-medium">
              {campaign?.schedule
                ? new Date(campaign.schedule).toLocaleString()
                : "Not scheduled"}
            </div>

            <div className="mt-1 text-sm text-gray-600">
              Created:{" "}
              {campaign?.createdAt
                ? new Date(campaign.createdAt).toLocaleString()
                : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT TABLE */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Contacts ({contacts.length})
            </h3>
            <div className="text-sm text-gray-500">
              Delivery status and recent updates
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              placeholder="Search by name / phone"
              onChange={(e) => {
                const q = e.target.value.trim().toLowerCase();
                if (!q) return loadData();
                setContacts((prev) =>
                  prev.filter((it) =>
                    (it.name + it.phone)
                      .toLowerCase()
                      .includes(q)
                  )
                );
              }}
              className="px-3 py-2 border rounded-md text-sm"
            />

            <button
              onClick={() => {
                loadData();
                toast.success("Refreshed");
              }}
              className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="p-4 max-h-[48vh] overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th>Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Last update</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((con) => (
                <tr key={con._id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{con.name}</td>
                  <td className="py-3 text-sm text-gray-600">{con.phone}</td>

                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${statusClass(
                        con.status
                      )}`}
                    >
                      {con.status}
                    </span>
                  </td>

                  <td className="py-3 text-sm text-gray-600">
                    {con.lastUpdate
                      ? new Date(con.lastUpdate).toLocaleString()
                      : "—"}
                  </td>

                  <td className="py-3">
                    <div className="flex gap-2">
                      {/* Toggle Status */}
                      <button
                        onClick={async () => {
                          const next =
                            con.status === "failed"
                              ? "sent"
                              : con.status === "sent"
                              ? "delivered"
                              : con.status;

                          setContacts((prev) =>
                            prev.map((c) =>
                              c._id === con._id
                                ? {
                                    ...c,
                                    status: next,
                                    lastUpdate:
                                      new Date().toISOString(),
                                  }
                                : c
                            )
                          );

                          try {
                            await fetch(
                              `/api/campaigns/${campaignId}/contacts/${con._id}`,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type":
                                    "application/json",
                                },
                                body: JSON.stringify({ status: next }),
                              }
                            );
                          } catch {}
                        }}
                        className="px-2 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                      >
                        Toggle
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(con.phone);
                          toast.success("Phone copied");
                        }}
                        className="px-2 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {contacts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500"
                  >
                    No contacts
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
