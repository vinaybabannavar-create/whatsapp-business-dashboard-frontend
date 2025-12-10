// src/components/settings/SettingsContainer.tsx
"use client";

import ProfileCard from "./profile/ProfileCard";
import ThemeSwitcher from "./appearance/ThemeSwitcher";
import NotificationSettings from "./notifications/NotificationSettings";
import AISettings from "./ai/AISettings";
import PrivacySettings from "./privacy/PrivacySettings";
import ShortcutsSettings from "./shortcuts/ShortcutsSettings";

export default function SettingsContainer() {
  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
        <ProfileCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Appearance</h3>
            <ThemeSwitcher />
          </div>

          {/* Notifications */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Notifications</h3>
            <NotificationSettings />
          </div>

          {/* Shortcuts */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Shortcuts</h3>
            <ShortcutsSettings />
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* AI Settings */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">AI & Automation</h3>
            <AISettings />
          </div>

          {/* Privacy */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Privacy & Security</h3>
            <PrivacySettings />
          </div>
        </div>
      </div>
    </div>
  );
}
