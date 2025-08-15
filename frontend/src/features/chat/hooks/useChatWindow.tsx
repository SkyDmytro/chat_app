import { authFetch } from "@/lib/requests";
import { useSocketService } from "@/socket/context/SocketContext";
import { useState, useRef, useEffect } from "react";
import { useChats } from "../contexts/ChatsContext";
import type { Chat, Message } from "../model/types";

export const useChatWindow = (chat: Chat) => {
  const { socketService } = useSocketService();
  const { refetchSingleChat, refetchChats } = useChats();
  const [messages, setMessages] = useState(chat.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("     ChatWindow mounted with chat:", chat);
    setMessages(chat.messages);
  }, [chat.messages]);

  useEffect(() => {
    socketService.emit(
      "joinChat" as "message",
      JSON.stringify({ chatId: chat.id })
    );
    authFetch.post(`/chats/${chat.id}/mark-all-as-read`, {});
    refetchSingleChat(chat.id);

    return () => {
      socketService.emit(
        "leaveChat" as "message",
        JSON.stringify({ chatId: chat.id })
      );
      refetchChats();
    };
  }, [chat.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleNewMessage = (data: { content: Message }) => {
      if (data.content.chat_id !== chat.id) return;
      console.log(data);
      setMessages((prev = []) => {
        if (!prev.some((msg) => msg.id === data.content.id)) {
          return [...prev, data.content];
        }
        return prev;
      });
      scrollToBottom();
      refetchSingleChat(data.content.chat_id as number);
    };

    socketService.on("newMessage" as "message", handleNewMessage);
    return () => {
      socketService.off("newMessage" as "message");
    };
  }, [socketService]);

  return { messages, setMessages, scrollToBottom, messagesEndRef };
};
