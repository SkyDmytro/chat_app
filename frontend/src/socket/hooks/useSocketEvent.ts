import { useEffect } from "react";
import { useSocketService } from "../context/SocketContext";

export const useSocketEvent = <T>(
  event: string,
  callback: (data: T) => void
) => {
  const { socketService: socket } = useSocketService();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on<T>(event as any, callback);
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.off(event as any);
    };
  }, [event, callback]);
};
