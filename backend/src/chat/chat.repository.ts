import { Chat, Message, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IChatRepository } from './chat.repository.interface';
import { ChatEntity } from './entities/chat.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  private messageCountSelector = (
    userId: number,
  ): Prisma.ChatCountOutputTypeSelect => ({
    messages: {
      where: {
        read_at: null,
        sender_id: {
          not: userId,
        },
      },
    },
  });

  private messageSelector = (userId: number): Prisma.ChatInclude => ({
    users: {
      select: {
        id: true,
        username: true,
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
    _count: {
      select: this.messageCountSelector(userId),
    },
  });

  async create(chat: ChatEntity): Promise<Chat & { users: User[] }> {
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

  async findByUserId(
    userId: number,
  ): Promise<
    (Chat & { users: Pick<User, 'id'>[] } & { unreadMessages: number })[]
  > {
    const chats = await this.prisma.chat.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
      include: this.messageSelector(userId),
      orderBy: { updated_at: 'desc' },
    });

    return chats.map((chat) => ({
      ...chat,
      unreadMessages: (chat._count as { messages: number }).messages,
    }));
  }

  async findById(
    chatId: number,
    userId: number,
  ): Promise<
    | (Chat & {
        users: User[];
        messages: Message[];
        unreadMessages: number;
      })
    | null
  > {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: this.messageSelector(userId),
    });
    if (!chat) {
      return null;
    }
    const { _count, ...rest } = chat;
    return {
      ...rest,
      unreadMessages: (_count as { messages: number }).messages,
    };
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
