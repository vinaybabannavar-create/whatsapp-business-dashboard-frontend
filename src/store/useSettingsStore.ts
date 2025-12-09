<<<<<<< HEAD
// src/store/useSettingsStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeName = "light" | "dark" | "whatsapp" | "purple" | "amoled";

type SettingsState = {
  // Profile
  name: string;
  email: string;
  avatarDataUrl: string | null; // base64 preview

  // Theme
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;

  // Notifications
  notifyChatAlerts: boolean;
  notifyCampaigns: boolean;
  notifyDailySummary: boolean;
  notifySound: "classic" | "pop" | "soft" | "silent";
  setNotifySound: (s: SettingsState["notifySound"]) => void;

  // AI settings
  aiProvider: "openai" | "groq" | "local";
  aiModel: string;
  aiMode: "creative" | "professional" | "ultra";
  setAIProvider: (p: SettingsState["aiProvider"]) => void;
  setAIModel: (m: string) => void;
  setAIMode: (m: SettingsState["aiMode"]) => void;

  // Privacy
  twoFactor: boolean;
  lastDevices: string[]; // simple list of device names
  clearAllData: () => void;

  // Shortcuts
  shortcutsEnabled: boolean;
  shortcuts: Record<string, boolean>;
  toggleShortcut: (k: string) => void;

  // Profile helpers
  setProfile: (name: string, email: string) => void;
  setAvatarDataUrl: (url: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      name: "Vinay",
      email: "vinay@example.com",
      avatarDataUrl: null,

      theme: "light",
      setTheme: (theme) => {
        set({ theme });
        // apply to document root
        if (typeof window !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
      },

      notifyChatAlerts: true,
      notifyCampaigns: true,
      notifyDailySummary: true,
      notifySound: "classic",
      setNotifySound: (s) => set({ notifySound: s }),

      aiProvider: "openai",
      aiModel: "gpt-3.5-turbo",
      aiMode: "creative",
      setAIProvider: (p) => set({ aiProvider: p }),
      setAIModel: (m) => set({ aiModel: m }),
      setAIMode: (m) => set({ aiMode: m }),

      twoFactor: false,
      lastDevices: ["Chrome — Desktop (today)"],
      clearAllData: () => {
        set({
          name: "Vinay",
          email: "vinay@example.com",
          avatarDataUrl: null,
          notifyChatAlerts: true,
          notifyCampaigns: true,
          notifyDailySummary: true,
          notifySound: "classic",
          aiProvider: "openai",
          aiModel: "gpt-3.5-turbo",
          aiMode: "creative",
          twoFactor: false,
          lastDevices: [],
          shortcutsEnabled: true,
          shortcuts: {
            globalSearch: true,
            newMessage: true,
            addContact: true,
            shortcutsHelp: true,
          },
          theme: "light",
        });
        // you could also clear server cache / localStorage keys here
      },

      shortcutsEnabled: true,
      shortcuts: {
        globalSearch: true,
        newMessage: true,
        addContact: true,
        shortcutsHelp: true,
      },
      toggleShortcut: (k) =>
        set((s) => ({ shortcuts: { ...s.shortcuts, [k]: !s.shortcuts[k] } })),

      setProfile: (name, email) => set({ name, email }),
      setAvatarDataUrl: (url) => set({ avatarDataUrl: url }),
    }),
    {
      name: "wa-settings",
    }
  )
);
=======
// src/store/useSettingsStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeName = "light" | "dark" | "whatsapp" | "purple" | "amoled";

type SettingsState = {
  // Profile
  name: string;
  email: string;
  avatarDataUrl: string | null; // base64 preview

  // Theme
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;

  // Notifications
  notifyChatAlerts: boolean;
  notifyCampaigns: boolean;
  notifyDailySummary: boolean;
  notifySound: "classic" | "pop" | "soft" | "silent";
  setNotifySound: (s: SettingsState["notifySound"]) => void;

  // AI settings
  aiProvider: "openai" | "groq" | "local";
  aiModel: string;
  aiMode: "creative" | "professional" | "ultra";
  setAIProvider: (p: SettingsState["aiProvider"]) => void;
  setAIModel: (m: string) => void;
  setAIMode: (m: SettingsState["aiMode"]) => void;

  // Privacy
  twoFactor: boolean;
  lastDevices: string[]; // simple list of device names
  clearAllData: () => void;

  // Shortcuts
  shortcutsEnabled: boolean;
  shortcuts: Record<string, boolean>;
  toggleShortcut: (k: string) => void;

  // Profile helpers
  setProfile: (name: string, email: string) => void;
  setAvatarDataUrl: (url: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      name: "Vinay",
      email: "vinay@example.com",
      avatarDataUrl: null,

      theme: "light",
      setTheme: (theme) => {
        set({ theme });
        // apply to document root
        if (typeof window !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
      },

      notifyChatAlerts: true,
      notifyCampaigns: true,
      notifyDailySummary: true,
      notifySound: "classic",
      setNotifySound: (s) => set({ notifySound: s }),

      aiProvider: "openai",
      aiModel: "gpt-3.5-turbo",
      aiMode: "creative",
      setAIProvider: (p) => set({ aiProvider: p }),
      setAIModel: (m) => set({ aiModel: m }),
      setAIMode: (m) => set({ aiMode: m }),

      twoFactor: false,
      lastDevices: ["Chrome — Desktop (today)"],
      clearAllData: () => {
        set({
          name: "Vinay",
          email: "vinay@example.com",
          avatarDataUrl: null,
          notifyChatAlerts: true,
          notifyCampaigns: true,
          notifyDailySummary: true,
          notifySound: "classic",
          aiProvider: "openai",
          aiModel: "gpt-3.5-turbo",
          aiMode: "creative",
          twoFactor: false,
          lastDevices: [],
          shortcutsEnabled: true,
          shortcuts: {
            globalSearch: true,
            newMessage: true,
            addContact: true,
            shortcutsHelp: true,
          },
          theme: "light",
        });
        // you could also clear server cache / localStorage keys here
      },

      shortcutsEnabled: true,
      shortcuts: {
        globalSearch: true,
        newMessage: true,
        addContact: true,
        shortcutsHelp: true,
      },
      toggleShortcut: (k) =>
        set((s) => ({ shortcuts: { ...s.shortcuts, [k]: !s.shortcuts[k] } })),

      setProfile: (name, email) => set({ name, email }),
      setAvatarDataUrl: (url) => set({ avatarDataUrl: url }),
    }),
    {
      name: "wa-settings",
    }
  )
);
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
