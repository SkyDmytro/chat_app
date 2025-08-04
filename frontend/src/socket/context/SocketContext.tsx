import { createContext, useContext, useEffect, useState } from "react";
import { socketService } from "../services/socket.service";
import { session } from "@/features/auth/session";

const SocketContext = createContext<{
  socketService: typeof socketService;
  connected: boolean;
} | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const { getAuthToken } = session;
  const token = getAuthToken();

  useEffect(() => {
    socketService.connect();

    const socket = socketService.getSocket();
    if (!socket) return;

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socketService.disconnect();
    };
  }, [token]);

  if (!token) {
    return;
  }

  return (
    <SocketContext.Provider value={{ socketService, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketService = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocketService must be used within SocketProvider");
  return context;
};
