"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  userId: string | null;
  name: string | null;
  email: string | null;

  isAuthenticated: boolean;

  setAuth: (token: string, userId: string, name: string, email: string) => void;

  updateProfile: (name: string, email: string) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,

      // DEFAULT mock user (you can change this)
      name: "User",
      email: "user@email.com",

      isAuthenticated: true,

      setAuth: (token, userId, name, email) =>
        set({
          token,
          userId,
          name,
          email,
          isAuthenticated: true,
        }),

      updateProfile: (name, email) =>
        set({
          name,
          email,
        }),

      logout: () =>
        set({
          token: null,
          userId: null,
          name: null,
          email: null,
          isAuthenticated: false,
        }),
    }),
    { name: "wa-auth" }
  )
);
