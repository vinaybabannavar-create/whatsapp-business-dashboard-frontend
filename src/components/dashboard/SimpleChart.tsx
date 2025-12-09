// src/components/dashboard/SimpleChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ChartPoint = {
  label: string;    // Mon, Tue, ...
  messages: number; // count
};

const fallbackData: ChartPoint[] = [
  { label: "Mon", messages: 120 },
  { label: "Tue", messages: 98 },
  { label: "Wed", messages: 150 },
  { label: "Thu", messages: 200 },
  { label: "Fri", messages: 180 },
  { label: "Sat", messages: 80 },
  { label: "Sun", messages: 60 },
];

export default function SimpleChart({ data }: { data?: ChartPoint[] }) {
  const chartData = data && data.length ? data : fallbackData;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
        >
          {/* grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

          <XAxis
            dataKey="label"
            stroke="#64748b"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              color: "white",
              fontSize: 12,
            }}
            labelStyle={{ fontSize: 12, color: "#38bdf8" }}
          />

          <Line
            type="monotone"
            dataKey="messages"
            stroke="#25D366"
            strokeWidth={2}
            dot={{ stroke: "#25D366", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
