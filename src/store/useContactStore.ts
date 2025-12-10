"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Contact } from "@/lib/types";

type ContactState = {
  contacts: Contact[];

  addContact: (name: string, phone: string) => void;
  deleteContact: (id: string) => void;
  editContact: (updated: Contact) => void;

  updateTags: (id: string, tags: string[]) => void;

  resetInvalidContacts: () => void;
  clearAll: () => void;
};

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [
        {
          id: "1",
          name: "John Doe",
          phone_number: "9876543210",
          tags: ["VIP"],
          created_at: "2024-01-02",
        },
        {
          id: "2",
          name: "Priya Sharma",
          phone_number: "9988776655",
          tags: ["Lead"],
          created_at: "2024-02-10",
        },
        {
          id: "3",
          name: "Rahul Kumar",
          phone_number: "9123456780",
          tags: ["New"],
          created_at: "2024-03-18",
        },
      ],

      addContact: (name, phone) => {
        const cleanName = name.trim();
        const cleanPhone = phone.trim();

        if (!cleanName || !cleanPhone) return;

        if (get().contacts.some((c) => c.phone_number === cleanPhone)) {
          console.warn("Duplicate phone blocked:", cleanPhone);
          return;
        }

        const newContact: Contact = {
          id: Date.now().toString(),
          name: cleanName,
          phone_number: cleanPhone,
          tags: ["New"],
          created_at: new Date().toISOString().split("T")[0],
        };

        set({ contacts: [...get().contacts, newContact] });
      },

      deleteContact: (id) =>
        set({
          contacts: get().contacts.filter((c) => c.id !== id),
        }),

      editContact: (updated) =>
        set({
          contacts: get().contacts.map((c) =>
            c.id === updated.id ? updated : c
          ),
        }),

      updateTags: (id, tags) =>
        set({
          contacts: get().contacts.map((c) =>
            c.id === id ? { ...c, tags } : c
          ),
        }),

      resetInvalidContacts: () => {
        const cleaned = get().contacts.filter((c: any) => {
          return (
            typeof c === "object" &&
            typeof c.id === "string" &&
            typeof c.name === "string" &&
            typeof c.phone_number === "string" &&
            Array.isArray(c.tags)
          );
        });

        set({ contacts: cleaned });
      },

      clearAll: () => set({ contacts: [] }),
    }),
    {
      name: "wa-contacts",
      version: 2,
    }
  )
);
