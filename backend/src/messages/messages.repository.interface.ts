import { Message } from '@prisma/client';
import { MessageEntity } from './dto/message.entity';

export interface IMessagesRepository {
  create(message: MessageEntity): Promise<Message>;
  findByChatId(
    chatId: number,
    skip?: number,
    take?: number,
  ): Promise<Message[]>;
}
