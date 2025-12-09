<<<<<<< HEAD
"use client";

import { useState, useEffect } from "react";
import { useContactStore } from "@/store/useContactStore";

const TAG_OPTIONS = ["VIP", "Lead", "Returning", "New"];

export default function EditContactModal({ isOpen, contact, onClose }: any) {
  const editContact = useContactStore((s) => s.editContact);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Load contact data when modal opens
  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone_number);
      setTags(contact.tags || []);
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Name and phone are required.");
      return;
    }

    editContact({
      ...contact,
      name: name.trim(),
      phone_number: phone.trim(),
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-[var(--surface)] p-6 rounded-xl w-[330px] border border-[var(--border)] shadow-xl animate-fadeIn">

        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
          Edit Contact
        </h2>

        {/* Name */}
        <label className="text-xs text-[var(--text-muted)]">Name</label>
        <input
          className="w-full p-2 mb-3 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Phone */}
        <label className="text-xs text-[var(--text-muted)]">Phone Number</label>
        <input
          className="w-full p-2 mb-4 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)]"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Tag Selection */}
        <div className="mb-4">
          <p className="text-xs text-[var(--text-muted)] mb-1">Tags</p>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold transition
                  ${
                    tags.includes(t)
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                      : "bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-muted)]"
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
=======
"use client";

import { useState, useEffect } from "react";
import { useContactStore } from "@/store/useContactStore";

const TAG_OPTIONS = ["VIP", "Lead", "Returning", "New"];

export default function EditContactModal({ isOpen, contact, onClose }: any) {
  const editContact = useContactStore((s) => s.editContact);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Load contact data when modal opens
  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone_number);
      setTags(contact.tags || []);
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Name and phone are required.");
      return;
    }

    editContact({
      ...contact,
      name: name.trim(),
      phone_number: phone.trim(),
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-[var(--surface)] p-6 rounded-xl w-[330px] border border-[var(--border)] shadow-xl animate-fadeIn">

        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
          Edit Contact
        </h2>

        {/* Name */}
        <label className="text-xs text-[var(--text-muted)]">Name</label>
        <input
          className="w-full p-2 mb-3 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Phone */}
        <label className="text-xs text-[var(--text-muted)]">Phone Number</label>
        <input
          className="w-full p-2 mb-4 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)]"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Tag Selection */}
        <div className="mb-4">
          <p className="text-xs text-[var(--text-muted)] mb-1">Tags</p>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold transition
                  ${
                    tags.includes(t)
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                      : "bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-muted)]"
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
