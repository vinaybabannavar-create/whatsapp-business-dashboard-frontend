"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Contact } from "@/lib/types";

type ContactState = {
  contacts: Contact[];
  addContact: (name: string, phone: string) => void;
  deleteContact: (id: string) => void;        // ⭐ ADDED
  editContact: (updated: Contact) => void;    // ⭐ ADDED
  resetInvalidContacts: () => void;
};

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({

      // Initial sample contacts
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

      // ADD CONTACT
      addContact: (name, phone) => {
        if (!name.trim() || !phone.trim()) return;

        const newContact: Contact = {
          id: Date.now().toString(),
          name: name.trim(),
          phone_number: phone.trim(),
          tags: ["New"],
          created_at: new Date().toISOString().split("T")[0],
        };

        set({
          contacts: [...get().contacts, newContact],
        });
      },

      // ⭐ DELETE CONTACT
      deleteContact: (id) => {
        set({
          contacts: get().contacts.filter((c) => c.id !== id),
        });
      },

      // ⭐ EDIT CONTACT
      editContact: (updated) => {
        set({
          contacts: get().contacts.map((c) =>
            c.id === updated.id ? updated : c
          ),
        });
      },

      // CLEAN INVALID CONTACTS
      resetInvalidContacts: () => {
        const cleaned = get().contacts.filter(
          (c: any) =>
            typeof c === "object" &&
            typeof c.name === "string" &&
            typeof c.phone_number === "string"
        );

        set({ contacts: cleaned });
      },
    }),
    { name: "wa-contacts" }
  )
);
