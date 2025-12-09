"use client";

import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // if using Next.js app router
// If not using next/navigation remove the line and the router usage

// ---------- Helper: Status color/classes ----------
const statusClass = (status) => {
  switch ((status || "").toLowerCase()) {
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

// ---------- Mock data (used when backend fetch fails) ----------
const MOCK_CAMPAIGN = {
  _id: "mock-campaign-1",
  name: "Diwali offer",
  template: "welcome",
  audience: "new",
  schedule: "2025-12-08T20:45:00Z",
  status: "scheduled",
  stats: {
    totalSent: 120,
    totalDelivered: 98,
    totalFailed: 3,
    totalRead: 50,
  },
};

const MOCK_CONTACTS = Array.from({ length: 20 }).map((_, i) => ({
  _id: `c-${i}`,
  name: `Contact ${i + 1}`,
  phone: `91${900000000 + i}`,
  status: i % 7 === 0 ? "failed" : i % 3 === 0 ? "delivered" : "sent",
  lastUpdate: new Date(Date.now() - i * 1000 * 60 * 30).toISOString(),
}));

// ---------- Small pie chart (SVG) ----------
function Pie({ slices = [] }) {
  // slices: [{ value, color }]
  const total = slices.reduce((s, x) => s + (x.value || 0), 0) || 1;
  let angle = 0;
  const arcs = slices.map((slice, i) => {
    const portion = (slice.value / total) * 360;
    const large = portion > 180 ? 1 : 0;
    // arc math on circle radius 16
    const r = 16;
    const start = polarToCartesian(r, r, r, angle);
    const end = polarToCartesian(r, r, r, angle + portion);
    const d = `M ${r} ${r} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
    angle += portion;
    return (
      <path key={i} d={d} fill={slice.color} stroke="white" strokeWidth="0.2" />
    );
  });

  return (
    <svg width="96" height="96" viewBox="0 0 32 32" className="inline-block">
      {arcs}
    </svg>
  );
}
function polarToCartesian(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

// ---------- Main Page Component ----------
export default function CampaignDetailsPage({ params }) {
  // If you're not using dynamic route params object, try: const id = some way to get param
  const campaignId = params?.id || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : null);
  const router = useRouter?.() || null;

  const [campaign, setCampaign] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // load campaign details and contacts from backend; fallback to mock
  const loadData = async () => {
    setLoading(true);
    try {
      // Try campaign fetch
      const res1 = await fetch(`/api/campaigns/${campaignId}`);
      if (!res1.ok) throw new Error("no campaign API");
      const camp = await res1.json();
      setCampaign(camp);
    } catch (err) {
      console.warn("Campaign fetch failed - using mock", err);
      setCampaign(MOCK_CAMPAIGN);
    }

    try {
      const res2 = await fetch(`/api/campaigns/${campaignId}/contacts`);
      if (!res2.ok) throw new Error("no contacts API");
      const cs = await res2.json();
      setContacts(cs);
    } catch (err) {
      console.warn("Contacts fetch failed - using mock", err);
      setContacts(MOCK_CONTACTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // socket: listen for updates if a server exists
    const socket = io(typeof window !== "undefined" ? window.location.origin : "http://localhost:5000", {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect_error", (e) => {
      // no-op but prevents endless console spam
      // console.warn("Socket connect error", e);
    });

    // server should emit 'campaign_update' with payload { campaignId, contactId, status, lastUpdate }
    socket.on("campaign_update", (payload) => {
      if (!payload) return;
      if (payload.campaignId && payload.campaignId !== (campaignId || MOCK_CAMPAIGN._id)) return;
      // update campaign stats if present
      if (payload.stats) {
        setCampaign((prev) => ({ ...(prev || MOCK_CAMPAIGN), stats: { ...(prev?.stats || {}), ...(payload.stats || {}) } }));
      }
      // update contact status
      if (payload.contactId && payload.status) {
        setContacts((prev) =>
          prev.map((con) => (con._id === payload.contactId || con.phone === payload.contactPhone ? { ...con, status: payload.status, lastUpdate: payload.lastUpdate || new Date().toISOString() } : con))
        );
      }
      // update campaign status
      if (payload.status && payload.campaignId) {
        setCampaign((prev) => ({ ...(prev || MOCK_CAMPAIGN), status: payload.status }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [campaignId]);

  // Derived analytics
  const analytics = useMemo(() => {
    const stats = campaign?.stats || {};
    const totalSent = stats.totalSent ?? contacts.filter((c) => c.status !== "pending").length;
    const delivered = stats.totalDelivered ?? contacts.filter((c) => c.status === "delivered").length;
    const failed = stats.totalFailed ?? contacts.filter((c) => c.status === "failed").length;
    const read = stats.totalRead ?? contacts.filter((c) => c.status === "read").length;
    const pending = Math.max(0, (campaign?.contacts?.length ?? contacts.length) - (totalSent || 0));
    return { totalSent, delivered, failed, read, pending };
  }, [campaign, contacts]);

  // trigger send (just UI + optimistic in absence of backend)
  const handleSendNow = async () => {
    if (!confirm("Send this campaign now?")) return;
    setSending(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: "POST" });
      if (!res.ok) {
        // fallback: simulate send locally for UI demo
        toast && toast.success && toast.success("Send triggered (simulation)");
        setCampaign((p) => ({ ...(p || {}), status: "processing" }));
        // simulate per-contact updates
        setContacts((prev) => prev.map((c, i) => ({ ...c, status: i % 5 === 0 ? "failed" : "sent", lastUpdate: new Date().toISOString() })));
      } else {
        toast && toast.success && toast.success("Send triggered");
        const json = await res.json();
        setCampaign(json.campaign || json);
      }
    } catch (err) {
      console.warn("Send API failed - simulated send", err);
      toast && toast.success && toast.success("Send simulated");
      setCampaign((p) => ({ ...(p || {}), status: "processing" }));
      setContacts((prev) => prev.map((c, i) => ({ ...c, status: i % 5 === 0 ? "failed" : "sent", lastUpdate: new Date().toISOString() })));
    } finally {
      setSending(false);
    }
  };

  // copy contact list CSV
  const downloadCSV = () => {
    const csv = ["name,phone,status,lastUpdate", ...contacts.map((c) => `${csvEscape(c.name)},${csvEscape(c.phone)},${c.status},${c.lastUpdate || ""}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(campaign?.name || "campaign")}_contacts.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function csvEscape(s) {
    if (!s) return "";
    return `"${String(s).replace(/"/g, '""')}"`;
  }

  if (loading) {
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
  }

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{campaign?.name || "Campaign"}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Template: <span className="font-medium">{campaign?.template}</span> • Audience:{" "}
            <span className="font-medium">{campaign?.audience}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass(campaign?.status)}`}>
            {campaign?.status || "scheduled"}
          </div>

          <button
            onClick={downloadCSV}
            className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition"
            title="Download contacts CSV"
          >
            Export CSV
          </button>

          <button
            onClick={handleSendNow}
            disabled={sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Now"}
          </button>
        </div>
      </div>

      {/* analytics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Sent</div>
              <div className="text-2xl font-semibold">{analytics.totalSent}</div>
            </div>
            <div className="text-sm text-gray-500">
              <Pie
                slices={[
                  { value: analytics.delivered || 0, color: "#10B981" },
                  { value: analytics.failed || 0, color: "#EF4444" },
                  { value: analytics.totalSent - (analytics.delivered || 0) - (analytics.failed || 0), color: "#3B82F6" },
                ]}
              />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <div>Delivered: <span className="font-medium">{analytics.delivered}</span></div>
            <div>Failed: <span className="font-medium">{analytics.failed}</span></div>
            <div>Read: <span className="font-medium">{analytics.read}</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Progress</div>
          <div className="mt-2">
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              {(() => {
                const total = Math.max(1, analytics.totalSent || contacts.length);
                const deliveredPct = Math.round(((analytics.delivered || 0) / total) * 100);
                return (
                  <div style={{ width: `${deliveredPct}%` }} className="h-3 bg-green-500" />
                );
              })()}
            </div>
            <div className="mt-2 text-sm text-gray-600">Delivered {analytics.delivered} • Pending {analytics.pending}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col justify-between">
          <div className="text-sm text-gray-500">Schedule</div>
          <div className="mt-2">
            <div className="text-lg font-medium">{campaign?.schedule ? new Date(campaign.schedule).toLocaleString() : "Not scheduled"}</div>
            <div className="mt-1 text-sm text-gray-600">Created: {campaign?.createdAt ? new Date(campaign.createdAt).toLocaleString() : "—"}</div>
          </div>
        </div>
      </div>

      {/* contacts table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Contacts ({contacts.length})</h3>
            <div className="text-sm text-gray-500">Delivery status and recent updates</div>
          </div>

          <div className="flex items-center gap-2">
            <input
              placeholder="Search by name / phone"
              onChange={(e) => {
                const q = e.target.value.trim().toLowerCase();
                if (!q) {
                  loadData();
                  return;
                }
                setContacts((prev) => prev.filter((it) => (it.name + " " + it.phone).toLowerCase().includes(q)));
              }}
              className="px-3 py-2 border rounded-md text-sm"
            />
            <button
              onClick={() => {
                // simple refresh
                loadData();
                toast && toast.success && toast.success("Refreshed");
              }}
              className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[48vh] overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2">Name</th>
                <th className="pb-2">Phone</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Last update</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((con) => (
                <tr key={con._id} className="border-b last:border-b-0">
                  <td className="py-3">
                    <div className="font-medium">{con.name}</div>
                  </td>

                  <td className="py-3 text-sm text-gray-600">{con.phone}</td>

                  <td className="py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusClass(con.status)}`}>
                      {con.status}
                    </span>
                  </td>

                  <td className="py-3 text-sm text-gray-600">{con.lastUpdate ? new Date(con.lastUpdate).toLocaleString() : "—"}</td>

                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          // try toggling status locally
                          const next = con.status === "failed" ? "sent" : con.status === "sent" ? "delivered" : con.status;
                          setContacts((prev) => prev.map((p) => (p._id === con._id ? { ...p, status: next, lastUpdate: new Date().toISOString() } : p)));
                          // optionally call API to update single contact status if backend route exists:
                          try {
                            await fetch(`/api/campaigns/${campaignId}/contacts/${con._id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: next }),
                            });
                          } catch (e) {
                            // ignore - UI already toggled
                          }
                        }}
                        className="px-2 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(con.phone);
                          toast && toast.success && toast.success("Phone copied");
                        }}
                        className="px-2 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {contacts.length === 0 && (
                <tr>
                  <td className="py-6 text-sm text-gray-500" colSpan={5}>
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
