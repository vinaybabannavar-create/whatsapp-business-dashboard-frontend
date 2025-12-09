// src/store/useChatStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// TYPES ----------------------------------------------------

export type ChatListItem = {
  phone_number: string;
  name: string;
  last_message: string;
  last_time: string;
  unread: number;
};

type ChatState = {
  selectedPhone: string | null;
  selectedName: string | null;

  chats: ChatListItem[];

  addChat: (item: ChatListItem) => void;
  setChats: (items: ChatListItem[]) => void;
  updateChatPreview: (phone: string, lastMessage: string, time: string) => void;

  updateChatName: (phone: string, newName: string) => void;

  markAsRead: (phone: string) => void;
  setSelectedChat: (phone: string, name: string) => void;

  deleteChatByPhone: (phone: string) => void;
  clearChat: () => void;
};

// STORE ----------------------------------------------------

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      selectedPhone: null,
      selectedName: null,

      chats: [
        {
          phone_number: "9876543210",
          name: "John Doe",
          last_message: "Hi, I want to know more!",
          last_time: "10:01 AM",
          unread: 2,
        },
        {
          phone_number: "9988776655",
          name: "Priya Sharma",
          last_message: "Thanks for the info!",
          last_time: "Yesterday",
          unread: 0,
        },
        {
          phone_number: "9123456780",
          name: "Rahul Kumar",
          last_message: "Sure, I’ll check.",
          last_time: "Monday",
          unread: 1,
        },
      ],

      // ADD NEW CHAT
      addChat: (item) => {
        const current = get().chats;
        if (current.some((c) => c.phone_number === item.phone_number)) return;
        set({ chats: [...current, item] });
      },

      // SET CHAT LIST
      setChats: (items) => set({ chats: items }),

      // UPDATE CHAT PREVIEW
      updateChatPreview: (phone, lastMessage, time) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.phone_number === phone
              ? {
                  ...c,
                  last_message: lastMessage,
                  last_time: time,

                  // unread increment only if not currently selected
                  unread: state.selectedPhone === phone ? 0 : c.unread + 1,
                }
              : c
          ),
        })),

      // UPDATE CHAT NAME
      updateChatName: (phone, newName) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.phone_number === phone ? { ...c, name: newName } : c
          ),

          selectedName: state.selectedPhone === phone ? newName : state.selectedName,
        })),

      // MARK AS READ
      markAsRead: (phone) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.phone_number === phone ? { ...c, unread: 0 } : c
          ),
        })),

      // ⭐ FIXED: SELECT CHAT (strong safety)
      setSelectedChat: (phone, name) => {
        if (!phone || phone.trim() === "") {
          console.error("❌ ERROR: setSelectedChat called with EMPTY phone");
          return;
        }

        set({
          selectedPhone: phone,
          selectedName: name || "Unknown",
        });
      },

      // DELETE CHAT BY PHONE
      deleteChatByPhone: (phone: string) =>
        set((state) => ({
          chats: state.chats.filter((c) => c.phone_number !== phone),

          selectedPhone:
            state.selectedPhone === phone ? null : state.selectedPhone,

          selectedName:
            state.selectedPhone === phone ? null : state.selectedName,
        })),

      // CLEAR CHAT SELECTION
      clearChat: () =>
        set({
          selectedPhone: null,
          selectedName: null,
        }),
    }),
    { name: "wa-chats" }
  )
);
