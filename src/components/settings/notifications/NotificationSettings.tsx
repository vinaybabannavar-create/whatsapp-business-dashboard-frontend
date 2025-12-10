// src/components/settings/notifications/NotificationSettings.tsx
"use client";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function NotificationSettings() {
  const notifyChatAlerts = useSettingsStore((s) => s.notifyChatAlerts);
  const notifyCampaigns = useSettingsStore((s) => s.notifyCampaigns);
  const notifyDailySummary = useSettingsStore((s) => s.notifyDailySummary);
  const notifySound = useSettingsStore((s) => s.notifySound);
  const setNotifySound = useSettingsStore((s) => s.setNotifySound);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Chat Alerts</p>
          <p className="text-xs text-[var(--text-muted)]">Notify on new messages</p>
        </div>
        <input
          type="checkbox"
          checked={notifyChatAlerts}
          onChange={(e) => (useSettingsStore.setState({ notifyChatAlerts: e.target.checked }))}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Campaign Updates</p>
          <p className="text-xs text-[var(--text-muted)]">When campaigns send or finish</p>
        </div>
        <input
          type="checkbox"
          checked={notifyCampaigns}
          onChange={(e) => (useSettingsStore.setState({ notifyCampaigns: e.target.checked }))}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Daily Summary</p>
          <p className="text-xs text-[var(--text-muted)]">Receive daily reports by email</p>
        </div>
        <input
          type="checkbox"
          checked={notifyDailySummary}
          onChange={(e) => (useSettingsStore.setState({ notifyDailySummary: e.target.checked }))}
        />
      </div>

      <div>
        <p className="font-medium">Notification Sound</p>
        <div className="flex gap-3 mt-2">
          {["classic", "pop", "soft", "silent"].map((s) => (
            <button
              key={s}
              onClick={() => setNotifySound(s as any)}
              className={`px-3 py-2 rounded-lg border ${
                notifySound === s ? "border-[var(--primary)] bg-[var(--surface-alt)]" : "border-[var(--border)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">You can preview the sound when saved (TODO: play audio files).</p>
      </div>
    </div>
  );
}
