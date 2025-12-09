"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Allowed statuses:
// "online" | "active" | "idle" | "busy"

type UIState = {
  darkMode: boolean;

  // Notifications
  chatAlerts: boolean;
  campaignUpdates: boolean;
  systemNotifications: boolean;

  // USER STATUS (NEW)
  status: "online" | "active" | "idle" | "busy";

  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;

  toggleChatAlerts: () => void;
  toggleCampaignUpdates: () => void;
  toggleSystemNotifications: () => void;

  // NEW: Change user status
  setStatus: (status: "online" | "active" | "idle" | "busy") => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Default values
      darkMode: true,

      // Notifications defaults
      chatAlerts: true,
      campaignUpdates: true,
      systemNotifications: false,

      // Default status
      status: "online",

      // Dark mode
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      setDarkMode: (value) => set({ darkMode: value }),

      // Notifications
      toggleChatAlerts: () => set({ chatAlerts: !get().chatAlerts }),
      toggleCampaignUpdates: () =>
        set({ campaignUpdates: !get().campaignUpdates }),
      toggleSystemNotifications: () =>
        set({ systemNotifications: !get().systemNotifications }),

      // Set user status
      setStatus: (status) => set({ status }),
    }),
    { name: "wa-ui" }
  )
);
