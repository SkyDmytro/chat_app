import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ChatItem } from "./ChatItem";
import type { Chat } from "../model/types";
import { useNavigate } from "react-router";

interface ChatSidebarProps {
  selectedChat: Chat | null;
  onChatSelect: (chatId: number) => void;
  chats: Chat[];
}

export function ChatSidebar({
  chats,
  selectedChat,
  onChatSelect,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/users");
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">Chats</h1>
          <div className="flex gap-2">
            <Button
              onClick={handleRedirect}
              variant="ghost"
              size="default"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Create Chat
              <Plus className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => onChatSelect(chat.id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-400">Chats not found</div>
        )}
      </div>
    </div>
  );
}
