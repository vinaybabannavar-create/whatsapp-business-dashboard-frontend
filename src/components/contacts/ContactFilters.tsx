"use client";

import { useEffect, useState } from "react";
import { apiTags } from "@/lib/apiClient";
import { toast } from "sonner";

export default function ContactFilters({
  onSearch,
  onTagSelect,
}: {
  onSearch: (v: string) => void;
  onTagSelect: (tag: string) => void;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTags = async () => {
    try {
      const data = await apiTags();
      setTags(data);
    } catch (err) {
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <div className="flex gap-3 items-center mb-3">

      {/* Search Input - GLASS EFFECT */}
      <input
        placeholder="Search contacts..."
        className="
          bg-[var(--surface)]/50 
          backdrop-blur-md
          p-2 text-sm
          border border-[var(--border)]/60 
          rounded-lg w-44
          text-[var(--text)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none
          focus:ring-1 focus:ring-[var(--primary)]
          shadow-sm
          transition
        "
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* TAG FILTER - GLASS EFFECT */}
      <select
        className="
          bg-[var(--surface)]/50 
          backdrop-blur-md
          p-2 text-sm 
          border border-[var(--border)]/60
          rounded-lg text-[var(--text)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none
          focus:ring-1 focus:ring-[var(--primary)]
          shadow-sm
          transition
        "
        disabled={loading}
        onChange={(e) => onTagSelect(e.target.value)}
      >
        <option value="">All tags</option>

        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

    </div>
  );
}
