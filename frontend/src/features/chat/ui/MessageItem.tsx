import { cn, formatDate } from "@/lib/utils";
import type { Message } from "../model/types";

interface MessageItemProps {
  message: Message;
  isOwn?: boolean;
}

export function MessageItem({ message, isOwn = false }: MessageItemProps) {
  return (
    <div className={cn("flex mb-2", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md",
          isOwn
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-200 border border-gray-700"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-md font-bold">{message.sender.username}</span>
        </div>
        <p className="text-sm break-words whitespace-pre-line">
          {message.content}
        </p>
        <p
          className={cn(
            "text-xs mt-2 text-right",
            isOwn ? "text-blue-100" : "text-gray-400"
          )}
        >
          {formatDate(message.updated_at)}
        </p>
      </div>
    </div>
  );
}
