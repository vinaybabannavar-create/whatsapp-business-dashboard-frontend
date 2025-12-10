"use client";

import { useState } from "react";
import { Campaign } from "@/lib/types";
import { apiCreateCampaign } from "@/lib/apiClient";
import { toast } from "sonner";

interface CampaignDrawerProps {
  onClose: () => void;
  onCreated: (campaign: Campaign) => void;
}

export default function CampaignDrawer({ onClose, onCreated }: CampaignDrawerProps) {
  const [name, setName] = useState("");
  const [audience, setAudience] = useState("all");
  const [template, setTemplate] = useState("");
  const [schedule, setSchedule] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !template) {
      toast.error("Name and template are required");
      return;
    }

    setLoading(true);

    try {
      const res = await apiCreateCampaign({
        name,
        audience,
        template,
        schedule: schedule || null,
      });

      toast.success("Campaign created");
      onCreated(res);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create campaign");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full shadow-xl p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium">Campaign Name</label>
          <input
            className="w-full px-3 py-2 border rounded-md mt-1"
            placeholder="Enter campaign name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Audience */}
        <div className="mb-4">
          <label className="text-sm font-medium">Audience</label>
          <select
            className="w-full px-3 py-2 border rounded-md mt-1"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="all">All Contacts</option>
            <option value="new">New Customers</option>
            <option value="returning">Returning Customers</option>
            <option value="premium">Premium Customers</option>
          </select>
        </div>

        {/* Template */}
        <div className="mb-4">
          <label className="text-sm font-medium">Template</label>
          <input
            className="w-full px-3 py-2 border rounded-md mt-1"
            placeholder="Template name (example: welcome_offer)"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
        </div>

        {/* Schedule */}
        <div className="mb-4">
          <label className="text-sm font-medium">Schedule (Optional)</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-md mt-1"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}
