export interface Chat {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  users: { id: number }[];
  messages?: Message[];
  unreadMessages: number;
  _count: {
    messages: number;
  };
}

export interface Message {
  id: number;
  type?: "text" | "image";
  chat_id: number;
  sender: {
    id: number;
    username: string;
  };
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface ImageResponse {
  message: string;
  filePath: string;
}
