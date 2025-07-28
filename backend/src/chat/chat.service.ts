import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IChatService } from './chat.service.interface';
import { Chat } from '@prisma/client';
import { CreateChatDto } from './dto/createChat.dto';
import {
  ChatsRepositorySymbol,
  IChatRepository,
} from './chat.repository.interface';
import { UsersService } from 'src/users/users.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(ChatsRepositorySymbol)
    private readonly chatRepository: IChatRepository,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  async create(createChat: CreateChatDto): Promise<Chat> {
    let usersExist = true;
    for (const userId of createChat.users) {
      const user = await this.usersService.findById(userId);
      if (!user) {
        usersExist = false;
        break;
      }
    }

    if (!usersExist) {
      throw new BadRequestException('One or more users do not exist');
    }

    const chatEntity = {
      name: createChat.name,
      users: createChat.users.map((userId) => ({ id: userId })),
    };

    try {
      const chat = await this.chatRepository.create(chatEntity);

      return chat;
    } catch (error) {
      this.logger.error(error, {
        createChat,
      });
      throw new BadRequestException('Chat creation failed');
    }
  }

  findById(chatId: number): Promise<Chat | null> {
    try {
      return this.chatRepository.findById(chatId);
    } catch (error) {
      this.logger.error(error, {
        chatId,
      });
      throw new BadRequestException('Chat not found');
    }
  }

  findByUserId(userId: number): Promise<Chat[]> {
    try {
      return this.chatRepository.findByUserId(userId);
    } catch (error) {
      this.logger.error(error, {
        userId,
      });
      throw new BadRequestException('Chats not found');
    }
  }
}
