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
import { UsersService } from 'src/users/users.service';
import { WebSocketService } from './websocket.service';

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
    private readonly websocketService: WebSocketService,
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
    try {
      const parsedData = this.websocketService.parseAndValidateMessage(
        data,
        client,
      );
      const user = this.websocketService.getUserFromClient(client);

      const chatId = this.websocketService.parseChatId(
        parsedData.chatId,
        client,
      );
      await this.websocketService.assertUserInChat(chatId, user.id, client);

      await this.websocketService.createAndEmitMessage(
        chatId,
        parsedData,
        user,
        this.server,
      );
    } catch (error) {
      this.handleWsError(error, client);
    }
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
