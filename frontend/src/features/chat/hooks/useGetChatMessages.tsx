import { authFetch } from "@/lib/requests";
import type { Message } from "../model/types";

export const useGetChatMessages = () => {
  const getChatsMessages = (chatId: number): Promise<Message[]> => {
    return authFetch.get("/chats/messages/" + chatId);
  };

  return { getChatsMessages };
};
