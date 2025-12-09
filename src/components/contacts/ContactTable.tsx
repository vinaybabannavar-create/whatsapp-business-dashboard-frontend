"use client";

import ContactDrawer from "./ContactDrawer";
import { Contact } from "@/lib/types";
import { useEffect, useState } from "react";
import ContactFilters from "./ContactFilters";
import { useContactStore } from "@/store/useContactStore";
import { Pencil, Trash2 } from "lucide-react";

export default function ContactTable() {
  const contacts = useContactStore((s) => s.contacts);
  const resetInvalidContacts = useContactStore((s) => s.resetInvalidContacts);
  const deleteContact = useContactStore((s) => s.deleteContact); // ⭐ ensure this exists in store

  const [filtered, setFiltered] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const getInitials = (name: any) => {
    if (!name || typeof name !== "string") return "U";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Reset invalid contacts on mount
  useEffect(() => {
    resetInvalidContacts();
  }, []);

  // When contacts change → update filtered list
  useEffect(() => {
    setFiltered(contacts);
  }, [contacts]);

  const handleSearch = (q: string) => {
    setFiltered(
      contacts.filter((c) =>
        c.name?.toLowerCase().includes(q.toLowerCase())
      )
    );
  };

  const handleTag = (tag: string) => {
    if (!tag) return setFiltered(contacts);
    setFiltered(contacts.filter((c) => c.tags.includes(tag)));
  };

  const tagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "vip":
        return "bg-yellow-400 text-black";
      case "lead":
        return "bg-blue-500 text-white";
      case "returning":
        return "bg-purple-500 text-white";
      case "new":
        return "bg-emerald-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <>
      {/* ⭐ CONTACT PANEL WRAPPER */}
      <div
        className="
          bg-[var(--surface)]/60
          backdrop-blur-xl
          border border-[var(--border)]
          rounded-2xl
          p-5 
          shadow-xl
          text-[var(--text)]
          transition-all
        "
      >
        <h3 className="text-sm font-semibold mb-4">Contacts</h3>

        <ContactFilters onSearch={handleSearch} onTagSelect={handleTag} />

        {filtered.length === 0 && (
          <p className="text-xs text-[var(--text-muted)]">No contacts found.</p>
        )}

        {/* CONTACT LIST */}
        {filtered.length > 0 && (
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="
                  flex items-center justify-between px-3 py-3 
                  rounded-xl cursor-pointer 
                  hover:bg-[var(--surface-alt)] hover:shadow-md
                  transition-all group
                "
              >
                {/* Left Section */}
                <div
                  className="flex items-center gap-3"
                  onClick={() => setSelectedContact(c)}
                >
                  {/* Avatar */}
                  <div
                    className="
                      h-11 w-11 rounded-xl 
                      bg-gradient-to-br from-purple-500 to-blue-600 
                      text-white flex items-center justify-center 
                      font-semibold shadow-md
                    "
                  >
                    {getInitials(c.name)}
                  </div>

                  {/* Name + Phone */}
                  <div>
                    <p className="text-sm font-medium">{c.name || "Unknown"}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {c.phone_number || "N/A"}
                    </p>

                    {/* Tag Badges */}
                    <div className="flex gap-1 mt-[2px]">
                      {c.tags?.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className={`text-[10px] px-2 py-[1px] rounded-full font-semibold ${tagColor(
                            tag
                          )}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section (Date + Actions) */}
                <div className="flex flex-col items-end">
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString()
                      : ""}
                  </p>

                  {/* ACTION BUTTONS - visible on hover */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all mt-1">
                    <button
                      onClick={() => setSelectedContact(c)}
                      className="
                        p-1 rounded-md bg-blue-500 text-white 
                        hover:bg-blue-600 transition text-[10px]
                      "
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      onClick={() => deleteContact(c.id)}
                      className="
                        p-1 rounded-md bg-red-500 text-white 
                        hover:bg-red-600 transition text-[10px]
                      "
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </>
  );
}
