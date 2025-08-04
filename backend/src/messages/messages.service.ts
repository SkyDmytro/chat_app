import { Injectable, NotFoundException } from '@nestjs/common';
import { IMessagesService } from './messages.service.interface';
import { Message } from '@prisma/client';
import { MessageEntity } from './dto/message.entity';
import { MessagesRepository } from './messages.repository';
import { Logger } from 'nestjs-pino';

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly logger: Logger,
  ) {}
  createMessage(message: MessageEntity): Promise<Message> {
    return this.messagesRepository.create(message);
  }

  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    try {
      return this.messagesRepository.findByChatId(chatId);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(
        `Error retrieving messages for chat ${chatId}`,
      );
    }
  }
}
