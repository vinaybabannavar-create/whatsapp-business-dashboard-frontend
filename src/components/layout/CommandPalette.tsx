"use client";

import { useEffect, useState } from "react";
import { Search, X, Users, Megaphone, FileText, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiContacts, apiCampaigns, apiTemplates } from "@/lib/apiClient";
import { useChatStore } from "@/store/useChatStore";
import type { Contact, Campaign, Template } from "@/lib/types";

type ItemType = "contact" | "campaign" | "template";

interface SearchItem {
  id: string;
  label: string;
  subtitle?: string;
  type: ItemType;
  phoneNumber?: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [items, setItems] = useState<SearchItem[]>([]);

  const router = useRouter();
  const { setSelectedChat } = useChatStore();

  // ---------- CTRL+K Shortcut ----------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ---------- Load Data When Open ----------
  useEffect(() => {
    if (!open) return;

    async function loadData() {
      try {
        setLoading(true);

        const [c, ca, t] = await Promise.all([
          apiContacts(),
          apiCampaigns(),
          apiTemplates(),
        ]);

        setContacts(c);
        setCampaigns(ca);
        setTemplates(t);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [open]);

  // ---------- Filter Items ----------
  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      return;
    }

    const q = query.toLowerCase();

    // CONTACTS
    const contactItems = contacts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone_number.includes(query)
      )
      .map<SearchItem>((c) => ({
        id: `contact-${c.id}`,
        label: c.name,
        subtitle: c.phone_number,
        type: "contact",
        phoneNumber: c.phone_number,
      }));

    // CAMPAIGNS
    const campaignItems = campaigns
      .filter((c) => c.name.toLowerCase().includes(q))
      .map<SearchItem>((c) => ({
        id: `campaign-${c._id}`,
        label: c.name,
        subtitle: `${c.status.toUpperCase()} • ${c.stats?.sent ?? 0} sent`,
        type: "campaign",
      }));

    // TEMPLATES
    const templateItems = templates
      .filter((t) => t.name.toLowerCase().includes(q))
      .map<SearchItem>((t) => ({
        id: `template-${t._id}`,
        label: t.name,
        subtitle: `${t.category} • ${t.language}`,
        type: "template",
      }));

    setItems([...contactItems, ...campaignItems, ...templateItems]);
  }, [query, contacts, campaigns, templates]);

  // ---------- Select Result ----------
  const handleSelect = (item: SearchItem) => {
    if (item.type === "contact" && item.phoneNumber) {
      setSelectedChat(item.phoneNumber, item.label);
      router.push("/chats");
    } else if (item.type === "campaign") {
      router.push("/campaigns");
    } else if (item.type === "template") {
      router.push("/templates");
    }

    setOpen(false);
    setQuery("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm">
      <div className="mt-24 w-full max-w-xl rounded-2xl bg-[var(--surface)] shadow-xl border border-[var(--border)]">

        {/* Search bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
          <Search size={16} className="text-[var(--text-muted)]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts, campaigns, templates..."
            className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none"
          />
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-[var(--bg)] rounded-md">
            <X size={17} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {loading && <p className="text-xs text-[var(--text-muted)] px-4 py-2">Loading data…</p>}

          {!loading && query && items.length === 0 && (
            <p className="text-xs text-[var(--text-muted)] px-4 py-2">
              No results found for <b>{query}</b>
            </p>
          )}

          {!loading &&
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-[var(--bg)] transition"
              >
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-700 text-white">
                  {item.type === "contact" && <Users size={14} />}
                  {item.type === "campaign" && <Megaphone size={14} />}
                  {item.type === "template" && <FileText size={14} />}
                </div>

                <div className="flex-1">
                  <p className="text-sm text-[var(--text)]">{item.label}</p>
                  {item.subtitle && (
                    <p className="text-[11px] text-[var(--text-muted)]">{item.subtitle}</p>
                  )}
                </div>

                {item.type === "contact" && (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                    <MessageCircle size={12} /> Open chat
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
