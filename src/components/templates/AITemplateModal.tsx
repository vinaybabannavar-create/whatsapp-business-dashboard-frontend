<<<<<<< HEAD
"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function AITemplateModal({ isOpen, onClose, onSave }: any) {
  const [industry, setIndustry] = useState("E-Commerce");
  const [tone, setTone] = useState("Friendly");
  const [details, setDetails] = useState("");

  const [mode, setMode] = useState("single"); // single | multi | rewrite

  const [generated, setGenerated] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setGenerated(null);

    try {
      const res = await fetch("/api/ai-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, tone, details, mode }),
      });

      const data = await res.json();
      console.log("AI RESPONSE:", data);

      if (!data.success) {
        alert("AI Error: " + data.error);
        setLoading(false);
        return;
      }

      setGenerated(data.output);
    } catch (err: any) {
      console.error("FETCH ERROR:", err);
      alert("Failed to reach AI server");
    }

    setLoading(false);
  };

  const handleSave = () => {
    if (mode === "multi") {
      onSave(generated[0]); // save first variant
    } else {
      onSave(generated);
    }
    onClose();
  };

  const renderMultiVariants = () => {
    if (!Array.isArray(generated)) {
      return (
        <div className="p-3 bg-red-500 text-white rounded-xl">
          AI did not return multiple versions. Try again.
        </div>
      );
    }

    return generated.map((msg: string, i: number) => (
      <div
        key={i}
        className="p-3 bg-green-500 text-white rounded-xl mb-2 whitespace-pre-wrap"
      >
        {msg}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] p-6 rounded-xl w-[480px] border border-[var(--border)] shadow-xl">

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4 flex gap-2">
          <Sparkles /> AI Template Generator
        </h2>

        {/* MODE SELECTOR */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("single")}
            className={`px-3 py-1 rounded-lg border ${
              mode === "single"
                ? "bg-purple-600 text-white"
                : "bg-[var(--surface-alt)]"
            }`}
          >
            Single
          </button>

          <button
            onClick={() => setMode("multi")}
            className={`px-3 py-1 rounded-lg border ${
              mode === "multi"
                ? "bg-green-600 text-white"
                : "bg-[var(--surface-alt)]"
            }`}
          >
            Multi (3 versions)
          </button>

          <button
            onClick={() => setMode("rewrite")}
            className={`px-3 py-1 rounded-lg border ${
              mode === "rewrite"
                ? "bg-blue-600 text-white"
                : "bg-[var(--surface-alt)]"
            }`}
          >
            Rewrite
          </button>
        </div>

        {/* FIELDS FOR SINGLE + MULTI MODE */}
        {mode !== "rewrite" && (
          <>
            <label className="text-xs">Industry</label>
            <select
              className="w-full p-2 mb-3 rounded bg-[var(--surface-alt)]"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option>E-Commerce</option>
              <option>Banking/Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Automobile</option>
              <option>SaaS / Software</option>
            </select>

            <label className="text-xs">Tone</label>
            <select
              className="w-full p-2 mb-3 rounded bg-[var(--surface-alt)]"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>Friendly</option>
              <option>Professional</option>
              <option>Promotional</option>
              <option>Urgent</option>
            </select>
          </>
        )}

        {/* DETAILS INPUT */}
        <label className="text-xs">{mode === "rewrite" ? "Rewrite this:" : "Describe:"}</label>
        <textarea
          className="w-full p-3 h-24 rounded bg-[var(--surface-alt)] mb-3"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={
            mode === "rewrite"
              ? "Paste your old message..."
              : "Example: Promote 20% discount on electronics..."
          }
        />

        {/* GENERATE BUTTON */}
        <button
          onClick={handleGenerate}
          className="w-full py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {/* PREVIEW AREA */}
        {generated && (
          <div className="mt-5">
            <p className="text-xs text-[var(--text-muted)] mb-2">Preview</p>

            {mode === "multi" ? renderMultiVariants() : (
              <div className="p-3 bg-green-500 text-white rounded-xl whitespace-pre-wrap">
                {generated}
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full mt-4 py-2 rounded bg-emerald-600 text-white font-semibold"
            >
              Use This Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
=======
"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function AITemplateModal({ isOpen, onClose, onSave }: any) {
  const [industry, setIndustry] = useState("E-Commerce");
  const [tone, setTone] = useState("Friendly");
  const [details, setDetails] = useState("");

  const [mode, setMode] = useState("single"); // single | multi | rewrite

  const [generated, setGenerated] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setGenerated(null);

    try {
      const res = await fetch("/api/ai-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, tone, details, mode }),
      });

      const data = await res.json();
      console.log("AI RESPONSE:", data);

      if (!data.success) {
        alert("AI Error: " + data.error);
        setLoading(false);
        return;
      }

      setGenerated(data.output);
    } catch (err: any) {
      console.error("FETCH ERROR:", err);
      alert("Failed to reach AI server");
    }

    setLoading(false);
  };

  const handleSave = () => {
    if (mode === "multi") {
      onSave(generated[0]); // save first variant
    } else {
      onSave(generated);
    }
    onClose();
  };

  const renderMultiVariants = () => {
    if (!Array.isArray(generated)) {
      return (
        <div className="p-3 bg-red-500 text-white rounded-xl">
          AI did not return multiple versions. Try again.
        </div>
      );
    }

    return generated.map((msg: string, i: number) => (
      <div
        key={i}
        className="p-3 bg-green-500 text-white rounded-xl mb-2 whitespace-pre-wrap"
      >
        {msg}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] p-6 rounded-xl w-[480px] border border-[var(--border)] shadow-xl">

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4 flex gap-2">
          <Sparkles /> AI Template Generator
        </h2>

        {/* MODE SELECTOR */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("single")}
            className={`px-3 py-1 rounded-lg border ${
              mode === "single"
                ? "bg-purple-600 text-white"
                : "bg-[var(--surface-alt)]"
            }`}
          >
            Single
          </button>

          <button
            onClick={() => setMode("multi")}
            className={`px-3 py-1 rounded-lg border ${
              mode === "multi"
                ? "bg-green-600 text-white"
                : "bg-[var(--surface-alt)]"
            }`}
          >
            Multi (3 versions)
          </button>

          <button
            onClick={() => setMode("rewrite")}
            className={`px-3 py-1 rounded-lg border ${
              mode === "rewrite"
                ? "bg-blue-600 text-white"
                : "bg-[var(--surface-alt)]"
            }`}
          >
            Rewrite
          </button>
        </div>

        {/* FIELDS FOR SINGLE + MULTI MODE */}
        {mode !== "rewrite" && (
          <>
            <label className="text-xs">Industry</label>
            <select
              className="w-full p-2 mb-3 rounded bg-[var(--surface-alt)]"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option>E-Commerce</option>
              <option>Banking/Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Automobile</option>
              <option>SaaS / Software</option>
            </select>

            <label className="text-xs">Tone</label>
            <select
              className="w-full p-2 mb-3 rounded bg-[var(--surface-alt)]"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>Friendly</option>
              <option>Professional</option>
              <option>Promotional</option>
              <option>Urgent</option>
            </select>
          </>
        )}

        {/* DETAILS INPUT */}
        <label className="text-xs">{mode === "rewrite" ? "Rewrite this:" : "Describe:"}</label>
        <textarea
          className="w-full p-3 h-24 rounded bg-[var(--surface-alt)] mb-3"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={
            mode === "rewrite"
              ? "Paste your old message..."
              : "Example: Promote 20% discount on electronics..."
          }
        />

        {/* GENERATE BUTTON */}
        <button
          onClick={handleGenerate}
          className="w-full py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {/* PREVIEW AREA */}
        {generated && (
          <div className="mt-5">
            <p className="text-xs text-[var(--text-muted)] mb-2">Preview</p>

            {mode === "multi" ? renderMultiVariants() : (
              <div className="p-3 bg-green-500 text-white rounded-xl whitespace-pre-wrap">
                {generated}
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full mt-4 py-2 rounded bg-emerald-600 text-white font-semibold"
            >
              Use This Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
