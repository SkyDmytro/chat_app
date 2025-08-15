import { useChats } from "@/features/chat/contexts/ChatsContext";
import { useChatsPage } from "@/features/chat/hooks/useChatsPage";
import { ChatSidebar } from "@/features/chat/ui/ChatSidebar";
import { ChatWindow } from "@/features/chat/ui/ChatWindow";
import { useToast } from "@/shared/hooks/useToast";

export function ChatsPage() {
  const { chats, selectChat, selectedChat } = useChats();
  useChatsPage();
  const { ToastContainer } = useToast();

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-950 flex">
        <div className="w-80 border-r border-gray-800 flex-shrink-0">
          <ChatSidebar
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={selectChat}
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
