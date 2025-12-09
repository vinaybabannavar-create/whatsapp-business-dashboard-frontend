"use client";

import { useAuthStore } from "@/store/useAuthStore";

export default function TemplatePreview({ template, onClose }) {
  const { name: userName } = useAuthStore();
  const actualName = userName || "User";

  // Highlight function
  const highlightName = (content: string) => {
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

  if (!template) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[var(--surface)] p-6 rounded-xl w-[400px] border border-[var(--border)] shadow-xl">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{template.name}</h2>
          <button 
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)] text-lg"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)] mb-3">
          Category: {template.category} • {template.language}
        </p>

        {/* Highlighted content */}
        <p className="text-sm whitespace-pre-line mb-4">
          {highlightName(template.content)}
        </p>

        <button
          className="
            w-full py-2 rounded-lg
            bg-[var(--primary)] text-white
            hover:bg-opacity-80 transition
          "
        >
          Send Test Message
        </button>
      </div>
    </div>
  );
}
