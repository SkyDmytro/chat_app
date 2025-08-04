import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IChatService } from './chat.service.interface';
import { Chat, Message } from '@prisma/client';
import { CreateChatDto } from './dto/createChat.dto';
import {
  ChatsRepositorySymbol,
  IChatRepository,
} from './chat.repository.interface';
import { UsersService } from 'src/users/users.service';
import { Logger } from 'nestjs-pino';
import { MessagesService } from 'src/messages/messages.service';
import { UserWithoutPassword } from 'src/authentication/types/userWithoutPassword';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(ChatsRepositorySymbol)
    private readonly chatRepository: IChatRepository,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    private readonly messagesService: MessagesService,
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

  async findById(
    chatId: number,
    user: UserWithoutPassword,
  ): Promise<Chat | null> {
    const isUserInChat = await this.chatRepository.isUserInChat(
      chatId,
      user.id,
    );

    if (!isUserInChat) {
      throw new BadRequestException('User is not part of this chat');
    }

    try {
      return this.chatRepository.findById(chatId);
    } catch (error) {
      this.logger.error(error, {
        chatId,
      });
      throw new NotFoundException('Chat not found');
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

  async getMessagesByChatId(
    chatId: number,
    user: UserWithoutPassword,
  ): Promise<Message[]> {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) {
      throw new BadRequestException('Chat not found');
    }

    const isUserInChat = await this.chatRepository.isUserInChat(
      chatId,
      user.id,
    );
    if (!isUserInChat) {
      throw new BadRequestException('User is not part of this chat');
    }

    try {
      return this.messagesService.getMessagesByChatId(chatId);
    } catch (error) {
      this.logger.error(error, {
        chatId,
      });
      throw new BadRequestException('Messages not found for this chat');
    }
  }

  async isUserInChat(chatId: number, userId: number): Promise<boolean> {
    return this.chatRepository.isUserInChat(chatId, userId);
  }
}
