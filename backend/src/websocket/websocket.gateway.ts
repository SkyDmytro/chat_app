import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { jwtConstants } from 'src/authentication/constants';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token as string;

    if (!token) {
      client.emit('error', { message: 'No token provided' });
      client.disconnect();
      return;
    }

    const payload: { email: string; sub: number } =
      await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      client.emit('error', { message: 'User not found' });
      client.disconnect();
      return;
    }

    const chatId = client.handshake.query.chatId as string;

    client['user'] = user;

    await client.join(`chat_${chatId}`);
  }

  async handleDisconnect(client: Socket) {
    await client.leave('user');
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { chatId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('12312321', client);

    this.server.to('chat_1').emit('newMessage', { content: '123' });
  }
}
