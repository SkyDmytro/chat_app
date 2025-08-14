import { Chat, Message } from '@prisma/client';
import { CreateChatDto } from './dto/createChat.dto';
import { UserWithoutPassword } from 'src/authentication/types/userWithoutPassword';

export interface IChatService {
  create(createChat: CreateChatDto): Promise<Chat>;
  findByUserId(userId: number): Promise<Chat[]>;
  findById(chatId: number, userId: number): Promise<Chat | null>;
  getMessagesByChatId(
    chatId: number,
    user: UserWithoutPassword,
  ): Promise<Message[]>;
}
