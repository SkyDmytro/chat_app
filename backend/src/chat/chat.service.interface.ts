import { Chat } from '@prisma/client';
import { CreateChatDto } from './dto/createChat.dto';

export interface IChatService {
  create(createChat: CreateChatDto): Promise<Chat>;
  findByUserId(userId: number): Promise<Chat[]>;
  findById(chatId: number): Promise<Chat | null>;
}
