// src/components/settings/shortcuts/ShortcutsSettings.tsx
"use client";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function ShortcutsSettings() {
  const shortcutsEnabled = useSettingsStore((s) => s.shortcutsEnabled);
  const shortcuts = useSettingsStore((s) => s.shortcuts);
  const toggleShortcut = useSettingsStore((s) => s.toggleShortcut);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Keyboard Shortcuts</p>
          <p className="text-xs text-[var(--text-muted)]">Enable quick keyboard actions</p>
        </div>
        <input
          type="checkbox"
          checked={shortcutsEnabled}
          onChange={(e) => useSettingsStore.setState({ shortcutsEnabled: e.target.checked })}
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="flex items-center justify-between">
          <div>
            <div className="font-medium">Global search</div>
            <div className="text-xs text-[var(--text-muted)]">Ctrl + K</div>
          </div>
          <input type="checkbox" checked={shortcuts.globalSearch} onChange={() => toggleShortcut("globalSearch")} />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <div className="font-medium">New message</div>
            <div className="text-xs text-[var(--text-muted)]">Ctrl + M</div>
          </div>
          <input type="checkbox" checked={shortcuts.newMessage} onChange={() => toggleShortcut("newMessage")} />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <div className="font-medium">Add contact</div>
            <div className="text-xs text-[var(--text-muted)]">Ctrl + N</div>
          </div>
          <input type="checkbox" checked={shortcuts.addContact} onChange={() => toggleShortcut("addContact")} />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <div className="font-medium">Shortcuts help</div>
            <div className="text-xs text-[var(--text-muted)]">Ctrl + /</div>
          </div>
          <input type="checkbox" checked={shortcuts.shortcutsHelp} onChange={() => toggleShortcut("shortcutsHelp")} />
        </label>
      </div>
    </div>
  );
}
