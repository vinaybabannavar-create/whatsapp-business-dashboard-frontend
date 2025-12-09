// src/lib/apiClient.ts

import type {
  Campaign,
  Contact,
  DashboardStats,
  Message,
  Template,
} from "./types";

<<<<<<< HEAD
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
export async function apiDeleteMessageForMe(
  phone: string,
  messageId: string
) {
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
=======
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
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
export async function apiTags(): Promise<string[]> {
  try {
    const contacts = await apiContacts();
    const set = new Set<string>();

    contacts.forEach((c) => {
<<<<<<< HEAD
      if (Array.isArray(c.tags)) c.tags.forEach((t) => set.add(t));
    });

    return set.size ? [...set] : ["New", "VIP", "Lead", "Returning"];
=======
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t) => set.add(t));
      }
    });

    return set.size ? Array.from(set) : ["New", "VIP", "Lead", "Returning"];
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
  } catch {
    return ["New", "VIP", "Lead", "Returning"];
  }
}

<<<<<<< HEAD
//
// 🔥 TEMPLATES
//
=======
/* ============================================================
   TEMPLATES
   ============================================================ */
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
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

<<<<<<< HEAD
//
// 🔥 CONTACTS
//
=======
/* ============================================================
   CONTACTS
   ============================================================ */
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
export async function apiContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_BASE}/contacts`);
  if (!res.ok) throw new Error("Failed to load contacts");
  return res.json();
}

export async function apiCreateContact(
  payload: Pick<Contact, "name" | "phone_number" | "tags">
<<<<<<< HEAD
) {
=======
): Promise<Contact> {
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create contact");
  return res.json();
}

<<<<<<< HEAD
//
// 🔥 CHAT HISTORY
//
export async function apiChatHistory(phone: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/chats/${phone}/messages`);

  if (!res.ok) {
    const err = await res.text();
=======
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
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
    throw new Error(`Failed to load chat history: ${err}`);
  }

  return res.json();
}

<<<<<<< HEAD
//
// 🔥 SEND TEXT MESSAGE
//
export async function apiSendMessage(
  phone: string,
  text: string
): Promise<Message> {
  const res = await fetch(`${API_BASE}/chats/${phone}/messages`, {
=======
/* ============================================================
   SEND TEXT MESSAGE  (🔥 FIXED)
   ============================================================ */
export async function apiSendMessage(
  phoneNumber: string,
  text: string
): Promise<Message> {
  console.log("➡️ SENDING MESSAGE:", phoneNumber, text);

  const res = await fetch(`${API_BASE}/chats/${phoneNumber}/messages`, {
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, from: "business" }),
  });

  if (!res.ok) {
<<<<<<< HEAD
    const err = await res.text();
    throw new Error(`Failed to send message: ${err}`);
=======
    const errText = await res.text(); // read real backend reason
    console.error("❌ SERVER SEND ERROR:", errText);

    throw new Error(`Failed to send message: ${errText}`);
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
  }

  return res.json();
}

<<<<<<< HEAD
//
// 🔥 SEND FILE MESSAGE
//
export async function apiSendFile(phone: string, file: File) {
  const form = new FormData();
  form.append("phone", phone);
=======
/* ============================================================
   SEND FILE MESSAGE
   ============================================================ */
export async function apiSendFile(
  phoneNumber: string,
  file: File
): Promise<Message> {
  const form = new FormData();
  form.append("phone", phoneNumber);
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
  form.append("file", file);

  const res = await fetch(`${API_BASE}/chats/upload-file`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
<<<<<<< HEAD
=======
    console.error("❌ FILE UPLOAD ERROR:", err);
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
    throw new Error(`Failed to upload file: ${err}`);
  }

  return res.json();
}

<<<<<<< HEAD
//
// 🔥 CAMPAIGNS
//
=======
/* ============================================================
   CAMPAIGNS
   ============================================================ */
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
export async function apiCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${API_BASE}/campaigns`);
  if (!res.ok) throw new Error("Failed to load campaigns");
  return res.json();
}

<<<<<<< HEAD
export async function apiCreateCampaign(payload: any) {
=======
export async function apiCreateCampaign(
  payload: Omit<Campaign, "id" | "createdAt" | "updatedAt">
): Promise<Campaign> {
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create campaign");
  return res.json();
}

<<<<<<< HEAD
//
// 🔥 DASHBOARD ANALYTICS
//
export async function apiDashboardStats(
  range: "Today" | "Week" | "Month" = "Today"
) {
  const res = await fetch(`${API_BASE}/analytics/dashboard?range=${range}`);

  if (!res.ok) {
    const err = await res.text();
=======
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
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
    throw new Error(`Failed to load dashboard stats: ${err}`);
  }

  return res.json();
}
