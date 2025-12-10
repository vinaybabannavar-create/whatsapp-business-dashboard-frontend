"use client";

import { useState } from "react";
import { useContactStore } from "@/store/useContactStore";

export default function AddContactModal({ isOpen, onClose }: any) {
  const addContact = useContactStore((s) => s.addContact);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter name and phone number.");
      return;
    }

    // ALWAYS save correct format → no more broken entries
    addContact(name.trim(), phone.trim());

    onClose();
    setName("");
    setPhone("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] p-6 rounded-xl w-80 border border-[var(--border)] shadow">

        <h2 className="text-lg font-semibold mb-4 text-[var(--text)]">
          Add New Contact
        </h2>

        <input
          className="w-full p-2 mb-3 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)]"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)]"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-500 text-white"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded bg-[var(--primary)] text-white"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
