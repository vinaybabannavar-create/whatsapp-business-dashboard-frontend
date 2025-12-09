"use client";

import ChatList from "@/components/chats/ChatList";
import ChatWindow from "@/components/chats/ChatWindow";

export default function ChatsPage() {
  return (
    <div className="flex h-full">
      <ChatList />
      <ChatWindow />
    </div>
  );
}
