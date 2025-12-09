// src/components/settings/ai/AISettings.tsx
"use client";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function AISettings() {
  const aiProvider = useSettingsStore((s) => s.aiProvider);
  const aiModel = useSettingsStore((s) => s.aiModel);
  const aiMode = useSettingsStore((s) => s.aiMode);
  const setAIProvider = useSettingsStore((s) => s.setAIProvider);
  const setAIModel = useSettingsStore((s) => s.setAIModel);
  const setAIMode = useSettingsStore((s) => s.setAIMode);

  const modelsForProvider = (p: string) => {
    if (p === "openai") return ["gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini"];
    if (p === "groq") return ["mixtral-8x7b-32768", "groq-1"];
    return ["local-llama-7b"];
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-[var(--text-muted)]">AI Provider</p>
        <select
          value={aiProvider}
          onChange={(e) => setAIProvider(e.target.value as any)}
          className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]"
        >
          <option value="openai">OpenAI</option>
          <option value="groq">Groq (free option)</option>
          <option value="local">Local (offline)</option>
        </select>
      </div>

      <div>
        <p className="text-xs text-[var(--text-muted)]">Model</p>
        <select
          value={aiModel}
          onChange={(e) => setAIModel(e.target.value)}
          className="w-full p-2 rounded border border-[var(--border)] bg-[var(--surface-alt)]"
        >
          {modelsForProvider(aiProvider).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs text-[var(--text-muted)]">Mode</p>
        <div className="flex gap-2 mt-2">
          {["creative", "professional", "ultra"].map((m) => (
            <button
              key={m}
              onClick={() => setAIMode(m as any)}
              className={`px-3 py-2 rounded-lg border ${aiMode === m ? "border-[var(--primary)]" : "border-[var(--border)]"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-[var(--text-muted)]">
        Tip: If you use OpenAI, set your API key at <code>process.env.OPENAI_API_KEY</code> on the server or use the Groq provider for a free alternative.
      </div>
    </div>
  );
}
