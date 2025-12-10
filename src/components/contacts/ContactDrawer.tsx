"use client";

import { Button } from "@/components/ui/button";
import {
  Phone,
  MessageCircle,
  Pencil,
  Trash2,
  NotebookPen,
} from "lucide-react";
import { useContactStore } from "@/store/useContactStore";
import { useChatStore } from "@/store/useChatStore";
import EditContactModal from "./EditContactModal";
import { useState } from "react";

export default function ContactDrawer({ contact, onClose }: any) {
  const deleteContact = useContactStore((s) => s.deleteContact);
  const deleteChatByPhone = useChatStore((s) => s.deleteChatByPhone);
  const [showEdit, setShowEdit] = useState(false);
  const [notes, setNotes] = useState(contact?.notes || "");

  if (!contact) return null;

  const getInitials = (name: string) => {
    if (!name) return "U";
    const p = name.trim().split(" ");
    return p.length === 1
      ? p[0][0]?.toUpperCase()
      : (p[0][0] + p[1][0]).toUpperCase();
  };

  const phone = contact.phone_number || "N/A";
  const tags = Array.isArray(contact.tags) ? contact.tags : ["N/A"];

  const tagColor = (tag: string) =>
    tag.toLowerCase() === "vip"
      ? "bg-yellow-400 text-black"
      : tag.toLowerCase() === "lead"
      ? "bg-blue-500 text-white"
      : tag.toLowerCase() === "returning"
      ? "bg-purple-500 text-white"
      : "bg-emerald-500 text-white";

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[900] flex justify-end">
      <div className="w-80 h-full bg-[var(--surface)] shadow-2xl border-l border-[var(--border)] animate-slideLeft p-6 flex flex-col">

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-[var(--text)] text-sm">Contact Details</h2>
          <button
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="relative mb-6">
          <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"></div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {getInitials(contact.name)}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center mb-4">
          <p className="text-lg font-bold text-[var(--text)]">{contact.name}</p>
          <p className="text-xs text-[var(--text-muted)]">{phone}</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button className="p-2 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--surface)] shadow">
            <Phone size={18} className="text-green-500" />
          </button>

          <button className="p-2 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--surface)] shadow">
            <MessageCircle size={18} className="text-blue-500" />
          </button>

          <button className="p-2 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--surface)] shadow">
            <NotebookPen size={18} className="text-emerald-500" />
          </button>
        </div>

        <div className="mb-6">
          <p className="uppercase text-[10px] font-semibold text-[var(--text-muted)]">Tags</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {tags.map((t: string, i: number) => (
              <span key={i} className={`px-3 py-1 rounded-full text-[10px] font-semibold ${tagColor(t)}`}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="uppercase text-[10px] font-semibold text-[var(--text-muted)]">Created</p>
          <p className="mt-1 text-sm text-[var(--text)]">{contact.created_at}</p>
        </div>

        <div className="mb-6">
          <p className="uppercase text-[10px] font-semibold text-[var(--text-muted)]">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mt-2 p-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text)] resize-none h-20 focus:ring-1"
          />
        </div>

        <div className="border-t border-[var(--border)] my-4"></div>

        <div className="mt-auto flex flex-col gap-3">

          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md hover:shadow-lg flex items-center gap-2"
            onClick={() => setShowEdit(true)}
          >
            <Pencil size={15} /> Edit Contact
          </Button>

          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 font-semibold bg-white hover:bg-red-500 hover:text-white"
            onClick={async () => {
              deleteContact(contact.id);
              deleteChatByPhone(contact.phone_number);

              await fetch(`http://localhost:5000/api/chats/${contact.phone_number}`, {
                method: "DELETE",
              });

              onClose();
            }}
          >
            <Trash2 size={16} /> Delete Contact
          </button>
        </div>
      </div>

      {showEdit && (
        <EditContactModal
          isOpen={showEdit}
          contact={contact}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
