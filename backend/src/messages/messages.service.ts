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

  createImageMessage(message: MessageEntity): Promise<Message> {
    if (message.type !== 'image') {
      throw new NotFoundException('Message type must be image');
    }
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

  async markAllMessagesAsRead(chatId: number, userId: number): Promise<void> {
    try {
      await this.messagesRepository.markAllMessagesAsRead(chatId, userId);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(
        `Error marking messages as read for chat ${chatId} and user ${userId}`,
      );
    }
  }
}
