import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { MessageEntity } from './dto/message.entity';
import { IMessagesRepository } from './messages.repository.interface';

@Injectable()
export class MessagesRepository implements IMessagesRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(message: MessageEntity): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content: message.content,
        sender_id: message.senderId,
        chat_id: message.chatId,
        type: message.type || 'text',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  findByChatId(chatId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chat_id: chatId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }
}
