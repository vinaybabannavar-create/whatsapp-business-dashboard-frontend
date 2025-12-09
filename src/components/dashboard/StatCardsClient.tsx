"use client";

import { useContactStore } from "@/store/useContactStore";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, MessageCircle, BarChart3, Mail } from "lucide-react";

export default function StatCardsClient({ stats }: any) {
  const totalContacts = useContactStore((state) => state.contacts.length);

  return (
    <>
      <StatCard label="Total Contacts" value={totalContacts} icon={<Users />} />
      <StatCard label="Active Chats" value={stats.activeChats} icon={<MessageCircle />} />
      <StatCard label="Campaigns" value={stats.campaigns} icon={<BarChart3 />} />
      <StatCard label="Messages Today" value={stats.messagesToday} icon={<Mail />} />
    </>
  );
}
