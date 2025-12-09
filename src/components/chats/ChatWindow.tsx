// src/components/chats/ChatWindow.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import { useChatStore } from "@/store/useChatStore";
import {
  apiChatHistory,
  apiSendMessage,
  apiSendFile,
  apiDeleteMessageForMe,
  apiDeleteMessageForEveryone,
  apiDeleteChat,
} from "@/lib/apiClient"; // ← ADDED delete APIs (implement these in apiClient)
import type { Message } from "@/lib/types";
import ChatInput from "./ChatInput";
import {
  Pin,
  Archive,
  Image as ImageIcon,
  Search,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

// Extend with local UI data
type RichMessage = Message & {
  fileUrl?: string;
  fileName?: string;
  fileType?: "image" | "document" | "audio";
  reactions?: string[];
  replyToId?: string | null;
  // deletion flags
  deletedForMe?: boolean;
  isDeleted?: boolean;
};

const REACTION_SET = ["❤️", "😂", "👍", "🔥", "😢"];

export default function ChatWindow() {
  // ===== STORES =====
  const { selectedPhone, selectedName, clearChat } = useChatStore();

  // ===== LOCAL STATE =====
  const [messages, setMessages] = useState<RichMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<RichMessage | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [wallpaper, setWallpaper] = useState<"dots" | "gradient" | "solid">(
    "dots"
  );

  // NEW: smart scroll + “new messages” pill + per-chat search
  const [autoScroll, setAutoScroll] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // NEW: per-message menu open state
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ===== FORMAT DATE (Today, Yesterday, Monday...) =====
  function getDateLabel(raw: string) {
    const msgDate = new Date(raw);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    msgDate.setHours(0, 0, 0, 0);

    const diff =
      (today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7)
      return msgDate.toLocaleDateString("en-US", { weekday: "long" });

    return msgDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // ===== LOAD CHAT HISTORY =====
  useEffect(() => {
    async function load() {
      if (!selectedPhone) {
        setMessages([]);
        return;
      }

      setLoading(true);
      const data = await apiChatHistory(selectedPhone);

      const cleaned: RichMessage[] = data.map((m) => ({
        ...m,
        time:
          m.time && typeof m.time === "string"
            ? m.time.includes("T")
              ? m.time
              : new Date(m.time).toISOString()
            : new Date().toISOString(),
        // ensure flags exist
        deletedForMe: (m as any).deletedForMe ?? false,
        isDeleted: (m as any).isDeleted ?? false,
      }));

      setMessages(cleaned);
      setLoading(false);
      setReplyTo(null);
      setAutoScroll(true);
      setHasNewMessages(false);
    }

    load();
  }, [selectedPhone]);

  // ===== AUTO SCROLL =====
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasNewMessages(false);
    } else if (messages.length > 0) {
      // user scrolled up → show “new messages”
      setHasNewMessages(true);
    }
  }, [messages, autoScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const atBottom = scrollHeight - (scrollTop + clientHeight) < 40;
    setAutoScroll(atBottom);
    if (atBottom) setHasNewMessages(false);
  };

  // ===== RENDER TICK STATUS =====
  const renderStatus = (status?: Message["status"]) => {
    if (!status) return null;
    if (status === "sent")
      return <span className="text-[10px] text-slate-200">✓</span>;
    if (status === "delivered")
      return <span className="text-[10px] text-slate-200">✓✓</span>;
    return <span className="text-[10px] text-emerald-300 font-bold">✓✓</span>;
  };

  // ===== REACTION HANDLER =====
  const toggleReaction = (id: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              reactions: m.reactions?.includes(emoji)
                ? m.reactions.filter((x) => x !== emoji)
                : [...(m.reactions || []), emoji],
            }
          : m
      )
    );
  };

  // ===== SEND TEXT MESSAGE =====
  const handleSend = async (text: string) => {
    if (!selectedPhone) {
      console.error("❌ Cannot send message: no phone selected");
      return;
    }

    const tempId = Date.now().toString();

    // add message instantly
    const newMsg: RichMessage = {
      id: tempId,
      from: "business",
      text,
      time: new Date().toISOString(),
      status: "sent",
      replyToId: replyTo?.id ?? null,
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyTo(null);

    // save to backend
    const saved = await apiSendMessage(selectedPhone, text);

    // merge backend fields without losing rich metadata
    setMessages((prev) =>
      prev.map((m) =>
        m.id === tempId
          ? {
              ...m,
              id: saved.id,
              time: saved.time,
              text: saved.text,
              status: saved.status,
            }
          : m
      )
    );
  };

  // ===== SEND FILE (NOW SAVES TO BACKEND) =====
  const handleSendFile = async (file: File) => {
    if (!selectedPhone) {
      console.error("❌ Cannot send message: no phone selected");
      return;
    }

    const tempId = Date.now().toString();
    const fileType: RichMessage["fileType"] = file.type.startsWith("image")
      ? "image"
      : file.type.startsWith("audio")
      ? "audio"
      : "document";

    const localUrl = URL.createObjectURL(file);

    // 1) Show instant preview (same UX as before)
    const newMsg: RichMessage = {
      id: tempId,
      from: "business",
      text: "",
      time: new Date().toISOString(),
      status: "sent",
      fileUrl: localUrl,
      fileName: file.name,
      fileType,
      replyToId: replyTo?.id ?? null,
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyTo(null);

    // 2) Upload to backend and replace temp message with real saved one
    try {
      const saved = await apiSendFile(selectedPhone, file);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                id: saved.id ?? m.id,
                time: saved.time ?? m.time,
                fileUrl: saved.fileUrl ?? m.fileUrl,
                fileName: saved.fileName ?? m.fileName,
                fileType:
                  (saved.fileType as RichMessage["fileType"]) ?? m.fileType,
                status: saved.status ?? m.status,
              }
            : m
        )
      );
    } catch (err) {
      console.error("File upload failed:", err);
      // Optional: remove temp message if upload fails
      // setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  // ===== DELETE: for me =====
  const deleteForMe = async (id: string) => {
    if (!selectedPhone) return;
    // optimistic UI: mark deletedForMe locally
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, deletedForMe: true, text: "", fileUrl: undefined } : m
      )
    );
    setMenuOpenId(null);
    try {
      await apiDeleteMessageForMe(selectedPhone, id);
    } catch (err) {
      console.error("Delete for me failed:", err);
      // Optionally reload history to recover state
      const data = await apiChatHistory(selectedPhone);
      setMessages(data as RichMessage[]);
    }
  };

  // ===== DELETE: for everyone =====
  const deleteForEveryone = async (id: string) => {
    if (!selectedPhone) return;
    // optimistic UI: mark as deleted for everyone and hide content
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              isDeleted: true,
              text: "",
              fileUrl: undefined,
              fileName: undefined,
              fileType: undefined,
            }
          : m
      )
    );
    setMenuOpenId(null);
    try {
      await apiDeleteMessageForEveryone(selectedPhone, id);
    } catch (err) {
      console.error("Delete for everyone failed:", err);
      const data = await apiChatHistory(selectedPhone);
      setMessages(data as RichMessage[]);
    }
  };

  // ===== DELETE: entire chat =====
  const deleteChat = async () => {
    if (!selectedPhone) return;
    // optimistic UI: clear messages locally and call backend
    const prev = messages;
    setMessages([]);
    try {
      await apiDeleteChat(selectedPhone);
      // also clear chat selection if desired
      clearChat();
    } catch (err) {
      console.error("Delete chat failed:", err);
      setMessages(prev); // rollback
    }
  };

  // ===== EMPTY VIEW =====
  if (!selectedPhone) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)] bg-[var(--bg)] rounded-xl border border-[var(--border)]">
        Select a chat from the left to start messaging.
      </div>
    );
  }

  // ===== WALLPAPER =====
  const wallpaperClass =
    wallpaper === "dots"
      ? "chat-bg"
      : wallpaper === "gradient"
      ? "bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900"
      : "bg-[#111B21]";

  // small helper for tooltip
  const buildStatusTitle = (m: Message) => {
    const time = new Date(m.time).toLocaleString();
    return `Status: ${m.status ?? "sent"} • ${time}`;
  };

  // ===== RENDER UI =====
  return (
    <div
      className={`flex-1 flex flex-col rounded-xl overflow-hidden ${wallpaperClass}`}
    >
      {/* ============ HEADER ============ */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            {selectedName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              {selectedName}
              <span className="text-xs text-[var(--text-muted)] ml-1">
                ({selectedPhone})
              </span>
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>
                online {isPinned && "• Pinned"} {isArchived && "• Archived"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CONTROLS */}
        <div className="flex items-center gap-2 text-xs">
          {/* Wallpaper switcher */}
          <div className="hidden md:flex items-center gap-1">
            <ImageIcon size={14} className="text-[var(--text-muted)]" />
            <select
              value={wallpaper}
              onChange={(e) =>
                setWallpaper(e.target.value as "dots" | "gradient" | "solid")
              }
              className="bg-[var(--surface)] border border-[var(--border)] text-[10px] px-2 py-1 rounded-lg text-[var(--text)]"
            >
              <option value="dots">Dots</option>
              <option value="gradient">Gradient</option>
              <option value="solid">Solid</option>
            </select>
          </div>

          <button
            onClick={() => setIsPinned((v) => !v)}
            className={`p-1 rounded-lg border text-[10px] flex items-center gap-1 ${
              isPinned
                ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                : "border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg)]"
            }`}
          >
            <Pin size={12} /> {isPinned ? "Pinned" : "Pin"}
          </button>

          <button
            onClick={() => setIsArchived((v) => !v)}
            className={`p-1 rounded-lg border text-[10px] flex items-center gap-1 ${
              isArchived
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg)]"
            }`}
          >
            <Archive size={12} /> {isArchived ? "Archived" : "Archive"}
          </button>

          <button
            onClick={clearChat}
            className="text-xs px-3 py-1 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            Close
          </button>

          {/* NEW: Delete chat */}
          <button
            onClick={deleteChat}
            className="text-xs px-3 py-1 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
            title="Delete entire chat"
          >
            Delete Chat
          </button>
        </div>
      </header>

      {/* ============ CHAT SEARCH BAR ============ */}
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)]/60 flex items-center gap-2 text-xs">
        <Search size={14} className="text-[var(--text-muted)]" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search in this chat…"
          className="flex-1 bg-transparent text-[var(--text)] placeholder:text-[var(--text-muted)] text-xs focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            Clear
          </button>
        )}
      </div>

      {/* ============ TYPING INDICATOR ============ */}
      {isTyping && (
        <div className="px-4 py-1 text-xs text-emerald-400 flex items-center gap-2">
          {selectedName} is typing…
          <span className="flex gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300" />
          </span>
        </div>
      )}

      {/* ============ MESSAGES ZONE + NEW MSG PILL ============ */}
      <div className="relative flex-1">
        {/* scrollable area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto px-4 py-3"
        >
          {messages.map((m, i) => {
            const isMe = m.from === "business";

            const currentLabel = getDateLabel(m.time);
            const prevLabel =
              i > 0 ? getDateLabel(messages[i - 1].time) : null;
            const showSeparator = currentLabel !== prevLabel;

            const replyTarget = m.replyToId
              ? messages.find((msg) => msg.id === m.replyToId)
              : undefined;

            const isMatch =
              !!searchTerm &&
              (m.text || "").toLowerCase().includes(searchTerm.toLowerCase());

            return (
              <div key={m.id} className="mb-2">
                {/* DATE SEPARATOR */}
                {showSeparator && (
                  <div className="text-center my-4">
                    <span className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 rounded-full">
                      {currentLabel}
                    </span>
                  </div>
                )}

                {/* MESSAGE BUBBLE */}
                <div
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className="relative"> {/* made relative for menu positioning */}
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        isMe
                          ? "bg-emerald-500 text-white rounded-br-sm"
                          : "bg-[var(--surface)] text-[var(--text)] rounded-bl-sm"
                      } ${isMatch ? "ring-2 ring-yellow-300/70" : ""}`}
                      title={buildStatusTitle(m)}
                    >
                      {/* If message was deleted for everyone */}
                      {m.isDeleted ? (
                        <div className="italic text-gray-400">This message was deleted</div>
                      ) : m.deletedForMe ? (
                        <div className="italic text-gray-400">Deleted for me</div>
                      ) : (
                        <>
                          {/* REPLY PREVIEW */}
                          {replyTarget && (
                            <div className="border-l-2 border-white/40 dark:border-emerald-300/40 pl-2 mb-1 text-[11px] opacity-80">
                              <p className="font-semibold">
                                {replyTarget.from === "business" ? "You" : selectedName}
                              </p>
                              <p className="truncate max-w-[180px]">
                                {replyTarget.text || replyTarget.fileName || "[media]"}
                              </p>
                            </div>
                          )}

                          {/* IMAGE */}
                          {m.fileType === "image" && m.fileUrl && (
                            <img
                              src={m.fileUrl}
                              className="w-40 rounded-lg mb-1 border border-white/20"
                              alt="sent"
                            />
                          )}

                          {/* DOCUMENT */}
                          {m.fileType === "document" && (
                            <div className="flex items-center gap-2 bg-black/10 dark:bg-white/10 p-2 rounded-lg mb-1 text-xs">
                              📄 <span className="truncate">{m.fileName}</span>
                            </div>
                          )}

                          {/* AUDIO */}
                          {m.fileType === "audio" && m.fileUrl && (
                            <div className="mb-1">
                              <audio controls className="w-48">
                                <source src={m.fileUrl} />
                              </audio>
                            </div>
                          )}

                          {/* TEXT */}
                          {m.text && (
                            <p className="whitespace-pre-wrap break-words">{m.text}</p>
                          )}

                          {/* TIME + STATUS */}
                          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-80">
                            <span>
                              {new Date(m.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isMe && renderStatus(m.status)}
                          </div>

                          {/* ACTIONS */}
                          <div className="flex justify-between items-center mt-1 text-[11px] opacity-80">
                            <button
                              className="hover:opacity-100 hover:underline"
                              onClick={() => setReplyTo(m)}
                            >
                              ↩ Reply
                            </button>

                            <div className="flex gap-1">
                              {REACTION_SET.map((r) => (
                                <button
                                  key={r}
                                  onClick={() => toggleReaction(m.id, r)}
                                  className="hover:scale-110 transition"
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* REACTIONS DISPLAY */}
                          {m.reactions && m.reactions.length > 0 && (
                            <div className="mt-1 flex justify-end">
                              <div className="bg-black/10 dark:bg:white/10 rounded-full px-2 py-[2px] text-[11px]">
                                {m.reactions.map((r) => (
                                  <span key={r} className="mr-1">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* 3-dots menu trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === m.id ? null : m.id);
                      }}
                      className="absolute -top-1 right-0 p-1 rounded hover:bg-[var(--bg)]"
                      title="Message actions"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {/* Menu popup */}
                    {menuOpenId === m.id && (
                      <div
                        className="absolute right-0 mt-8 w-44 bg-[var(--surface)] border border-[var(--border)] rounded shadow-md z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-[var(--bg)]"
                          onClick={() => {
                            setReplyTo(m);
                            setMenuOpenId(null);
                          }}
                        >
                          Reply
                        </button>

                        <button
                          className="w-full text-left px-3 py-2 hover:bg-[var(--bg)]"
                          onClick={() => {
                            deleteForMe(m.id);
                          }}
                        >
                          Delete for Me
                        </button>

                        <button
                          className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            deleteForEveryone(m.id);
                          }}
                        >
                          Delete for Everyone
                        </button>

                        <button
                          className="w-full text-left px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--bg)]"
                          onClick={() => setMenuOpenId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* NEW MESSAGES PILL */}
        {hasNewMessages && (
          <button
            onClick={() => {
              setAutoScroll(true);
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
              absolute bottom-4 right-4
              flex items-center gap-1
              px-3 py-1.5 rounded-full
              bg-[var(--surface)] border border-[var(--border)]
              text-[10px] text-[var(--text)]
              shadow-lg hover:bg-[var(--surface-alt)]
            "
          >
            New messages
            <ChevronDown size={12} />
          </button>
        )}
      </div>

      {/* ============ INPUT BOX ============ */}
      <ChatInput
        onSend={handleSend}
        onSendFile={handleSendFile}
        disabled={loading}
        onTyping={() => setIsTyping(true)}
        onStopTyping={() => setIsTyping(false)}
        replyTo={
          replyTo ? { id: replyTo.id, text: replyTo.text, from: replyTo.from } : null
        }
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}
