"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewCampaignModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [template, setTemplate] = useState("");
  const [audience, setAudience] = useState("");
  const [schedule, setSchedule] = useState("");

  const handleCreate = async () => {
    if (!name.trim() || !template.trim() || !audience.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    const payload = {
      name,
      template,
      audience,
      schedule: schedule || null,
      status: "scheduled",
    };

    try {
      const res = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Campaign created successfully!");

      // Reset fields
      setName("");
      setTemplate("");
      setAudience("");
      setSchedule("");

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-xl border border-[var(--border)] p-6 animate-fadeIn">

        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
          Create New Campaign
        </h2>

        {/* Campaign Name */}
        <label className="text-xs text-[var(--text-muted)]">Campaign Name</label>
        <input
          className="w-full p-2 mb-3 bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg text-sm"
          placeholder="Diwali Offer"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Message Template */}
        <label className="text-xs text-[var(--text-muted)]">Message Template</label>
        <select
          className="w-full p-2 mb-3 bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg text-sm"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="">Select Template</option>
          <option value="welcome">Welcome Template</option>
          <option value="discount">Discount Offer</option>
          <option value="reminder">Reminder Message</option>
        </select>

        {/* Audience */}
        <label className="text-xs text-[var(--text-muted)]">Audience</label>
        <select
          className="w-full p-2 mb-3 bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg text-sm"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        >
          <option value="">Select Audience</option>
          <option value="vip">VIP Customers</option>
          <option value="new">New Users</option>
          <option value="returning">Returning Customers</option>
        </select>

        {/* Schedule */}
        <label className="text-xs text-[var(--text-muted)]">Schedule (Optional)</label>
        <input
          type="datetime-local"
          className="w-full p-2 mb-4 bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg text-sm"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-[var(--text)] hover:opacity-80"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-opacity-80"
          >
            Create Campaign
          </button>
        </div>

      </div>
    </div>
  );
}
