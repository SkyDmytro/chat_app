import { cn } from "@/lib/utils";
import { Avatar } from "@/shared/ui/avatar";
import { type Chat } from "@/features/chat/model/types";

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50",
        isSelected && "bg-gray-800"
      )}
    >
      <div className="relative">
        <Avatar />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-white truncate">{chat.name}</h3>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {new Date(chat.updated_at).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400 truncate">
            {(chat.messages &&
              chat.messages.length > 0 &&
              chat?.messages.at(-1)?.content) ||
              "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
