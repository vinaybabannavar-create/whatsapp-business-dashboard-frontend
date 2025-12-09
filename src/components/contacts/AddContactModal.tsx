"use client";

import { useState } from "react";
import { useContactStore } from "@/store/useContactStore";
import { useChatStore } from "@/store/useChatStore";  // 👈 NEW IMPORT

export default function AddContactModal({ isOpen, onClose }: any) {
  const addContact = useContactStore((s) => s.addContact);
  const addChat = useChatStore((s) => s.addChat);      // 👈 NEW

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof name !== "string" || typeof phone !== "string") {
      alert("Invalid input");
      return;
    }

    const n = name.trim();
    const p = phone.trim();

    if (!n || !p) {
      alert("Please enter name and phone number.");
      return;
    }

    // ✅ Save to CONTACTS
    addContact(n, p);

    // ✅ Also save to CHATS list
    addChat({
      phone_number: p,
      name: n,
      last_message: "New contact added",
      last_time: "Just now",
      unread: 0,
    });

    // Close modal + reset input fields
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
          onChange={(e) => setName(String(e.target.value))}
        />

        <input
          className="w-full p-2 mb-4 rounded border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)]"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(String(e.target.value))}
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
