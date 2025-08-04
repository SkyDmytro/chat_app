import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar } from "@/shared/ui/avatar";
import { MessageItem } from "./MessageItem";
import type { Chat, Message } from "../model/types";
import { useSocketService } from "@/socket/context/SocketContext";
import { useAuthContext } from "@/features/auth/context/AuthContext";

interface ChatWindowProps {
  chat: Chat;
}

export function ChatWindow({ chat }: ChatWindowProps) {
  const { socketService } = useSocketService();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chat.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleNewMessage = (data: { content: Message }) => {
      console.log(data);
      setMessages((prev = []) => {
        if (!prev.some((msg) => msg.id === data.content.id)) {
          return [...prev, data.content];
        }
        return prev;
      });
      scrollToBottom();
    };

    socketService.on("newMessage", handleNewMessage);
    return () => {
      socketService.off("newMessage" as "message");
    };
  }, [socketService]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    socketService.emit(
      "sendMessage" as "message",
      JSON.stringify({
        chatId: chat.id,
        content: message,
      })
    );
    setMessage("");
  };

  if (!chat) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <Avatar />
          <h2 className="font-semibold text-white">{chat.name}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950 pb-16">
        {messages?.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isOwn={msg.sender.id === user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-80 right-0 p-4 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSendMessage} className="flex gap-2 max-w-full">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write message ..."
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
          />
          <Button type="submit" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
