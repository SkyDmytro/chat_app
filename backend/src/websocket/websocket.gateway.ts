import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Logger } from 'nestjs-pino';
import { Server, Socket } from 'socket.io';
import { jwtConstants } from 'src/authentication/constants';
import { UserWithoutPassword } from 'src/authentication/types/userWithoutPassword';
import { ChatService } from 'src/chat/chat.service';
import { MessageEntity } from 'src/messages/dto/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';
import { SendMessageDto, SendMessageDtoSchema } from './dto/sendMessage.dto';

interface JwtPayload {
  email: string;
  sub: number;
}

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    private readonly messagesService: MessagesService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (!token) {
        this.logger.error('No token provided for WebSocket connection');
        client.emit('error', { message: 'No token provided' });
        throw new WsException('No token provided');
      }

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
      this.logger.log(`User ${user.email} connected to WebSocket`);

      const usersChats = await this.chatService
        .findByUserId(user.id)
        .catch((err: Error) => {
          this.logger.error(
            `Failed to fetch chats for user ${user.id}: ${err.message}`,
          );
          throw new WsException('Failed to fetch user chats');
        });

      for (const chat of usersChats) {
        await client.join(`chat_${chat.id}`);
        this.logger.log(`User ${user.email} joined chat_${chat.id}`);
      }
    } catch (error) {
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
      throw error;
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client['user'] as UserWithoutPassword | undefined;
    if (user) {
      this.logger.log(`User ${user.email} disconnected from WebSocket`);
    }
    await client.leave('user');
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    let parsedData: SendMessageDto;
    try {
      const raw: unknown = typeof data === 'string' ? JSON.parse(data) : data;
      parsedData = SendMessageDtoSchema.parse(raw);
    } catch (e) {
      this.logger.error('Invalid message data structure', e);
      client.emit('error', { message: 'Invalid message data structure' });
      throw new WsException('Invalid message data structure');
    }

    try {
      this.logger.log(
        `Received message from client: ${JSON.stringify(parsedData)}`,
      );
      const user = client['user'] as UserWithoutPassword;
      if (!user) {
        this.logger.error('No user found in socket context');
        throw new WsException('Unauthorized');
      }

      if (!parsedData.chatId || !parsedData.content) {
        this.logger.error(
          `Invalid message data: ${JSON.stringify(parsedData)}`,
        );
        client.emit('error', { message: 'Invalid message data' });
        throw new WsException('Invalid message data');
      }

      const chatId = Number(parsedData.chatId);
      if (isNaN(chatId)) {
        this.logger.error(`Invalid chatId: ${parsedData.chatId}`);
        client.emit('error', { message: 'Invalid chat ID' });
        throw new WsException('Invalid chat ID');
      }

      const isUserInChat = await this.chatService
        .isUserInChat(chatId, user.id)
        .catch((err: Error) => {
          this.logger.error(
            `Failed to verify user in chat ${chatId}: ${err.message}`,
          );
          throw new WsException('Failed to verify chat membership');
        });

      if (!isUserInChat) {
        this.logger.warn(`User ${user.id} is not part of chat ${chatId}`);
        client.emit('error', { message: 'User is not part of this chat' });
        throw new WsException('User is not part of this chat');
      }

      const messageEntity: MessageEntity = {
        chatId,
        content: parsedData.content,
        senderId: user.id,
      };

      const message = await this.messagesService
        .createMessage(messageEntity)
        .catch((err: Error) => {
          this.logger.error(`Failed to create message: ${err.message}`);
          throw new WsException('Failed to send message');
        });

      this.server.to(`chat_${chatId}`).emit('newMessage', { content: message });
    } catch (error) {
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
      throw error;
    }
  }
}
