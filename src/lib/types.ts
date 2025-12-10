// ----------------------------------------------------
// 🔹 Contact (Consistent with backend + Zustand)
// ----------------------------------------------------
export interface Contact {
  id: string;                  // frontend ID (string)
  name: string;
  phone_number: string;        // MATCHES backend + UI
  tags: string[];
  created_at: string;          // MATCHES backend payload
}

// ----------------------------------------------------
// 🔹 Message (Clean, backend-compatible)
// ----------------------------------------------------
export interface Message {
  _id: string;
  id?: string;                 // fallback for frontend
  from: "business" | "customer";

  text?: string;
  media_url?: string | null;

  createdAt: string;
  time?: string;               // backend sometimes returns "time"

  status?: "sent" | "delivered" | "read";
}

// ----------------------------------------------------
// 🔹 Chat Summary (Left panel)
// ----------------------------------------------------
export interface ChatSummary {
  phone_number: string;
  name: string;
  last_message: string;
  last_time: string;
  unread: number;
}

// ----------------------------------------------------
// 🔹 Campaign
// ----------------------------------------------------
export interface Campaign {
  _id: string;
  name: string;
  template?: string;
  audience?: string;

  schedule?: string | null;
  status: "scheduled" | "sending" | "sent" | "completed" | "failed";

  stats?: {
    sent: number;
    delivered: number;
    failed: number;
    read: number;
  };

  createdAt?: string;
  updatedAt?: string;
}

// ----------------------------------------------------
// 🔹 Template
// ----------------------------------------------------
export interface Template {
  _id: string;
  name: string;
  category: string;
  content: string;
  language: string;
}

// ----------------------------------------------------
// 🔹 Sheets
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
