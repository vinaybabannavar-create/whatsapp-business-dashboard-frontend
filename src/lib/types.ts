// ----------------------------------------------------
// 🔹 Contact (WhatsApp Business Contact)
// ----------------------------------------------------
export interface Contact {
  id: string;
  name: string;
  phone_number: string;
  tags: string[];
  created_at: string;
}
// ----------------------------------------------------
// 🔹 Message (Chat Window Messages)
// ----------------------------------------------------
export interface Message {
  id: string;
  from: "business" | "customer";
  text: string;
  time: string;
  status: "sent" | "delivered" | "read"; // ✅ make status required
  media_url?: string | null;
}

// ----------------------------------------------------
// 🔹 Chat Summary (Left Panel Chat List)
// ----------------------------------------------------
export interface ChatSummary {
  phone_number: string;
  name: string;
  last_message: string;
  last_time: string;
  unread: number;
}

// ----------------------------------------------------
// 🔹 Message (Chat Window Messages)
// ----------------------------------------------------
export interface Message {
  id: string;
  from: "business" | "customer";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  media_url?: string | null;
}

// ----------------------------------------------------
// 🔹 Campaigns (Bulk Messaging)
// ----------------------------------------------------
export interface Campaign {
  id: string;
  name: string;
  status: "draft" | "running" | "completed";
  total_contacts: number;
  sent: number;
  delivered: number;
  read: number;
}

// ----------------------------------------------------
// 🔹 WhatsApp Templates
// ----------------------------------------------------
export interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  language: string;
}

// ----------------------------------------------------
// 🔹 Google Sheets
// ----------------------------------------------------
export interface Sheet {
  name: string;
}

// ----------------------------------------------------
// 🔹 Dashboard Stats
// ----------------------------------------------------
export interface DashboardStats {
  totalContacts: number;
  activeChats: number;
  campaigns: number;
  messagesToday: number;
}
