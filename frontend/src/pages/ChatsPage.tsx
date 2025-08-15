import { useChats } from "@/features/chat/contexts/ChatsContext";
import type { Chat } from "@/features/chat/model/types";
import { ChatSidebar } from "@/features/chat/ui/ChatSidebar";
import { ChatWindow } from "@/features/chat/ui/ChatWindow";
import { useToast } from "@/shared/hooks/useToast";
import { useSocketService } from "@/socket/context/SocketContext";
import { useEffect, useState } from "react";

export function ChatsPage() {
  const { socketService } = useSocketService();
  const { chats, refetchSingleChat } = useChats();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const { showToast, ToastContainer } = useToast();
  console.log(chats);

  useEffect(() => {
    socketService.connect();

    socketService.on(
      "notification" as "message",
      (data: { type: string; content: string; chatId: number }) => {
        console.log("Notification received:", data);
        showToast({
          title: "Notification",
          message: data.type === "text" ? data.content : "File",
          variant: "default",
        });
        refetchSingleChat(data.chatId);
        console.log("notif", data);
      }
    );
  }, [socketService]);

  useEffect(() => {
    const updatedSelectedChat = chats.find((c) => c.id === selectedChat?.id);
    if (updatedSelectedChat) {
      setSelectedChat({ ...updatedSelectedChat });
    } else {
      setSelectedChat(null);
    }
  }, [chats]);

  const onSelectChat = (chatId: number) => {
    const chat = chats.find((ch) => ch.id === chatId);
    if (chat) {
      setSelectedChat({ ...chat });
    }
  };

  return (
    <>
      <ToastContainer />
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
    </>
  );
}

function EmptyChat() {
  const { ToastContainer } = useToast();
  return (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      Select a chat to start messaging
      <ToastContainer />
    </div>
  );
}
