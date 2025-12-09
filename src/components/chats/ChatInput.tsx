"use client";

import { useState, useRef } from "react";
import { Paperclip, Mic, Send, X } from "lucide-react";

export default function ChatInput({
  onSend,
  onSendFile,
  disabled,
  onTyping,
  onStopTyping,
  replyTo,
  onCancelReply,
}: any) {
  const [text, setText] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
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

        {/* FILE UPLOAD */}
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
            if (!e.target.files?.length) return;
            onSendFile(e.target.files[0]);
          }}
        />

        {/* MESSAGE INPUT */}
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value) onTyping();
            else onStopTyping();
          }}
          placeholder="Message..."
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none"
        />

        {/* MIC (optional) */}
        <button className="p-2 rounded-full hover:bg-gray-200 transition">
          <Mic size={20} />
        </button>

        {/* SEND BUTTON (Modern GPT Style) */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className={`
            px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-sm
            transition
            ${
              text.trim()
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
