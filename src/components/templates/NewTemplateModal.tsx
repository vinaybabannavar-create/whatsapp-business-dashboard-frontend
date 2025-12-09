"use client";

import { useState } from "react";
import { MessageSquare, FileText, Tag } from "lucide-react";

export default function NewTemplateModal({ isOpen, onClose }: any) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim() || !content.trim()) {
      alert("Template name and message body are required.");
      return;
    }

    await fetch("http://localhost:5000/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        content,
        variables: [], // You can expand later
      }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="
        bg-[var(--surface)] p-6 rounded-xl w-[380px] 
        border border-[var(--border)] shadow-2xl 
        animate-fadeIn
      ">
        
        {/* TITLE */}
        <h2 className="text-xl font-semibold mb-5 text-[var(--text)] flex items-center gap-2">
          <FileText size={20} className="text-purple-500" />
          New Template
        </h2>

        {/* TEMPLATE NAME */}
        <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1">
          <Tag size={12} /> Template Name
        </label>
        <input
          className="
            w-full p-2 mt-1 mb-4 rounded-lg 
            border border-[var(--border)] 
            bg-[var(--surface-alt)] text-[var(--text)]
            focus:ring-[var(--primary)] focus:ring-1 focus:outline-none
          "
          placeholder="Eg: Welcome Message"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* CATEGORY */}
        <label className="text-xs font-semibold text-[var(--text-muted)]">Category</label>
        <select
          className="
            w-full p-2 mt-1 mb-4 rounded-lg 
            border border-[var(--border)] 
            bg-[var(--surface-alt)] text-[var(--text)]
            focus:ring-[var(--primary)] focus:ring-1 focus:outline-none
          "
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Marketing</option>
          <option>Utility</option>
          <option>OTP</option>
        </select>

        {/* MESSAGE BODY */}
        <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1">
          <MessageSquare size={12} /> Message Content
        </label>
        <textarea
          className="
            w-full p-3 mt-1 h-28 rounded-lg 
            border border-[var(--border)] 
            bg-[var(--surface-alt)] text-[var(--text)]
            resize-none focus:ring-[var(--primary)] 
            focus:ring-1 focus:outline-none
          "
          placeholder="Write WhatsApp message here... 
Use {{name}} or {{date}} as dynamic variables."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* LIVE PREVIEW */}
        <p className="text-xs font-semibold text-[var(--text-muted)] mt-4 mb-1">
          Preview
        </p>
        <div className="
          p-3 rounded-xl bg-white border border-[var(--border)] 
          shadow-sm text-sm text-gray-900 whitespace-pre-wrap
        ">
          {content || "Your message will appear here..."}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="
              px-4 py-2 rounded 
              bg-gradient-to-r from-indigo-500 to-purple-500 
              text-white font-semibold shadow-md hover:opacity-90
            "
            onClick={handleSave}
          >
            Save Template
          </button>
        </div>

      </div>
    </div>
  );
}
