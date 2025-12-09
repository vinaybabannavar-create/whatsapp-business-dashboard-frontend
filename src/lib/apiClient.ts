// src/lib/apiClient.ts

import type {
  Campaign,
  Contact,
  DashboardStats,
  Message,
  Template,
} from "./types";

const BASE_URL = "https://whatsapp-business-dashboard.onrender.com";



// ================================
// DELETE MESSAGE FOR ME
// ================================
export async function apiDeleteMessageForMe(phone: string, messageId: string) {
  const res = await fetch(`${API_URL}/chats/${phone}/messages/${messageId}/deleteForMe`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete message for me");
  }

  return res.json();
}

// ================================
// DELETE MESSAGE FOR EVERYONE
// ================================
export async function apiDeleteMessageForEveryone(phone: string, messageId: string) {
  const res = await fetch(`${API_URL}/chats/${phone}/messages/${messageId}/deleteForEveryone`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete message for everyone");
  }

  return res.json();
}

// ================================
// DELETE ENTIRE CHAT
// ================================
export async function apiDeleteChat(phone: string) {
  const res = await fetch(`${API_URL}/chats/${phone}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete chat");
  }

  return res.json();
}


/* ============================================================
   TAGS
   ============================================================ */
export async function apiTags(): Promise<string[]> {
  try {
    const contacts = await apiContacts();
    const set = new Set<string>();

    contacts.forEach((c) => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t) => set.add(t));
      }
    });

    return set.size ? Array.from(set) : ["New", "VIP", "Lead", "Returning"];
  } catch {
    return ["New", "VIP", "Lead", "Returning"];
  }
}

/* ============================================================
   TEMPLATES
   ============================================================ */
export async function apiCreateTemplate(payload: any) {
  const res = await fetch(`${API_BASE}/templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create template");
  return res.json();
}

export async function apiTemplates(): Promise<Template[]> {
  const res = await fetch(`${API_BASE}/templates`);
  if (!res.ok) throw new Error("Failed to load templates");
  return res.json();
}

/* ============================================================
   CONTACTS
   ============================================================ */
export async function apiContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_BASE}/contacts`);
  if (!res.ok) throw new Error("Failed to load contacts");
  return res.json();
}

export async function apiCreateContact(
  payload: Pick<Contact, "name" | "phone_number" | "tags">
): Promise<Contact> {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create contact");
  return res.json();
}

/* ============================================================
   CHAT HISTORY
   ============================================================ */
export async function apiChatHistory(
  phoneNumber: string
): Promise<Message[]> {
  console.log("➡️ GET CHAT HISTORY:", phoneNumber);

  const res = await fetch(`${API_BASE}/chats/${phoneNumber}/messages`);

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Chat history error:", err);
    throw new Error(`Failed to load chat history: ${err}`);
  }

  return res.json();
}

/* ============================================================
   SEND TEXT MESSAGE  (🔥 FIXED)
   ============================================================ */
export async function apiSendMessage(
  phoneNumber: string,
  text: string
): Promise<Message> {
  console.log("➡️ SENDING MESSAGE:", phoneNumber, text);

  const res = await fetch(`${API_BASE}/chats/${phoneNumber}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, from: "business" }),
  });

  if (!res.ok) {
    const errText = await res.text(); // read real backend reason
    console.error("❌ SERVER SEND ERROR:", errText);

    throw new Error(`Failed to send message: ${errText}`);
  }

  return res.json();
}

/* ============================================================
   SEND FILE MESSAGE
   ============================================================ */
export async function apiSendFile(
  phoneNumber: string,
  file: File
): Promise<Message> {
  const form = new FormData();
  form.append("phone", phoneNumber);
  form.append("file", file);

  const res = await fetch(`${API_BASE}/chats/upload-file`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ FILE UPLOAD ERROR:", err);
    throw new Error(`Failed to upload file: ${err}`);
  }

  return res.json();
}

/* ============================================================
   CAMPAIGNS
   ============================================================ */
export async function apiCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${API_BASE}/campaigns`);
  if (!res.ok) throw new Error("Failed to load campaigns");
  return res.json();
}

export async function apiCreateCampaign(
  payload: Omit<Campaign, "id" | "createdAt" | "updatedAt">
): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create campaign");
  return res.json();
}

/* ============================================================
   DASHBOARD ANALYTICS
   ============================================================ */

export type DashboardStatsResponse = {
  totalContacts: number;
  activeChats: number;
  campaigns: number;
  messagesToday: number;
  weeklyMessages?: { label: string; messages: number }[];
};

export async function apiDashboardStats(
  range: "Today" | "Week" | "Month" = "Today"
): Promise<DashboardStatsResponse> {
  console.log("📊 GET DASHBOARD STATS:", range);

  const res = await fetch(
    `${API_BASE}/analytics/dashboard?range=${range}`
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ DASHBOARD ERROR:", err);
    throw new Error(`Failed to load dashboard stats: ${err}`);
  }

  return res.json();
}
