export interface Chat {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  users: { id: number }[];
  messages?: Message[];
}

export interface Message {
  id: number;
  chat_id: number;
  sender: {
    id: number;
    username: string;
  };
  content: string;
  created_at: Date;
  updated_at: Date;
}
