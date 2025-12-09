<<<<<<< HEAD
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
      <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
        <ProfileCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Appearance</h3>
            <ThemeSwitcher />
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Notifications</h3>
            <NotificationSettings />
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Shortcuts</h3>
            <ShortcutsSettings />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">AI & Automation</h3>
            <AISettings />
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Privacy & Security</h3>
            <PrivacySettings />
          </div>
        </div>
      </div>
    </div>
  );
}
=======
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
      <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
        <ProfileCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Appearance</h3>
            <ThemeSwitcher />
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Notifications</h3>
            <NotificationSettings />
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Shortcuts</h3>
            <ShortcutsSettings />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">AI & Automation</h3>
            <AISettings />
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-3">Privacy & Security</h3>
            <PrivacySettings />
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
