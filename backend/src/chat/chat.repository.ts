import { Chat } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IChatRepository } from './chat.repository.interface';
import { ChatEntity } from './entities/chat.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(chat: ChatEntity): Promise<Chat> {
    return this.prisma.chat.create({
      data: {
        name: chat.name,
        users: {
          connect: chat.users.map((user) => ({ id: user.id })),
        },
      },
      include: { users: true },
    });
  }

  async findByUserId(userId: number): Promise<Chat[]> {
    console.log('Finding chats for user:', userId);
    return this.prisma.chat.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
    });
  }

  async findById(chatId: number): Promise<Chat | null> {
    return this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        users: true,
        messages: { include: { sender: true }, orderBy: { created_at: 'asc' } },
      },
    });
  }
}
