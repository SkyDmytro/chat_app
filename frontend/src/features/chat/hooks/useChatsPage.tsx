import { useSocketService } from "@/socket/context/SocketContext";
import { useEffect } from "react";
import { useChats } from "../contexts/ChatsContext";
import { useToast } from "@/shared/hooks/useToast";

export const useChatsPage = () => {
  const { socketService } = useSocketService();
  const { showToast } = useToast();
  const { refetchSingleChat } = useChats();

  useEffect(() => {
    socketService.connect();

    socketService.on(
      "notification" as "message",
      (data: { type: string; content: string; chatId: number }) => {
        console.log("Notification received:", data);
        showToast({
          title: "Notification",
          message: data.type === "text" ? data.content : "File",
          variant: "default",
        });
        refetchSingleChat(data.chatId);
        console.log("notif", data);
      }
    );
  }, [socketService]);

  return {};
};
