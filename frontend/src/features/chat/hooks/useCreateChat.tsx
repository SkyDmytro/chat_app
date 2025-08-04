import { authFetch } from "@/lib/requests";

export const useCreateChat = () => {
  const createChat = (body: { name: string; users: number[] }) => {
    return authFetch.post("/chats", {
      ...body,
    });
  };
  return { createChat };
};
