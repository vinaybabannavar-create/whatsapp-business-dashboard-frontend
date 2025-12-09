<<<<<<< HEAD
"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { name, email, updateProfile } = useAuthStore();

  const [newName, setNewName] = useState(name || "");
  const [newEmail, setNewEmail] = useState(email || "");

  const saveProfile = () => {
    updateProfile(newName, newEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-lg font-semibold">Edit Profile</h2>

        <div className="space-y-2">
          <label className="text-xs">Name</label>
          <input
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 text-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs">Email</label>
          <input
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 text-sm"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={saveProfile}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
=======
"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { name, email, updateProfile } = useAuthStore();

  const [newName, setNewName] = useState(name || "");
  const [newEmail, setNewEmail] = useState(email || "");

  const saveProfile = () => {
    updateProfile(newName, newEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-lg font-semibold">Edit Profile</h2>

        <div className="space-y-2">
          <label className="text-xs">Name</label>
          <input
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 text-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs">Email</label>
          <input
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 text-sm"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={saveProfile}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
