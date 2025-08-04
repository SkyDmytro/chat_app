import { Chat } from '@prisma/client';
import { ChatEntity } from './entities/chat.entity';

export const ChatsRepositorySymbol = Symbol('CHATS_REPOSITORY');

export interface IChatRepository {
  create(chat: ChatEntity): Promise<Chat>;
  findByUserId(userId: number): Promise<Chat[]>;
  findById(chatId: number): Promise<Chat | null>;
  isUserInChat(chatId: number, userId: number): Promise<boolean>;
}
