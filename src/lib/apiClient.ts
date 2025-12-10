// src/lib/apiClient.ts

import type {
  Campaign,
  Contact,
  DashboardStats,
  Message,
  Template,
} from "./types";

// =====================================
// BASE URL (your deployed backend)
// =====================================
const API_BASE = "https://whatsapp-business-dashboard.onrender.com/api";

//
// 🔥 AUTH
//
export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

//
// 🔥 DELETE MESSAGE FOR ME
//
export async function apiDeleteMessageForMe(phone: string, messageId: string) {
  const res = await fetch(
    `${API_BASE}/chats/${phone}/messages/${messageId}/deleteForMe`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to delete message for me");
  return res.json();
}

//
// 🔥 DELETE MESSAGE FOR EVERYONE
//
export async function apiDeleteMessageForEveryone(
  phone: string,
  messageId: string
) {
  const res = await fetch(
    `${API_BASE}/chats/${phone}/messages/${messageId}/deleteForEveryone`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to delete message for everyone");
  return res.json();
}

//
// 🔥 DELETE CHAT
//
export async function apiDeleteChat(phone: string) {
  const res = await fetch(`${API_BASE}/chats/${phone}`, { method: "DELETE" });

  if (!res.ok) throw new Error("Failed to delete chat");
  return res.json();
}

//
// 🔥 CONTACT TAGS
//
export async function apiTags(): Promise<string[]> {
  try {
    const contacts = await apiContacts();
    const set = new Set<string>();

    contacts.forEach((c) => {
      if (Array.isArray(c.tags)) c.tags.forEach((t) => set.add(t));
    });

    return set.size ? [...set] : ["New", "VIP", "Lead", "Returning"];
  } catch {
    return ["New", "VIP", "Lead", "Returning"];
  }
}

//
// 🔥 TEMPLATES
//
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

//
// 🔥 CONTACTS
//
export async function apiContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_BASE}/contacts`);
  if (!res.ok) throw new Error("Failed to load contacts");
  return res.json();
}

export async function apiCreateContact(
  payload: Pick<Contact, "name" | "phone_number" | "tags">
) {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create contact");
  return res.json();
}

//
// 🔥 CHAT HISTORY
//
export async function apiChatHistory(phone: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/chats/${phone}/messages`);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to load chat history: ${err}`);
  }

  return res.json();
}

//
// 🔥 SEND TEXT MESSAGE
//
export async function apiSendMessage(
  phone: string,
  text: string
): Promise<Message> {
  const res = await fetch(`${API_BASE}/chats/${phone}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, from: "business" }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to send message: ${err}`);
  }

  return res.json();
}

//
// 🔥 SEND FILE MESSAGE
//
export async function apiSendFile(phone: string, file: File) {
  const form = new FormData();
  form.append("phone", phone);
  form.append("file", file);

  const res = await fetch(`${API_BASE}/chats/upload-file`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upload file: ${err}`);
  }

  return res.json();
}

//
// 🔥 CAMPAIGNS
//
export async function apiCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${API_BASE}/campaigns`);
  if (!res.ok) throw new Error("Failed to load campaigns");
  return res.json();
}

export async function apiCreateCampaign(payload: any) {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create campaign");
  return res.json();
}

//
// 🔥 DASHBOARD ANALYTICS
//
export async function apiDashboardStats(
  range: "Today" | "Week" | "Month" = "Today"
) {
  const res = await fetch(`${API_BASE}/analytics/dashboard?range=${range}`);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to load dashboard stats: ${err}`);
  }

  return res.json();
}
