// src/components/chats/ChatList.tsx
"use client";

import { useChatStore } from "@/store/useChatStore";

export default function ChatList() {
  const chats = useChatStore((s) => s.chats);
  const setSelectedChat = useChatStore((s) => s.setSelectedChat);
  const selectedPhone = useChatStore((s) => s.selectedPhone);
  const markAsRead = useChatStore((s) => s.markAsRead);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // ⭐ SAFETY: remove chats that have no phone number
  const safeChats = chats.filter(
    (c) => c.phone_number && c.phone_number.trim() !== ""
  );

  return (
    <div className="w-72 border-r border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl overflow-y-auto">

      <h2 className="p-4 text-lg font-semibold text-[var(--text)] border-b border-[var(--border)]">
        Chats
      </h2>

      {safeChats.map((c) => {
        const isActive = selectedPhone === c.phone_number;

        return (
          <div
            key={c.phone_number}
            onClick={() => {
              // 🚫 Prevent broken chats from being opened
              if (!c.phone_number || c.phone_number.trim() === "") {
                console.error("❌ Cannot select chat: invalid phone number", c);
                return;
              }

              markAsRead(c.phone_number);
              setSelectedChat(c.phone_number, c.name);
            }}
            className={`
              p-3 flex items-center gap-3 cursor-pointer transition-all duration-200
              border-b border-[var(--border)]
              ${
                isActive
                  ? "bg-[var(--surface-alt)] shadow-inner"
                  : "hover:bg-[var(--bg)]/40"
              }
            `}
          >
            {/* Avatar */}
            <div
              className="
                h-10 w-10 rounded-full
                bg-gradient-to-br from-purple-500 to-blue-600
                flex items-center justify-center text-white font-bold
              "
            >
              {getInitials(c.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text)] truncate">
                {c.name}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {c.last_message || "No messages yet"}
              </p>

              {c.last_time && (
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                  Last active: {c.last_time}
                </p>
              )}
            </div>

            {/* Unread badge */}
            {c.unread > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full ml-2">
                {c.unread}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
