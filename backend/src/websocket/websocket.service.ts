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
import { jwtConstants } from 'src/authentication/constants';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  email: string;
  sub: number;
}
@Injectable()
export class WebSocketService implements IWebsocketService {
  private userSocketMap = new Map<number, string>();

  constructor(
    private readonly logger: Logger,
    private readonly messagesService: MessagesService,
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
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

  async notifyUser(
    chatId: number,
    senderId: number,
    message: string,
    server: Server,
  ) {
    const chat = await this.chatService.findById(chatId, senderId);
    const users = chat?.users || [];
    const userToNotify = users.find((u) => u.id !== senderId);

    if (!userToNotify) {
      this.logger.warn(
        `Failed to notify user ${userToNotify}: no other users in chat`,
      );
      return;
    }

    const targetSocket = server.sockets.sockets.get(`user_${userToNotify.id}`);

    if (!targetSocket) {
      this.logger.warn(`User ${userToNotify.id} is not connected`);
      return;
    }

    targetSocket.emit('notification', { chatId, message });
    this.logger.log(`Notification sent to user ${userToNotify.id}`);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;
      if (!token) {
        this.logger.error('No token provided for WebSocket connection');
        client.emit('error', { message: 'No token provided' });
        throw new WsException('No token provided');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload: JwtPayload = await this.jwtService
        .verifyAsync<JwtPayload>(token, {
          secret: jwtConstants.secret,
        })
        .catch((err: Error) => {
          this.logger.error(`Invalid token: ${err.message}`);
          client.emit('error', { message: 'Invalid token' });
          throw new WsException('Invalid token');
        });

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        this.logger.error(`User not found for email: ${payload.email}`);
        client.emit('error', { message: 'User not found' });
        throw new WsException('User not found');
      }

      client['user'] = user;

      // Map userId to socketId
      this.userSocketMap.set(user.id, client.id);
      await client.join(`user_${user.id}`);
      this.logger.log(`User ${user.email} connected to WebSocket`, client.id);
    } catch (error) {
      this.handleWsError(error, client);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client['user'] as UserWithoutPassword | undefined;
    if (user) {
      // Remove userId -> socketId mapping
      this.userSocketMap.delete(user.id);
      this.logger.log(`User ${user.email} disconnected`);
    }
  }

  notifyUserDirectly(
    userId: number,
    message: {
      chatId: number;
      content: string;
      type: 'text' | 'image';
    },
    server: Server,
  ) {
    const socketId = this.userSocketMap.get(userId);
    this.logger.log(
      `Notifying user ${userId} with message:  ${message.content} and socket ID: ${socketId}`,
    );

    if (!socketId) {
      this.logger.warn(`User ${userId} is not connected`);
      return;
    }

    const targetSocket = server.sockets.sockets.get(socketId);

    if (!targetSocket) {
      this.logger.warn(`Socket for user ${userId} not found`);
      return;
    }

    targetSocket.emit('notification', message);
    this.logger.log(`Notification sent to user ${userId}`);
  }

  private handleWsError(error: unknown, client: Socket) {
    let errorMessage: string;
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    ) {
      errorMessage = (error as { message: string }).message;
    } else {
      errorMessage = 'Unknown error';
    }
    this.logger.error(`Message handling error: ${errorMessage}`);
    client.emit('error', {
      message: errorMessage || 'Failed to send message',
    });
  }
}
