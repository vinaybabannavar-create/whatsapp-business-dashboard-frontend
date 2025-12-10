"use client";

import { useState } from "react";

export default function EditTemplateModal({ template, onClose }: any) {
  const [name, setName] = useState(template.name);
  const [category, setCategory] = useState(template.category);
  const [content, setContent] = useState(template.content); // ⭐ FIXED

  const handleSave = async () => {
    await fetch(`http://localhost:5000/api/templates/${template._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        content, // ⭐ FIXED
      }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] p-6 rounded-xl w-[360px] border border-[var(--border)] shadow-xl">

        <h2 className="text-lg font-semibold mb-4 text-[var(--text)]">Edit Template</h2>

        {/* NAME */}
        <input
          className="w-full p-2 mb-3 rounded border bg-[var(--surface-alt)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          className="w-full p-2 mb-3 rounded border bg-[var(--surface-alt)]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Marketing</option>
          <option>Utility</option>
          <option>OTP</option>
        </select>

        {/* CONTENT */}
        <textarea
          className="w-full p-2 h-24 rounded border bg-[var(--surface-alt)]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* SAVE */}
        <button
          onClick={handleSave}
          className="w-full mt-4 py-2 rounded bg-purple-500 text-white font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
