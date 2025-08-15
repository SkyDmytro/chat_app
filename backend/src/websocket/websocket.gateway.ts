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
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/users/users.service';
import { WebSocketService } from './websocket.service';

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
      await this.websocketService.handleConnection(client);
    } catch (error) {
      this.handleWsError(error, client);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.websocketService.handleDisconnect(client);
  }

  @SubscribeMessage('joinChat')
  async joinChat(
    @MessageBody() body: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId } = JSON.parse(body) as { chatId: number };
    try {
      const user = this.websocketService.getUserFromClient(client);

      await this.websocketService.assertUserInChat(chatId, user.id, client);

      await client.join(`chat_${chatId}`);
      this.logger.log(`User ${user.email} joined chat_${chatId}`);
      client.emit('joinedChat', { chatId });
    } catch (error) {
      this.handleWsError(error, client);
    }
  }
  @SubscribeMessage('leaveChat')
  async leaveChat(
    @MessageBody() body: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId } = JSON.parse(body) as { chatId: number };
    try {
      const user = this.websocketService.getUserFromClient(client);

      await this.websocketService.assertUserInChat(chatId, user.id, client);

      await client.leave(`chat_${chatId}`);
      this.logger.log(`User ${user.email} left chat_${chatId}`);
      client.emit('leftChat', { chatId });
    } catch (error) {
      this.handleWsError(error, client);
    }
  }

  @SubscribeMessage('notifyUser')
  notifyUser(
    @MessageBody() data: { userId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { userId, message } = data;

      // Получаем сокет пользователя
      const targetSocket = this.server.sockets.sockets.get(`user_${userId}`);
      if (!targetSocket) {
        throw new WsException('User is not connected');
      }

      // Отправляем сообщение конкретному пользователю
      targetSocket.emit('notification', { message });
      this.logger.log(`Notification sent to user ${userId}`);
    } catch (error) {
      this.handleWsError(error, client);
    }
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
      console.log(parsedData);
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
      const chat = await this.chatService.findById(chatId, user.id);
      const userToNotify = chat?.users.find((u) => u.id !== user.id);

      if (!userToNotify) {
        this.logger.warn(
          `Failed to notify user ${userToNotify}: no other users in chat`,
        );
        return;
      }
      this.websocketService.notifyUserDirectly(
        userToNotify.id,
        parsedData,
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
