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
} from "@/lib/apiClient";

import type { Message as BaseMessage } from "@/lib/types";

import ChatInput from "./ChatInput";
import {
  Pin,
  Archive,
  Image as ImageIcon,
  Search,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

/* ------------------------------------------------------------------
   Extended message used only inside UI
-------------------------------------------------------------------*/
type RichMessage = BaseMessage & {
  _id: string;
  text?: string;
  createdAt: string;

  fileUrl?: string;
  fileName?: string;
  fileType?: "image" | "document" | "audio";

  replyToId?: string | null;
  reactions?: string[];

  deletedForMe?: boolean;
  isDeleted?: boolean;
};

const REACTION_SET = ["❤️", "😂", "👍", "🔥", "😢"];

/* ------------------------------------------------------------------
   Chat Window Component
-------------------------------------------------------------------*/
export default function ChatWindow() {
  const { selectedPhone, selectedName, clearChat } = useChatStore();

  const [messages, setMessages] = useState<RichMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<RichMessage | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [wallpaper, setWallpaper] = useState<"dots" | "gradient" | "solid">(
    "dots"
  );

  const [autoScroll, setAutoScroll] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* ------------------------------------------------------------------
     Helpers
  -------------------------------------------------------------------*/
  function getDateLabel(raw: string) {
    const msgDate = new Date(raw);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    msgDate.setHours(0, 0, 0, 0);

    const diff = (today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return msgDate.toLocaleDateString("en-US", { weekday: "long" });

    return msgDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const buildStatusTitle = (m: RichMessage) => {
    const time = new Date(m.createdAt).toLocaleString();
    return `Status: ${m.status ?? "sent"} • ${time}`;
  };

  /* ------------------------------------------------------------------
     Load Chat History
  -------------------------------------------------------------------*/
  useEffect(() => {
    async function load() {
      if (!selectedPhone) {
        setMessages([]);
        return;
      }

      const phone = selectedPhone as string;

      setLoading(true);
      try {
        const data = await apiChatHistory(phone);
        const cleaned: RichMessage[] = (data || []).map((m: any) => ({
          ...m,
          _id: m._id ?? m.id ?? String(Math.random()).slice(2),
          createdAt:
            typeof m.createdAt === "string"
              ? m.createdAt
              : typeof m.time === "string"
              ? m.time
              : new Date().toISOString(),
          reactions: Array.isArray(m.reactions) ? m.reactions : [],
          deletedForMe: m.deletedForMe ?? false,
          isDeleted: m.isDeleted ?? false,
        }));

        setMessages(cleaned);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([]);
      }

      setLoading(false);
      setReplyTo(null);
      setAutoScroll(true);
      setHasNewMessages(false);
    }

    load();
  }, [selectedPhone]);

  /* ------------------------------------------------------------------
     Auto Scroll
  -------------------------------------------------------------------*/
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasNewMessages(false);
    } else if (messages.length > 0) {
      setHasNewMessages(true);
    }
  }, [messages, autoScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const atBottom = scrollHeight - (scrollTop + clientHeight) < 40;
    setAutoScroll(atBottom);
    if (atBottom) setHasNewMessages(false);
  };

  /* ------------------------------------------------------------------
     Status Ticks
  -------------------------------------------------------------------*/
  const renderStatus = (status?: BaseMessage["status"]) => {
    if (!status) return null;
    if (status === "sent") return <span className="text-[10px] text-slate-200">✓</span>;
    if (status === "delivered") return <span className="text-[10px] text-slate-200">✓✓</span>;
    return <span className="text-[10px] text-emerald-300 font-bold">✓✓</span>;
  };

  /* ------------------------------------------------------------------
     Reaction Toggle
  -------------------------------------------------------------------*/
  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msgId
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

  /* ------------------------------------------------------------------
     Send Text Message
  -------------------------------------------------------------------*/
  const handleSend = async (text: string) => {
    if (!selectedPhone) return;

    const tempId = Date.now().toString();

    const newMsg: RichMessage = {
      _id: tempId,
      from: "business",
      text,
      createdAt: new Date().toISOString(),
      status: "sent",
      replyToId: replyTo?._id ?? null,
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyTo(null);

    try {
      const saved = await apiSendMessage(selectedPhone, text);
      const savedId = saved._id ?? saved.id ?? tempId;

      const savedTime =
        saved.createdAt ?? saved.time ?? new Date().toISOString();

      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId
            ? {
                ...m,
                _id: savedId,
                createdAt: savedTime,
                text: saved.text ?? m.text,
                status: saved.status ?? m.status,
              }
            : m
        )
      );
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  /* ------------------------------------------------------------------
     Send File
  -------------------------------------------------------------------*/
  const handleSendFile = async (file: File) => {
    if (!selectedPhone) return;

    const tempId = Date.now().toString();
    const fileType: RichMessage["fileType"] =
      file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("audio")
        ? "audio"
        : "document";

    const localUrl = URL.createObjectURL(file);

    const newMsg: RichMessage = {
      _id: tempId,
      from: "business",
      text: "",
      createdAt: new Date().toISOString(),
      status: "sent",
      fileUrl: localUrl,
      fileName: file.name,
      fileType,
      replyToId: replyTo?._id ?? null,
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyTo(null);

    try {
      const saved = await apiSendFile(selectedPhone, file);
      const savedId = saved._id ?? saved.id ?? tempId;

      const savedTime =
        saved.createdAt ?? saved.time ?? new Date().toISOString();

      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId
            ? {
                ...m,
                _id: savedId,
                createdAt: savedTime,
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
    }
  };

  /* ------------------------------------------------------------------
     Delete Message (For Me)
  -------------------------------------------------------------------*/
  const deleteForMe = async (msgId: string) => {
    if (!selectedPhone) return;

    setMessages((prev) =>
      prev.map((m) =>
        m._id === msgId
          ? { ...m, deletedForMe: true, text: "", fileUrl: undefined }
          : m
      )
    );

    setMenuOpenId(null);

    try {
      await apiDeleteMessageForMe(selectedPhone, msgId);
    } catch (err) {
      console.error("Delete for me failed:", err);
    }
  };

  /* ------------------------------------------------------------------
     Delete For Everyone
  -------------------------------------------------------------------*/
  const deleteForEveryone = async (msgId: string) => {
    if (!selectedPhone) return;

    setMessages((prev) =>
      prev.map((m) =>
        m._id === msgId
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
      await apiDeleteMessageForEveryone(selectedPhone, msgId);
    } catch (err) {
      console.error("Delete for everyone failed:", err);
    }
  };

  /* ------------------------------------------------------------------
     Delete Entire Chat
  -------------------------------------------------------------------*/
  const deleteChat = async () => {
    if (!selectedPhone) return;

    const prev = messages;
    setMessages([]);

    try {
      await apiDeleteChat(selectedPhone);
      clearChat();
    } catch (err) {
      console.error("Delete chat failed:", err);
      setMessages(prev);
    }
  };

  /* ------------------------------------------------------------------
     No Chat Selected
  -------------------------------------------------------------------*/
  if (!selectedPhone) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)] bg-[var(--bg)] border border-[var(--border)] rounded-xl">
        Select a chat from the left to start messaging.
      </div>
    );
  }

  /* ------------------------------------------------------------------
     Wallpaper
  -------------------------------------------------------------------*/
  const wallpaperClass =
    wallpaper === "dots"
      ? "chat-bg"
      : wallpaper === "gradient"
      ? "bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900"
      : "bg-[#111B21]";

  /* ------------------------------------------------------------------
     RENDER UI
  -------------------------------------------------------------------*/
  return (
    <div className={`flex-1 flex flex-col rounded-xl overflow-hidden ${wallpaperClass}`}>
      {/* HEADER */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            {(selectedName || "U")[0].toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              {selectedName || "Unknown"}
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

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-2 text-xs">
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

          <button
            onClick={deleteChat}
            className="text-xs px-3 py-1 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
            title="Delete entire chat"
          >
            Delete Chat
          </button>
        </div>
      </header>

      {/* SEARCH BAR */}
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

      {/* TYPING INDICATOR */}
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

      {/* ------------------------------------------------------------------
         MESSAGES AREA
      -------------------------------------------------------------------*/}
      <div className="relative flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto px-4 py-3"
        >
          {messages.map((m, i) => {
            const isMe = m.from === "business";

            const currentLabel = getDateLabel(m.createdAt);
            const prevLabel =
              i > 0 ? getDateLabel(messages[i - 1].createdAt) : null;
            const showSeparator = currentLabel !== prevLabel;

            const replyTarget = m.replyToId
              ? messages.find((msg) => msg._id === m.replyToId)
              : undefined;

            const isMatch =
              !!searchTerm &&
              (m.text || "").toLowerCase().includes(searchTerm.toLowerCase());

            return (
              <div key={m._id} className="mb-2">
                {showSeparator && (
                  <div className="text-center my-4">
                    <span className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 rounded-full">
                      {currentLabel}
                    </span>
                  </div>
                )}

                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className="relative">
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        isMe
                          ? "bg-emerald-500 text-white rounded-br-sm"
                          : "bg-[var(--surface)] text-[var(--text)] rounded-bl-sm"
                      } ${isMatch ? "ring-2 ring-yellow-300/70" : ""}`}
                      title={buildStatusTitle(m)}
                    >
                      {/* Deleted States */}
                      {m.isDeleted ? (
                        <div className="italic text-gray-400">
                          This message was deleted
                        </div>
                      ) : m.deletedForMe ? (
                        <div className="italic text-gray-400">
                          Deleted for me
                        </div>
                      ) : (
                        <>
                          {/* Reply Preview */}
                          {replyTarget && (
                            <div className="border-l-2 border-white/40 pl-2 mb-1 text-[11px] opacity-80">
                              <p className="font-semibold">
                                {replyTarget.from === "business"
                                  ? "You"
                                  : selectedName}
                              </p>
                              <p className="truncate max-w-[180px]">
                                {replyTarget.text ||
                                  replyTarget.fileName ||
                                  "[media]"}
                              </p>
                            </div>
                          )}

                          {/* Image */}
                          {m.fileType === "image" && m.fileUrl && (
                            <img
                              src={m.fileUrl}
                              className="w-40 rounded-lg mb-1 border border-white/20"
                              alt="sent"
                            />
                          )}

                          {/* Document */}
                          {m.fileType === "document" && (
                            <div className="flex items-center gap-2 bg-black/10 dark:bg-white/10 p-2 rounded-lg mb-1 text-xs">
                              📄 <span className="truncate">{m.fileName}</span>
                            </div>
                          )}

                          {/* Audio */}
                          {m.fileType === "audio" && m.fileUrl && (
                            <div className="mb-1">
                              <audio controls className="w-48">
                                <source src={m.fileUrl} />
                              </audio>
                            </div>
                          )}

                          {/* Text */}
                          {m.text && (
                            <p className="whitespace-pre-wrap break-words">
                              {m.text}
                            </p>
                          )}

                          {/* TIME + STATUS */}
                          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-80">
                            <span>
                              {new Date(m.createdAt).toLocaleTimeString([], {
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
                                  onClick={() => toggleReaction(m._id, r)}
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
                              <div className="bg-black/10 dark:bg-white/10 rounded-full px-2 py-[2px] text-[11px]">
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

                    {/* MENU BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === m._id ? null : m._id);
                      }}
                      className="absolute -top-1 right-0 p-1 rounded hover:bg-[var(--bg)]"
                      title="Message actions"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {/* MENU */}
                    {menuOpenId === m._id && (
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
                          onClick={() => deleteForMe(m._id)}
                        >
                          Delete for Me
                        </button>

                        <button
                          className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                          onClick={() => deleteForEveryone(m._id)}
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

        {/* NEW MESSAGE PILL */}
        {hasNewMessages && (
          <button
            onClick={() => {
              setAutoScroll(true);
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[10px] text-[var(--text)] shadow-lg hover:bg-[var(--surface-alt)]"
          >
            New messages
            <ChevronDown size={12} />
          </button>
        )}
      </div>

      {/* INPUT BOX */}
      <ChatInput
        onSend={handleSend}
        onSendFile={handleSendFile}
        disabled={loading}
        onTyping={() => setIsTyping(true)}
        onStopTyping={() => setIsTyping(false)}
        replyTo={
          replyTo
            ? {
                id: replyTo._id,
                text: replyTo.text || replyTo.fileName || "",
                from: replyTo.from,
              }
            : null
        }
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}
