"use client";

import ContactTable from "@/components/contacts/ContactTable";

export default function ContactsPage() {
  return (
    <div className="space-y-4">

      {/* Page Title */}
      <h2 className="text-lg font-semibold text-[var(--text)]">
        Contacts Management
      </h2>

      <p className="text-xs text-[var(--text-muted)]">
        View, search, and filter your WhatsApp Business contacts.
      </p>

      {/* Glass Wrapper Around Contacts Table */}
      <div
        className="
          bg-[var(--surface)]/60 
          backdrop-blur-xl 
          border border-[var(--border)] 
          rounded-xl 
          p-4 
          shadow-lg
        "
      >
        <ContactTable />
      </div>

    </div>
  );
}
