import { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar } from "@/shared/ui/avatar";
import { MessageItem } from "./MessageItem";
import type { Chat, ImageResponse, Message } from "../model/types";
import { useSocketService } from "@/socket/context/SocketContext";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import "./chat-window.style.css";
import { ImageMessage } from "./ImageMessage";
import { IMAGES_URL } from "@/lib/config";
import { UploadPhotoModal } from "@/shared/uploadPhotoModal/UploadPhotoModal";
import { useUploadImage } from "../hooks/useUploadImage";
import { useChats } from "../contexts/ChatsContext";
import { authFetch } from "@/lib/requests";

interface ChatWindowProps {
  chat: Chat;
}

export function ChatWindow({ chat }: ChatWindowProps) {
  console.log(chat);
  const { socketService } = useSocketService();
  const { uploadImage } = useUploadImage();
  const [message, setMessage] = useState("");
  const { refetchSingleChat, refetchChats } = useChats();
  const [messages, setMessages] = useState(chat.messages);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();

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

  const handleSendPhotoMessage = (file: File) => {
    uploadImage(file)
      .then((response: ImageResponse) => {
        socketService.emit(
          "sendMessage" as "message",
          JSON.stringify({
            chatId: chat.id,
            content: response.filePath,
            type: "image",
          })
        );
        handleCloseImageModal();
        refetchSingleChat(chat.id);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

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
    refetchSingleChat(chat.id);
  };

  const handleOpenImageModal = () => setIsImageModalOpen(true);
  const handleCloseImageModal = () => setIsImageModalOpen(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      authFetch.post(`/chats/${chat.id}/mark-all-as-read`, {});
      refetchSingleChat(chat.id);
    }
  };
  if (!chat) return null;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <Avatar fallback={chat.name} />
          <h2 className="font-semibold text-white">{chat.name}</h2>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950 pb-16 custom-scrollbar"
        onScroll={handleScroll}
      >
        {messages?.map((msg) => {
          if (msg.type === "image") {
            return (
              <ImageMessage
                isOwn={msg.sender.id === user?.id}
                src={`${IMAGES_URL}/${msg.content}`}
              />
            );
          }
          return (
            <MessageItem
              key={msg.id}
              message={msg}
              isOwn={msg.sender.id === user?.id}
            />
          );
        })}
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
          <Button
            type="button"
            onClick={handleOpenImageModal}
            className="bg-gray-800 border-gray-700 text-white"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {isImageModalOpen && (
          <UploadPhotoModal
            onClose={handleCloseImageModal}
            onUpload={handleSendPhotoMessage}
          />
        )}
      </div>
    </div>
  );
}
