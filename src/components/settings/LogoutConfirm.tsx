<<<<<<< HEAD
"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutConfirm({ onClose }: { onClose: () => void }) {
  const { logout } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl w-80 text-center space-y-4">
        <h3 className="text-lg font-semibold">Are you sure?</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Do you really want to logout?
        </p>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              logout();
              onClose();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
=======
"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutConfirm({ onClose }: { onClose: () => void }) {
  const { logout } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl w-80 text-center space-y-4">
        <h3 className="text-lg font-semibold">Are you sure?</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Do you really want to logout?
        </p>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              logout();
              onClose();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
