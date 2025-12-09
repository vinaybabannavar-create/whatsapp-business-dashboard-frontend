// src/components/settings/privacy/PrivacySettings.tsx
"use client";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function PrivacySettings() {
  const twoFactor = useSettingsStore((s) => s.twoFactor);
  const lastDevices = useSettingsStore((s) => s.lastDevices);
  const clearAllData = useSettingsStore((s) => s.clearAllData);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Two-factor Authentication</p>
          <p className="text-xs text-[var(--text-muted)]">Add an extra layer of security</p>
        </div>
        <input
          type="checkbox"
          checked={twoFactor}
          onChange={(e) => useSettingsStore.setState({ twoFactor: e.target.checked })}
        />
      </div>

      <div>
        <p className="font-medium">Logged-in devices</p>
        <ul className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
          {lastDevices.length === 0 ? (
            <li>No devices recorded.</li>
          ) : (
            lastDevices.map((d, i) => <li key={i}>{d}</li>)
          )}
        </ul>
        <div className="mt-3 flex gap-2">
          <button onClick={() => useSettingsStore.setState({ lastDevices: [] })} className="px-3 py-1 rounded border">Clear Devices</button>
          <button onClick={() => alert("TODO: implement logout from all devices")} className="px-3 py-1 rounded bg-red-500 text-white">Logout from all</button>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border)]">
        <p className="font-medium">App Data</p>
        <p className="text-xs text-[var(--text-muted)]">Clear caches and reset analytics</p>
        <div className="mt-3 flex gap-2">
          <button onClick={() => clearAllData()} className="px-3 py-2 rounded bg-[var(--primary)] text-white">Reset Settings</button>
          <button onClick={() => confirm("Delete all data?") && alert("TODO: delete account server-side")} className="px-3 py-2 rounded border text-red-600">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
