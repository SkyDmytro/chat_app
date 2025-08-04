import { Message } from '@prisma/client';
import { MessageEntity } from './dto/message.entity';

export interface IMessagesService {
  createMessage(message: MessageEntity): Promise<Message>;
  getMessagesByChatId(chatId: number): Promise<Message[]>;
}
