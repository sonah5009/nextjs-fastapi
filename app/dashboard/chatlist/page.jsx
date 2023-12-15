import ChatList from "@/components/dashboard/ChatList";
import React from "react";

const ChatListPage = () => {
  return (
    <div className="px-5 py-4">
      <div className="py-2 font-bold">Chats</div>
      <ChatList />
    </div>
  );
};

export default ChatListPage;
