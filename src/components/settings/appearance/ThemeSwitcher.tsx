// src/components/settings/appearance/ThemeSwitcher.tsx
"use client";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function ThemeSwitcher() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const themes = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "whatsapp", label: "WhatsApp Green" },
    { id: "purple", label: "Purple Neo" },
    { id: "amoled", label: "AMOLED Black" },
  ] as const;

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={`p-3 rounded-lg w-40 text-left border ${
              theme === t.id ? "border-[var(--primary)] shadow-md" : "border-[var(--border)]"
            }`}
          >
            <div className="font-semibold">{t.label}</div>
            <div className="text-xs text-[var(--text-muted)]">Preview</div>
          </button>
        ))}
      </div>

      <div className="mt-2 text-xs text-[var(--text-muted)]">
        Tip: Theme is persisted and applied to the app. Add global CSS for data-theme selectors to customize more.
      </div>
    </div>
  );
}
