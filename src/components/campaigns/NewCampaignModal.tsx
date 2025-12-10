"use client";

import { useState } from "react";
import { apiCreateCampaign } from "@/lib/apiClient";
import { toast } from "sonner";

// ------------------------------
// 🔹 Props interface
// ------------------------------
interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewCampaignModal({ isOpen, onClose }: NewCampaignModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [audience, setAudience] = useState("all");
  const [schedule, setSchedule] = useState("");
  const [loading, setLoading] = useState(false);

  const createCampaign = async () => {
    if (!name.trim()) {
      toast.error("Campaign name required");
      return;
    }

    setLoading(true);

    try {
      const res = await apiCreateCampaign({
        name,
        audience,
        schedule: schedule || null,
      });

      toast.success("Campaign created!");
      onClose();
    } catch (err) {
      toast.error("Failed to create campaign");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>

        {/* Campaign Name */}
        <label className="text-sm font-medium">Campaign Name</label>
        <input
          className="w-full px-3 py-2 border rounded-md mt-1 mb-3"
          placeholder="Diwali Promo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Audience */}
        <label className="text-sm font-medium">Audience</label>
        <select
          className="w-full px-3 py-2 border rounded-md mt-1 mb-3"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        >
          <option value="all">All Contacts</option>
          <option value="new">New Customers</option>
          <option value="returning">Returning Customers</option>
          <option value="vip">VIP</option>
        </select>

        {/* Schedule */}
        <label className="text-sm font-medium">Schedule (optional)</label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 border rounded-md mt-1 mb-4"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={createCampaign}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
