"use client";

import { useEffect, useState } from "react";
import { apiTemplates } from "@/lib/apiClient";
import TemplateCard from "./TemplateCard";
import NewTemplateModal from "./NewTemplateModal";
import AITemplateModal from "./AITemplateModal";

export default function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [openNewModal, setOpenNewModal] = useState(false);
  const [openAIModal, setOpenAIModal] = useState(false);

  const load = async () => {
    try {
      const data = await apiTemplates();
      setTemplates(data);
    } catch (err) {
      console.error("TEMPLATE LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = templates.filter((t: any) => {
    const searchMatch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.content || "").toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      categoryFilter === "All" || t.category === categoryFilter;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="space-y-4">

      {/* TOP CONTROLS */}
      <div className="flex items-center justify-between gap-4">

        {/* SEARCH */}
        <input
          className="px-3 py-2 border rounded-lg w-56 bg-[var(--surface-alt)] text-[var(--text)]"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CATEGORY FILTER */}
        <select
          className="px-3 py-2 border rounded-lg bg-[var(--surface-alt)] text-[var(--text)]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Marketing">Marketing</option>
          <option value="Utility">Utility</option>
          <option value="OTP">OTP</option>
        </select>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">

          {/* AI GENERATE BUTTON */}
          <button
            onClick={() => setOpenAIModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md"
          >
            🤖 AI Generate
          </button>

          {/* NEW TEMPLATE BUTTON */}
          <button
            onClick={() => setOpenNewModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
          >
            ➕ New Template
          </button>

        </div>
      </div>

      {/* TEMPLATE LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t: any) => (
          <TemplateCard key={t._id} template={t} onUpdated={load} />
        ))}

        {filtered.length === 0 && (
          <p className="text-[var(--text-muted)] text-sm mt-4">
            No templates found.
          </p>
        )}
      </div>

      {/* NEW TEMPLATE MODAL */}
      {openNewModal && (
        <NewTemplateModal
          isOpen={openNewModal}
          onClose={() => {
            setOpenNewModal(false);
            load();
          }}
        />
      )}

      {/* AI TEMPLATE GENERATOR MODAL */}
      {openAIModal && (
        <AITemplateModal
          isOpen={openAIModal}
          onClose={() => setOpenAIModal(false)}
          onSave={async (content: string) => {
            try {
              await fetch("http://localhost:5000/api/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: "AI Template",
                  category: "Marketing",
                  content,
                }),
              });

              load();
            } catch (err) {
              console.error("AI SAVE ERROR:", err);
            }
          }}
        />
      )}

    </div>
  );
}
