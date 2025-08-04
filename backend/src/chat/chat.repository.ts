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
    return this.prisma.chat.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
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
  async isUserInChat(chatId: number, userId: number): Promise<boolean> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        users: {
          where: { id: userId },
          select: { id: true },
        },
      },
    });
    return chat ? chat?.users.length > 0 : false;
  }
}
