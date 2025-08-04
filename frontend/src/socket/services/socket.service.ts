import { session } from "@/features/auth/session";
import { WS_URL } from "@/lib/config";
import { io, Socket } from "socket.io-client";

type ServerToClientEvents = {
  message: (msg: string) => void;
};

type ClientToServerEvents = {
  message: (msg: string) => void;
};

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private URL = WS_URL || "http://localhost:3001";
  connect() {
    const token = session.getAuthToken();
    if (this.socket) return;

    this.socket = io(this.URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: false,
    });

    this.socket.connect();

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  on<T>(event: string, callback: (data: T) => void) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket?.on(event, callback as any);
  }

  off(event: keyof ServerToClientEvents) {
    this.socket?.off(event);
  }

  emit(event: keyof ClientToServerEvents, data: string) {
    this.socket?.emit(event, data);
  }

  isConnected() {
    return !!this.socket?.connected;
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
