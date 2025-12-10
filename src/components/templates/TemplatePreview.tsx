"use client";

import { useAuthStore } from "@/store/useAuthStore";
import type { Template } from "@/lib/types";
import { useEffect } from "react";

interface TemplatePreviewProps {
  template: Template | null;
  onClose: () => void;
}

export default function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
  const { name: userName } = useAuthStore();
  const actualName = userName || "User";

  // ---------- Close modal on ESC ----------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // ---------- Highlight function ----------
  const highlightName = (content: string | undefined | null) => {
    if (!content) return <span className="opacity-70">[No content]</span>;

    const parts = content.split("{{name}}");

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-emerald-400 font-semibold">
                {actualName}
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  // ---------- If no template selected ----------
  if (!template) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">

      <div className="
        bg-[var(--surface)]
        p-6 rounded-xl w-[400px]
        border border-[var(--border)]
        shadow-xl animate-scale-in
      ">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{template.name}</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)] text-lg"
          >
            ✕
          </button>
        </div>

        {/* META INFO */}
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Category: {template.category} • {template.language}
        </p>

        {/* CONTENT PREVIEW */}
        <p className="text-sm whitespace-pre-line mb-4">
          {highlightName(template.content)}
        </p>

        {/* BUTTON */}
        <button
          className="
            w-full py-2 rounded-lg
            bg-[var(--primary)] text-white
            hover:bg-opacity-80 transition
          "
          onClick={() => {
            console.log("Test message sent:", template.name);
            onClose();
          }}
        >
          Send Test Message
        </button>

      </div>
    </div>
  );
}
