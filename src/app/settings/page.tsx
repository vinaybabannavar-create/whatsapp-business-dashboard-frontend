// src/app/settings/page.tsx
"use client";

import SettingsContainer from "@/components/settings/SettingsContainer";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2 text-[var(--text)]">Settings</h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Manage profile, appearance, notifications, AI options, privacy and more.
      </p>

      <SettingsContainer />
    </div>
  );
}
