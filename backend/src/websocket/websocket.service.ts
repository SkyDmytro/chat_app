import { WsException } from '@nestjs/websockets';
import { UserWithoutPassword } from 'src/authentication/types/userWithoutPassword';
import { MessageEntity } from 'src/messages/dto/message.entity';
import { SendMessageDto, SendMessageDtoSchema } from './dto/sendMessage.dto';
import { Logger } from 'nestjs-pino';
import { ChatService } from 'src/chat/chat.service';
import { MessagesService } from 'src/messages/messages.service';
import { Server, Socket } from 'socket.io';
import { IWebsocketService } from './websocket.gateway.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebSocketService implements IWebsocketService {
  constructor(
    private readonly logger: Logger,
    private readonly messagesService: MessagesService,
    private readonly chatService: ChatService,
  ) {}

  parseAndValidateMessage(data: string, client: Socket): SendMessageDto {
    try {
      const raw: unknown = typeof data === 'string' ? JSON.parse(data) : data;
      return SendMessageDtoSchema.parse(raw);
    } catch (e) {
      this.logger.error('Invalid message data structure', e);
      client.emit('error', { message: 'Invalid message data structure' });
      throw new WsException('Invalid message data structure');
    }
  }

  getUserFromClient(client: Socket): UserWithoutPassword {
    const user = client['user'] as UserWithoutPassword;
    if (!user) {
      this.logger.error('No user found in socket context');
      throw new WsException('Unauthorized');
    }
    return user;
  }

  parseChatId(chatIdRaw: string | number, client: Socket): number {
    const chatId = Number(chatIdRaw);
    if (!chatIdRaw || isNaN(chatId)) {
      this.logger.error(`Invalid chatId: ${chatIdRaw}`);
      client.emit('error', { message: 'Invalid chat ID' });
      throw new WsException('Invalid chat ID');
    }
    return chatId;
  }

  async assertUserInChat(chatId: number, userId: number, client: Socket) {
    const isUserInChat = await this.chatService
      .isUserInChat(chatId, userId)
      .catch((err: Error) => {
        this.logger.error(
          `Failed to verify user in chat ${chatId}: ${err.message}`,
        );
        throw new WsException('Failed to verify chat membership');
      });
    console.log(isUserInChat);

    if (!isUserInChat) {
      this.logger.warn(`User ${userId} is not part of chat ${chatId}`);
      client.emit('error', { message: 'User is not part of this chat' });
      throw new WsException('User is not part of this chat');
    }
  }

  async createAndEmitMessage(
    chatId: number,
    parsedData: SendMessageDto,
    user: UserWithoutPassword,
    server: Server,
  ) {
    const messageEntity: MessageEntity = {
      chatId,
      content: parsedData.content,
      senderId: user.id,
      type: parsedData.type || 'text',
    };

    const message = await this.messagesService
      .createMessage(messageEntity)
      .catch((err: Error) => {
        this.logger.error(`Failed to create message: ${err.message}`);
        throw new WsException('Failed to send message');
      });

    server.to(`chat_${chatId}`).emit('newMessage', { content: message });
  }
}
