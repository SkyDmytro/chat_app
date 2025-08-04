import { Message } from '@prisma/client';

export class ChatEntity {
  name: string;
  users: { id: number }[];
  messages?: Message[];
}
