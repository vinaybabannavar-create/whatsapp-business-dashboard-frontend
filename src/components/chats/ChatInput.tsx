"use client";

import { useState, useRef } from "react";
import { Paperclip, Mic, Send, X } from "lucide-react";

/* ---------------------------------------------
   Strong typing for props (no more `any`)
--------------------------------------------- */
interface ChatInputProps {
  onSend: (text: string) => void;
  onSendFile: (file: File) => void;
  disabled?: boolean;
  onTyping: () => void;
  onStopTyping: () => void;
  replyTo: { id: string; text: string; from: string } | null;
  onCancelReply: () => void;
}

export default function ChatInput({
  onSend,
  onSendFile,
  disabled,
  onTyping,
  onStopTyping,
  replyTo,
  onCancelReply,
}: ChatInputProps) {
  const [text, setText] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  /* SEND MESSAGE */
  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
    onStopTyping();
  };

  /* SEND ON ENTER KEY */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white p-3">

      {/* REPLY PREVIEW */}
      {replyTo && (
        <div className="mb-2 p-2 bg-gray-100 border-l-4 border-emerald-500 rounded">
          <div className="flex justify-between">
            <p className="text-xs font-semibold">
              Replying to: {replyTo.from === "business" ? "You" : "Customer"}
            </p>
            <button onClick={onCancelReply}>
              <X size={16} />
            </button>
          </div>
          <p className="text-xs opacity-70 truncate max-w-[250px]">
            {replyTo.text || "[media]"}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">

        {/* FILE UPLOAD BUTTON */}
        <button
          onClick={() => fileRef.current?.click()}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="file"
          ref={fileRef}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onSendFile(file);
            e.target.value = ""; // allow uploading same file again
          }}
        />

        {/* TEXT INPUT */}
        <input
          value={text}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            const value = e.target.value;
            setText(value);

            if (value.trim().length > 0) onTyping();
            else onStopTyping();
          }}
          placeholder="Message..."
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none"
        />

        {/* MIC BUTTON */}
        <button className="p-2 rounded-full hover:bg-gray-200 transition">
          <Mic size={20} />
        </button>

        {/* SEND BUTTON */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-sm transition ${
            text.trim()
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
