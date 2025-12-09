<<<<<<< HEAD
// src/app/campaigns/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { apiCampaigns } from "@/lib/apiClient";

export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    async function load() {
      let res = await apiCampaigns();

      // 🎯 If campaigns have no stats, auto-generate demo analytics
      const formatted = res.map((c, i) => {
        const base = 20 + i * 10;

        const totalSent =
          c.stats?.totalSent && c.stats.totalSent > 0
            ? c.stats.totalSent
            : base + Math.floor(Math.random() * 40);

        const totalDelivered =
          c.stats?.totalDelivered && c.stats.totalDelivered > 0
            ? c.stats.totalDelivered
            : Math.floor(totalSent * (0.7 + Math.random() * 0.2)); // 70–90%

        const totalFailed =
          c.stats?.totalFailed && c.stats.totalFailed > 0
            ? c.stats.totalFailed
            : totalSent - totalDelivered;

        return {
          name: c.name,
          audience: c.audience || "other",
          schedule: c.schedule,
          status: c.status || "scheduled",

          totalSent,
          totalDelivered,
          totalFailed,
          totalRead: Math.floor(totalDelivered * (0.3 + Math.random() * 0.3)), // 30–60% read rate
        };
      });

      setCampaigns(formatted);
    }

    load();
  }, []);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  /* ---------- PIE: Audience Segments ---------- */
  const audienceDistribution = [
    { name: "New", value: campaigns.filter((d) => d.audience === "new").length },
    {
      name: "Returning",
      value: campaigns.filter((d) => d.audience === "returning").length,
    },
    {
      name: "Premium",
      value: campaigns.filter((d) => d.audience === "premium").length,
    },
    {
      name: "Other",
      value: campaigns.filter(
        (d) => !["new", "returning", "premium"].includes(d.audience)
      ).length,
    },
  ];

  /* ---------- SCORE = delivery % ---------- */
  const dataWithScore = campaigns.map((c) => ({
    ...c,
    score: Math.floor((c.totalDelivered / c.totalSent) * 100),
  }));

  return (
    <div className="p-6 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Campaign Analytics</h1>
        <p className="text-xs text-[var(--text-muted)]">
          Visual insights from campaign performance data.
        </p>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI title="Total Campaigns" value={campaigns.length} />
        <KPI
          title="Avg Delivery Rate"
          value={
            campaigns.length
              ? Math.floor(
                  campaigns.reduce(
                    (a, b) => a + (b.totalDelivered / b.totalSent) * 100,
                    0
                  ) / campaigns.length
                ) + "%"
              : "0%"
          }
        />
        <KPI
          title="Completed"
          value={campaigns.filter((c) => c.status === "completed").length}
        />
        <KPI
          title="Failed"
          value={campaigns.filter((c) => c.totalFailed > 5).length}
        />
      </div>

      {/* ================= CHARTS ================ */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AREA CHART */}
        <Card title="Delivery Trend (%)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataWithScore}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                fill="url(#greenGrad)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* BAR CHART */}
        <Card title="Failed vs Delivered">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaigns}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalDelivered" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="totalFailed" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* PIE CHART */}
        <Card title="Audience Segment Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={audienceDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {audienceDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* RADAR CHART */}
        <Card title="Campaign Performance Radar">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={110} data={dataWithScore}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Delivery %"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* INSIGHTS */}
      <div className="grid md:grid-cols-3 gap-4">
        <InsightCard
          label="Top Campaign"
          value={findTop(dataWithScore)}
        />
        <InsightCard
          label="Highest Failed"
          value={findMostFailed(campaigns)}
        />
        <InsightCard
          label="Next Scheduled"
          value={findNextScheduled(campaigns)}
        />
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function KPI({ title, value }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow">
      <p className="text-xs text-[var(--text-muted)]">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InsightCard({ label, value }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-sm mt-1 font-semibold">{value || "No data"}</p>
    </div>
  );
}

/* ---------- Insight Logic ---------- */

function findTop(data) {
  if (!data.length) return null;
  return data.reduce((a, b) => (a.score > b.score ? a : b)).name;
}

function findMostFailed(data) {
  if (!data.length) return null;
  return data.reduce((a, b) => (a.totalFailed > b.totalFailed ? a : b)).name;
}

function findNextScheduled(data) {
  const scheduled = data.filter((d) => d.schedule);
  if (!scheduled.length) return "None";
  return scheduled.sort((a, b) => new Date(a.schedule) - new Date(b.schedule))[0].name;
}
=======
// src/app/campaigns/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { apiCampaigns } from "@/lib/apiClient";

export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    async function load() {
      let res = await apiCampaigns();

      // 🎯 If campaigns have no stats, auto-generate demo analytics
      const formatted = res.map((c, i) => {
        const base = 20 + i * 10;

        const totalSent =
          c.stats?.totalSent && c.stats.totalSent > 0
            ? c.stats.totalSent
            : base + Math.floor(Math.random() * 40);

        const totalDelivered =
          c.stats?.totalDelivered && c.stats.totalDelivered > 0
            ? c.stats.totalDelivered
            : Math.floor(totalSent * (0.7 + Math.random() * 0.2)); // 70–90%

        const totalFailed =
          c.stats?.totalFailed && c.stats.totalFailed > 0
            ? c.stats.totalFailed
            : totalSent - totalDelivered;

        return {
          name: c.name,
          audience: c.audience || "other",
          schedule: c.schedule,
          status: c.status || "scheduled",

          totalSent,
          totalDelivered,
          totalFailed,
          totalRead: Math.floor(totalDelivered * (0.3 + Math.random() * 0.3)), // 30–60% read rate
        };
      });

      setCampaigns(formatted);
    }

    load();
  }, []);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  /* ---------- PIE: Audience Segments ---------- */
  const audienceDistribution = [
    { name: "New", value: campaigns.filter((d) => d.audience === "new").length },
    {
      name: "Returning",
      value: campaigns.filter((d) => d.audience === "returning").length,
    },
    {
      name: "Premium",
      value: campaigns.filter((d) => d.audience === "premium").length,
    },
    {
      name: "Other",
      value: campaigns.filter(
        (d) => !["new", "returning", "premium"].includes(d.audience)
      ).length,
    },
  ];

  /* ---------- SCORE = delivery % ---------- */
  const dataWithScore = campaigns.map((c) => ({
    ...c,
    score: Math.floor((c.totalDelivered / c.totalSent) * 100),
  }));

  return (
    <div className="p-6 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Campaign Analytics</h1>
        <p className="text-xs text-[var(--text-muted)]">
          Visual insights from campaign performance data.
        </p>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI title="Total Campaigns" value={campaigns.length} />
        <KPI
          title="Avg Delivery Rate"
          value={
            campaigns.length
              ? Math.floor(
                  campaigns.reduce(
                    (a, b) => a + (b.totalDelivered / b.totalSent) * 100,
                    0
                  ) / campaigns.length
                ) + "%"
              : "0%"
          }
        />
        <KPI
          title="Completed"
          value={campaigns.filter((c) => c.status === "completed").length}
        />
        <KPI
          title="Failed"
          value={campaigns.filter((c) => c.totalFailed > 5).length}
        />
      </div>

      {/* ================= CHARTS ================ */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AREA CHART */}
        <Card title="Delivery Trend (%)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataWithScore}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                fill="url(#greenGrad)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* BAR CHART */}
        <Card title="Failed vs Delivered">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaigns}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalDelivered" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="totalFailed" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* PIE CHART */}
        <Card title="Audience Segment Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={audienceDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {audienceDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* RADAR CHART */}
        <Card title="Campaign Performance Radar">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={110} data={dataWithScore}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Delivery %"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* INSIGHTS */}
      <div className="grid md:grid-cols-3 gap-4">
        <InsightCard
          label="Top Campaign"
          value={findTop(dataWithScore)}
        />
        <InsightCard
          label="Highest Failed"
          value={findMostFailed(campaigns)}
        />
        <InsightCard
          label="Next Scheduled"
          value={findNextScheduled(campaigns)}
        />
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function KPI({ title, value }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow">
      <p className="text-xs text-[var(--text-muted)]">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InsightCard({ label, value }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-sm mt-1 font-semibold">{value || "No data"}</p>
    </div>
  );
}

/* ---------- Insight Logic ---------- */

function findTop(data) {
  if (!data.length) return null;
  return data.reduce((a, b) => (a.score > b.score ? a : b)).name;
}

function findMostFailed(data) {
  if (!data.length) return null;
  return data.reduce((a, b) => (a.totalFailed > b.totalFailed ? a : b)).name;
}

function findNextScheduled(data) {
  const scheduled = data.filter((d) => d.schedule);
  if (!scheduled.length) return "None";
  return scheduled.sort((a, b) => new Date(a.schedule) - new Date(b.schedule))[0].name;
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
