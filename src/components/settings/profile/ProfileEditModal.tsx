// src/components/settings/profile/ProfileEditModal.tsx
"use client";

import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function ProfileEditModal({ isOpen, onClose }: any) {
  const storeName = useSettingsStore((s) => s.name);
  const storeEmail = useSettingsStore((s) => s.email);
  const avatarDataUrl = useSettingsStore((s) => s.avatarDataUrl);

  const setProfile = useSettingsStore((s) => s.setProfile);
  const setAvatarDataUrl = useSettingsStore((s) => s.setAvatarDataUrl);

  const [name, setName] = useState(storeName || "");
  const [email, setEmail] = useState(storeEmail || "");
  const [preview, setPreview] = useState<string | null>(avatarDataUrl || null);

  if (!isOpen) return null;

  const handleFile = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(f);
  };

  const handleSave = () => {
    setProfile(name.trim(), email.trim());
    setAvatarDataUrl(preview);
    // TODO: optionally upload to server here (fetch to /api/upload)
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-[var(--surface)] rounded-xl p-6 w-[520px] border border-[var(--border)] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <button onClick={onClose} className="text-[var(--text-muted)]">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[120px,1fr] gap-4 items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {preview ? <img src={preview} alt="avatar" className="h-full w-full object-cover"/> : (name?.charAt(0) || "U")}
            </div>

            <div className="text-xs text-[var(--text-muted)]">Upload a profile image</div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface-alt)] mb-3"
            />

            <label className="text-xs text-[var(--text-muted)]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border border-[var(--border)]">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-[var(--primary)] text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
