<<<<<<< HEAD
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const updatePassword = () => {
    alert("Password changed (mock)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <div className="space-y-2">
          <label className="text-xs">Old Password</label>
          <input
            type="password"
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 text-sm"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs">New Password</label>
          <input
            type="password"
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 text-sm"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={updatePassword}>
            Change
          </Button>
        </div>
      </div>
    </div>
  );
}
=======
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const updatePassword = () => {
    alert("Password changed (mock)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <div className="space-y-2">
          <label className="text-xs">Old Password</label>
          <input
            type="password"
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 text-sm"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs">New Password</label>
          <input
            type="password"
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 text-sm"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={updatePassword}>
            Change
          </Button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
