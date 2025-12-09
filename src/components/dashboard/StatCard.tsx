"use client";

import { ReactNode } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import AnimatedNumber from "./AnimatedNumber";
import { useUIStore } from "@/store/useUIStore";

type StatCardProps = {
  label: string;
  value: number;
  icon?: ReactNode;
  trend?: number[];
};

export function StatCard({
  label,
  value,
  icon,
  trend = [5, 20, 15, 30, 25, 40, 32],
}: StatCardProps) {
  const darkMode = useUIStore((s) => s.darkMode);

  return (
    <div
      className="
        bg-[var(--surface)]
        border border-[var(--border)]
        rounded-xl p-5
        shadow-sm
        hover:shadow-md
        transition-all duration-300
      "
    >
      {/* Label + Value + Icon */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-[var(--text-muted)]">{label}</p>

          <p className="text-3xl font-bold mt-1 text-[var(--text)]">
            <AnimatedNumber value={value} />
          </p>
        </div>

        <div className="text-[var(--primary)] text-3xl opacity-80">
          {icon}
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="mt-3 opacity-80">
        <Sparklines data={trend} height={30} width={80}>
          <SparklinesLine
            color={darkMode ? "#22c55e" : "#16a34a"} // green for light + neon for dark
            style={{ strokeWidth: 3 }}
          />
        </Sparklines>
      </div>
    </div>
  );
}
