// src/components/chats/ChatList.tsx
"use client";

import { useChatStore } from "@/store/useChatStore";

export default function ChatList() {
  const chats = useChatStore((s) => s.chats);
  const selectedPhone = useChatStore((s) => s.selectedPhone);
  const setSelectedChat = useChatStore((s) => s.setSelectedChat);
  const markAsRead = useChatStore((s) => s.markAsRead);

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U"; // fallback
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Safety: remove broken chat entries
  const safeChats = chats.filter(
    (c) => typeof c.phone_number === "string" && c.phone_number.trim() !== ""
  );

  return (
    <div className="w-72 border-r border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl overflow-y-auto">

      {/* Header */}
      <h2 className="p-4 text-lg font-semibold text-[var(--text)] border-b border-[var(--border)]">
        Chats
      </h2>

      {/* Chat List */}
      {safeChats.map((c) => {
        const isActive = selectedPhone === c.phone_number;

        return (
          <div
            key={c.phone_number}
            onClick={() => {
              if (!c.phone_number.trim()) return console.error("Invalid chat", c);

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
                shadow-sm
              "
            >
              {getInitials(c.name)}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text)] truncate">
                {c.name || "Unknown User"}
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
              <span
                className="
                  bg-red-500 text-white 
                  text-[10px] px-2 py-[2px] 
                  rounded-full ml-2 shadow-sm
                "
              >
                {c.unread}
              </span>
            )}
          </div>
        );
      })}

      {safeChats.length === 0 && (
        <p className="text-center text-sm text-[var(--text-muted)] py-6">
          No chats available.
        </p>
      )}
    </div>
  );
}
