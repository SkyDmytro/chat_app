import { cn, formatDate } from "@/lib/utils";
import { Avatar } from "@/shared/ui/avatar";
import { type Chat } from "@/features/chat/model/types";

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
  const getLastMessage = (chat: Chat): string => {
    if (!chat.messages || chat.messages.length === 0) return "No messages yet";
    const lastMsg = chat.messages.at(-1);
    if (!lastMsg) return "No messages yet";
    if (lastMsg.type === "image") return "File";
    return lastMsg.content;
  };
  const lastMessage = getLastMessage(chat);
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50",
        isSelected && "bg-gray-800"
      )}
    >
      <div className="relative">
        <Avatar fallback={chat.name} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-white truncate">{chat.name}</h3>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatDate(chat.updated_at)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400 truncate">{lastMessage}</p>
        </div>
      </div>
    </div>
  );
}
