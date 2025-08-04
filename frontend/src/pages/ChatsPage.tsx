import type { Chat } from "@/features/chat/model/types";
import { ChatSidebar } from "@/features/chat/ui/ChatSidebar";
import { ChatWindow } from "@/features/chat/ui/ChatWindow";
import { authFetch } from "@/lib/requests";
import { useSocketService } from "@/socket/context/SocketContext";
import { useEffect, useState } from "react";

export function ChatsPage() {
  const { socketService } = useSocketService();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  const getChats = async () => {
    return authFetch.get("/chats/users");
  };

  useEffect(() => {
    socketService.connect();

    getChats().then((data) => {
      const chats = data as Chat[];
      setChats(chats);
      if (chats.length > 0) {
        setSelectedChat(chats[0]);
      }
    });
  }, [socketService]);

  const onSelectChat = (chatId: number) => {
    const chat = chats.find((ch) => ch.id === chatId);
    if (chat) {
      setSelectedChat(chat);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <div className="w-80 border-r border-gray-800 flex-shrink-0">
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={onSelectChat}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? <ChatWindow chat={selectedChat} /> : <EmptyChat />}
      </div>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      Select a chat to start messaging
    </div>
  );
}
