import { cn } from "@/lib/utils";
import type { Message } from "../model/types";

interface MessageItemProps {
  message: Message;
  isOwn?: boolean;
}

export function MessageItem({ message, isOwn = false }: MessageItemProps) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
          isOwn ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"
        )}
      >
        <p className="text-md font-bold">{message.sender.username}</p>
        <p className="text-sm">{message.content}</p>
        <p
          className={cn(
            "text-xs mt-1",
            isOwn ? "text-blue-100" : "text-gray-400"
          )}
        >
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
