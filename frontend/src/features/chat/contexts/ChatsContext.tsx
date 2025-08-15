import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "@/lib/requests";
import type { Chat } from "../model/types";
import type { ReactNode } from "react";

interface ChatsContextProps {
  chats: Chat[];
  refetchChats: () => Promise<void>;
  refetchSingleChat: (chatId: number) => Promise<void>;
  selectChat: (chatId: number | null) => void;
  selectedChat: Chat | null;
}

const ChatsContext = createContext<ChatsContextProps | undefined>(undefined);

export const ChatsProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const selectChat = (chatId: number | null) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) setSelectedChat(chat);
  };

  const fetchSingleChat = async (chatId: number) => {
    try {
      const data = await authFetch.get<Chat>(`/chats/${chatId}`);
      setChats((prevChats) => {
        const updatedChats = prevChats.filter((chat) => chat.id !== chatId);
        return [data, ...updatedChats].sort(
          (chat1, chat2) =>
            new Date(chat2.updated_at).getTime() -
            new Date(chat1.updated_at).getTime()
        );
      });
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      throw error;
    }
  };

  const fetchChats = async () => {
    try {
      const data = await authFetch.get<Chat[]>("/chats/users");
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <ChatsContext.Provider
      value={{
        chats,
        refetchSingleChat: fetchSingleChat,
        refetchChats: fetchChats,
        selectChat: selectChat,
        selectedChat,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};

export const useChats = () => {
  const context = useContext(ChatsContext);
  if (!context) {
    throw new Error("useChats must be used within a ChatsProvider");
  }
  return context;
};
