// src/components/settings/profile/ProfileCard.tsx
"use client";

import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import ProfileEditModal from "./ProfileEditModal";

export default function ProfileCard() {
  const name = useSettingsStore((s) => s.name);
  const email = useSettingsStore((s) => s.email);
  const avatar = useSettingsStore((s) => s.avatarDataUrl);

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Profile</h3>
          <p className="text-xs text-[var(--text-muted)]">Manage your profile information.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow">
              {avatar ? (
                <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                name?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs text-[var(--text-muted)]">{email}</p>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-95 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {open && <ProfileEditModal isOpen={open} onClose={() => setOpen(false)} />}
    </>
  );
}
