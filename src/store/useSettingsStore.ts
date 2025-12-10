// src/store/useSettingsStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeName = "light" | "dark" | "whatsapp" | "purple" | "amoled";

type SettingsState = {
  name: string;
  email: string;
  avatarDataUrl: string | null;

  theme: ThemeName;
  setTheme: (t: ThemeName) => void;

  notifyChatAlerts: boolean;
  notifyCampaigns: boolean;
  notifyDailySummary: boolean;
  notifySound: "classic" | "pop" | "soft" | "silent";
  setNotifySound: (s: SettingsState["notifySound"]) => void;

  aiProvider: "openai" | "groq" | "local";
  aiModel: string;
  aiMode: "creative" | "professional" | "ultra";
  setAIProvider: (p: SettingsState["aiProvider"]) => void;
  setAIModel: (m: string) => void;
  setAIMode: (m: SettingsState["aiMode"]) => void;

  twoFactor: boolean;
  lastDevices: string[];
  clearAllData: () => void;

  shortcutsEnabled: boolean;
  shortcuts: Record<string, boolean>;
  toggleShortcut: (k: string) => void;

  setProfile: (name: string, email: string) => void;
  setAvatarDataUrl: (url: string | null) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      name: "Vinay",
      email: "vinay@example.com",
      avatarDataUrl: null,

      theme: "light",
      setTheme: (theme) => {
        set({ theme });
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
      },

      shortcutsEnabled: true,
      shortcuts: {
        globalSearch: true,
        newMessage: true,
        addContact: true,
        shortcutsHelp: true,
      },
      toggleShortcut: (k) =>
        set((s) => ({
          shortcuts: { ...s.shortcuts, [k]: !s.shortcuts[k] },
        })),

      setProfile: (name, email) => set({ name, email }),
      setAvatarDataUrl: (url) => set({ avatarDataUrl: url }),
    }),
    { name: "wa-settings" }
  )
);
